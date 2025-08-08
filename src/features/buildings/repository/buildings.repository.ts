"use server";

import { id } from "@instantdb/admin";
import { dbAdmin } from "~/lib/db-admin";
import { getAuthCookies } from "@/features/auth/repository/auth.repository";
import type { FullUser } from "@/features/user/repository/user.repository";
import type {
  BuildingWithTenant,
  BuildingWithDivision,
  BuildingWithRelations,
} from "@/features/buildings/models";
import type { Tenant } from "@/features/tenant/models";
import {
  uploadFile,
  deleteFile,
} from "@/common/services/storage/storage.service";
import { getCurrentTimestamp } from "@/common/utils/date";

async function validateUserAccess(
  tenant: Tenant,
  user: FullUser
): Promise<void> {
  const isAdmin = user.profile?.role === "admin";
  const belongsToTenant = user.tenant?.id === tenant.id;

  if (!isAdmin && !belongsToTenant) {
    throw new Error("Unauthorized: User must be admin or belong to tenant");
  }
}

export async function createBuilding(
  tenant: Tenant,
  data: {
    name: string;
    division?: string;
    divisionId?: string;
    imageFile?: File;
    templateId?: string;
    templateData?: Record<string, unknown>;
  }
): Promise<BuildingWithTenant> {
  const authData = await getAuthCookies();
  if (!authData || !authData.user) {
    throw new Error("User not authenticated");
  }
  const { user } = authData;

  await validateUserAccess(tenant, user);

  const buildingId = id();

  // Handle image upload if provided
  let imagePath: string | undefined;
  if (data.imageFile) {
    imagePath = await uploadFile(
      tenant.slug,
      `buildings/${buildingId}`,
      data.imageFile
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { imageFile, templateData, ...buildingData } = data;

  const transaction = dbAdmin.tx.buildings[buildingId]
    .update({
      name: data.name,
      ...(data.division && { division: data.division }),
      ...(imagePath && { image: imagePath }),
      ...(templateData && { data: templateData }),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    })
    .link({
      tenant: tenant.id,
      ...(data.divisionId && { divisionEntity: data.divisionId }),
      ...(data.templateId && { template: data.templateId }),
    });

  await dbAdmin.transact([transaction]);

  const queryResponse = await dbAdmin.query({
    buildings: {
      $: {
        where: { id: buildingId },
      },
      tenant: {},
    },
  });

  const buildings = queryResponse.buildings;
  if (!buildings || buildings.length === 0) {
    throw new Error("Building not found after creation");
  }

  return buildings[0] as BuildingWithTenant;
}

export async function updateBuilding(
  tenant: Tenant,
  buildingId: string,
  data: {
    name?: string;
    division?: string;
    divisionId?: string;
    imageFile?: File;
    templateId?: string;
    templateData?: Record<string, unknown>;
  },
  existingBuilding?: BuildingWithRelations
): Promise<BuildingWithTenant> {
  const authData = await getAuthCookies();
  if (!authData || !authData.user) {
    throw new Error("User not authenticated");
  }
  const { user } = authData;

  await validateUserAccess(tenant, user);

  // Handle image upload if provided
  let imagePath: string | undefined;
  if (data.imageFile) {
    // Delete old image if it exists
    if (existingBuilding?.image) {
      await deleteFile(tenant.slug, existingBuilding.image);
    }

    imagePath = await uploadFile(
      tenant.slug,
      `buildings/${buildingId}`,
      data.imageFile
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { imageFile, templateData, divisionId, templateId, ...buildingData } = data;

  const updateData: Record<string, unknown> = {
    ...buildingData,
    ...(imagePath && { image: imagePath }),
    ...(templateData && { data: templateData }),
    updatedAt: getCurrentTimestamp(),
  };

  const transaction = dbAdmin.tx.buildings[buildingId].update(updateData);

  // Handle links separately
  const transactions = [transaction];
  
  if (divisionId !== undefined) {
    if (divisionId) {
      transactions.push(
        dbAdmin.tx.buildings[buildingId].link({ divisionEntity: divisionId })
      );
    } else if (existingBuilding?.divisionEntity) {
      transactions.push(
        dbAdmin.tx.buildings[buildingId].unlink({ divisionEntity: existingBuilding.divisionEntity.id })
      );
    }
  }

  if (templateId !== undefined) {
    if (templateId) {
      transactions.push(
        dbAdmin.tx.buildings[buildingId].link({ template: templateId })
      );
    } else if (existingBuilding?.template) {
      transactions.push(
        dbAdmin.tx.buildings[buildingId].unlink({ template: existingBuilding.template.id })
      );
    }
  }

  await dbAdmin.transact(transactions);

  const queryResponse = await dbAdmin.query({
    buildings: {
      $: {
        where: { id: buildingId },
      },
      tenant: {},
    },
  });

  const buildings = queryResponse.buildings;
  if (!buildings || buildings.length === 0) {
    throw new Error("Building not found after update");
  }

  return buildings[0] as BuildingWithTenant;
}

export async function deleteBuilding(
  tenant: Tenant,
  buildingId: string
): Promise<void> {
  const authData = await getAuthCookies();
  if (!authData || !authData.user) {
    throw new Error("User not authenticated");
  }
  const { user } = authData;

  await validateUserAccess(tenant, user);

  // Get building to check for image
  const queryResponse = await dbAdmin.query({
    buildings: {
      $: {
        where: { id: buildingId },
      },
    },
  });

  const building = queryResponse.buildings?.[0];
  if (!building) {
    throw new Error("Building not found");
  }

  // Delete image if exists
  if (building.image) {
    await deleteFile(tenant.slug, building.image);
  }

  // Delete the building
  await dbAdmin.transact([dbAdmin.tx.buildings[buildingId].delete()]);
}

export async function findBuildingById(
  buildingId: string
): Promise<BuildingWithRelations | null> {
  const queryResponse = await dbAdmin.query({
    buildings: {
      $: {
        where: { id: buildingId },
      },
      tenant: {},
      divisionEntity: {},
      template: {},
      documents: { uploader: {} },
      inspections: {},
      tasks: {},
    },
  });

  const buildings = queryResponse.buildings;
  if (!buildings || buildings.length === 0) {
    return null;
  }

  return buildings[0] as BuildingWithRelations;
}

export async function findBuildingsByTenant(
  tenantId: string
): Promise<BuildingWithDivision[]> {
  const queryResponse = await dbAdmin.query({
    buildings: {
      $: {
        where: { "tenant.id": tenantId },
      },
      divisionEntity: {},
    },
  });

  return (queryResponse.buildings || []) as BuildingWithDivision[];
}