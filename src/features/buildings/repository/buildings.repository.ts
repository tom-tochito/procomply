"use server";

import { id } from "@instantdb/admin";
import { dbAdmin } from "~/lib/db-admin";
import { getAuthCookies } from "@/features/auth/repository/auth.repository";
import type { FullUser } from "@/features/user/repository/user.repository";
import type {
  BuildingWithTenant,
  BuildingWithRelations,
} from "@/features/buildings/models";
import type { Tenant } from "@/features/tenant/models";
import {
  uploadFile,
  deleteFile,
} from "@/common/services/storage/storage.service";

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
    description?: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    floors: number;
    imageFile?: File;
    // General Data
    division?: string;
    divisionId?: string;
    billingAccount?: string;
    availability?: string;
    openingHours?: string;
    archived?: boolean;
    siteAccess?: string;
    // Position Data
    complex?: string;
    // Maintenance Data
    condition?: string;
    criticality?: string;
    fireRiskRating?: string;
    lastCheckDate?: string;
    // Dimensional Data
    totalGrossArea?: number;
    totalNetArea?: number;
    coveredArea?: number;
    glazedArea?: number;
    cleanableArea?: number;
    totalVolume?: number;
    heatedVolume?: number;
    numberOfRooms?: number;
    numberOfUnits?: number;
    // Contact Information
    outOfHourContact?: string;
    telephone?: string;
  },
  buildingId?: string
): Promise<string> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  await validateUserAccess(tenant, auth.user);

  const finalBuildingId = buildingId || id();
  const now = new Date().toISOString();

  // Handle image upload if provided
  let imagePath: string | undefined;
  if (data.imageFile) {
    // Preserve original filename
    const originalFileName = data.imageFile.name;
    imagePath = await uploadFile(
      `/tenant/${tenant.slug}/buildings/${finalBuildingId}/${originalFileName}` as `/${string}`,
      data.imageFile
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { imageFile, lastCheckDate, ...buildingData } = data;

  const transaction = dbAdmin.tx.buildings[finalBuildingId]
    .update({
      // Required fields
      name: data.name,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      floors: data.floors,
      archived: data.archived || false,

      // Optional fields - only include if provided
      ...(data.description && { description: data.description }),
      ...(data.division && { division: data.division }),
      ...(data.billingAccount && { billingAccount: data.billingAccount }),
      ...(data.availability && { availability: data.availability }),
      ...(data.openingHours && { openingHours: data.openingHours }),
      ...(data.siteAccess && { siteAccess: data.siteAccess }),
      ...(data.complex && { complex: data.complex }),
      ...(data.condition && { condition: data.condition }),
      ...(data.criticality && { criticality: data.criticality }),
      ...(data.fireRiskRating && { fireRiskRating: data.fireRiskRating }),
      ...(lastCheckDate && {
        lastCheckDate: new Date(lastCheckDate).toISOString(),
      }),
      ...(data.outOfHourContact && {
        outOfHourContact: data.outOfHourContact,
      }),
      ...(data.telephone && { telephone: data.telephone }),
      ...(imagePath && { image: imagePath }),

      // Optional dimensional data fields
      ...(data.totalGrossArea && { totalGrossArea: data.totalGrossArea }),
      ...(data.totalNetArea && { totalNetArea: data.totalNetArea }),
      ...(data.coveredArea && { coveredArea: data.coveredArea }),
      ...(data.glazedArea && { glazedArea: data.glazedArea }),
      ...(data.cleanableArea && { cleanableArea: data.cleanableArea }),
      ...(data.totalVolume && { totalVolume: data.totalVolume }),
      ...(data.heatedVolume && { heatedVolume: data.heatedVolume }),
      ...(data.numberOfRooms && { numberOfRooms: data.numberOfRooms }),
      ...(data.numberOfUnits && { numberOfUnits: data.numberOfUnits }),

      // Timestamps
      createdAt: now,
      updatedAt: now,
    })
    .link({ 
      tenant: tenant.id,
      ...(data.divisionId && { divisionEntity: data.divisionId })
    });

  await dbAdmin.transact([transaction]);

  return finalBuildingId;
}

export async function updateBuilding(
  buildingId: string,
  data: Partial<{
    name: string;
    description: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    floors: number;
    imageFile: File;
    // General Data
    division: string;
    divisionId: string;
    billingAccount: string;
    availability: string;
    openingHours: string;
    archived: boolean;
    siteAccess: string;
    // Position Data
    complex: string;
    // Maintenance Data
    condition: string;
    criticality: string;
    fireRiskRating: string;
    lastCheckDate: string;
    // Dimensional Data
    totalGrossArea: number;
    totalNetArea: number;
    coveredArea: number;
    glazedArea: number;
    cleanableArea: number;
    totalVolume: number;
    heatedVolume: number;
    numberOfRooms: number;
    numberOfUnits: number;
    // Contact Information
    outOfHourContact: string;
    telephone: string;
  }>
): Promise<void> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  // Get building with tenant to validate access
  const buildingResult = await dbAdmin.query({
    buildings: {
      $: {
        where: { id: buildingId },
      },
      tenant: {},
    },
  });

  const building = buildingResult.buildings[0];
  if (!building) throw new Error("Building not found");
  if (!building.tenant) throw new Error("Building has no tenant");

  await validateUserAccess(building.tenant, auth.user);

  // Handle image upload if provided
  let imagePath: string | undefined;
  if (data.imageFile) {
    // Delete old image if exists
    if (building.image) {
      try {
        await deleteFile(building.image as `/${string}`);
      } catch (error) {
        console.error("Failed to delete old image:", error);
      }
    }

    // Upload new image with original filename
    const originalFileName = data.imageFile.name;
    imagePath = await uploadFile(
      `/tenant/${building.tenant.slug}/buildings/${buildingId}/${originalFileName}` as `/${string}`,
      data.imageFile
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { imageFile, lastCheckDate, divisionId, ...buildingData } = data;

  const updateTransaction = dbAdmin.tx.buildings[buildingId].update({
    ...buildingData,
    ...(imagePath && { image: imagePath }),
    ...(lastCheckDate && {
      lastCheckDate: new Date(lastCheckDate).toISOString(),
    }),
    updatedAt: new Date().toISOString(),
  });

  // Handle division linking separately
  const transactions = [updateTransaction];
  
  if (divisionId !== undefined) {
    if (divisionId) {
      // Link to new division
      transactions.push(
        dbAdmin.tx.buildings[buildingId].link({ divisionEntity: divisionId })
      );
    } else {
      // Unlink from current division if divisionId is empty
      const currentBuilding = await dbAdmin.query({
        buildings: {
          $: { where: { id: buildingId } },
          divisionEntity: {}
        }
      });
      
      if (currentBuilding.buildings[0]?.divisionEntity) {
        transactions.push(
          dbAdmin.tx.buildings[buildingId].unlink({ 
            divisionEntity: currentBuilding.buildings[0].divisionEntity.id 
          })
        );
      }
    }
  }

  await dbAdmin.transact(transactions);
}

export async function deleteBuilding(buildingId: string): Promise<void> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  // Get building with tenant to validate access
  const buildingResult = await dbAdmin.query({
    buildings: {
      $: {
        where: { id: buildingId },
      },
      tenant: {},
    },
  });

  const building = buildingResult.buildings[0];
  if (!building) throw new Error("Building not found");
  if (!building.tenant) throw new Error("Building has no tenant");

  await validateUserAccess(building.tenant, auth.user);

  await dbAdmin.transact([dbAdmin.tx.buildings[buildingId].delete()]);
}

export async function getBuildingsByTenant(
  tenant: Tenant
): Promise<BuildingWithTenant[]> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  await validateUserAccess(tenant, auth.user);

  const result = await dbAdmin.query({
    buildings: {
      $: {
        where: { "tenant.id": tenant.id },
        order: { createdAt: "desc" },
      },
      tenant: {},
    },
  });

  return result.buildings;
}

export async function getBuildingById(
  buildingId: string
): Promise<BuildingWithRelations | null> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  const result = await dbAdmin.query({
    buildings: {
      $: {
        where: { id: buildingId },
      },
      tenant: {},
      divisionEntity: {},
      tasks: {
        $: {
          order: { createdAt: "desc" },
        },
      },
      inspections: {
        $: {
          order: { scheduledDate: "desc" },
        },
      },
      documents: {
        $: {
          order: { uploadedAt: "desc" },
        },
        uploader: {},
      },
    },
  });

  const building = result.buildings[0];
  if (!building) return null;
  if (!building.tenant) throw new Error("Building has no tenant");

  await validateUserAccess(building.tenant, auth.user);

  return building;
}

export async function searchBuildings(
  tenant: Tenant,
  query: string
): Promise<BuildingWithTenant[]> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  await validateUserAccess(tenant, auth.user);

  // Search by name, city, or state
  const searchPattern = `%${query}%`;

  const result = await dbAdmin.query({
    buildings: {
      $: {
        where: {
          and: [
            { "tenant.id": tenant.id },
            {
              or: [
                { name: { $ilike: searchPattern } },
                { city: { $ilike: searchPattern } },
                { state: { $ilike: searchPattern } },
                { address: { $ilike: searchPattern } },
              ],
            },
          ],
        },
        order: { createdAt: "desc" },
      },
      tenant: {},
    },
  });

  return (result.buildings || []) as BuildingWithTenant[];
}

export async function getBuildingsWithComplianceStats(
  tenant: Tenant
): Promise<
  (BuildingWithTenant & { taskStats: { total: number; completed: number } })[]
> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  await validateUserAccess(tenant, auth.user);

  try {
    const result = await dbAdmin.query({
      buildings: {
        $: {
          where: { "tenant.id": tenant.id },
          order: { createdAt: "desc" },
        },
        tenant: {},
        divisionEntity: {},
      },
    });

    // Calculate compliance stats
    const buildings = result.buildings || [];
    return buildings.map((building) => {
      // TODO: Add tasks back when we understand the validation error
      const taskStats = {
        total: 0,
        completed: 0,
      };

      return {
        ...building,
        taskStats,
      };
    });
  } catch (error) {
    console.error("Error fetching buildings with compliance stats:", error);
    throw error;
  }
}
