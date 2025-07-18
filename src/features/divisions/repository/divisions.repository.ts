"use server";

import { id } from "@instantdb/admin";
import { dbAdmin } from "~/lib/db-admin";
import { getAuthCookies } from "@/features/auth/repository/auth.repository";
import type { FullUser } from "@/features/user/repository/user.repository";
import type { DivisionWithTenant, DivisionWithRelations } from "@/features/divisions/models";
import type { Tenant } from "@/features/tenant/models";

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

export async function createDivision(
  tenant: Tenant,
  data: {
    name: string;
    type: string; // "Active", "Archived", "Leased"
    description?: string;
  }
): Promise<string> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  await validateUserAccess(tenant, auth.user);

  const divisionId = id();
  const now = Date.now();

  await dbAdmin.transact([
    dbAdmin.tx.divisions[divisionId]
      .update({
        name: data.name,
        type: data.type,
        ...(data.description && { description: data.description }),
        createdAt: now,
        updatedAt: now,
      })
      .link({ tenant: tenant.id }),
  ]);

  return divisionId;
}

export async function updateDivision(
  divisionId: string,
  data: Partial<{
    name: string;
    type: string;
    description: string;
  }>
): Promise<void> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  // Get division with tenant to validate access
  const divisionResult = await dbAdmin.query({
    divisions: {
      $: {
        where: { id: divisionId },
      },
      tenant: {},
    },
  });

  const division = divisionResult.divisions[0];
  if (!division) throw new Error("Division not found");
  if (!division.tenant) throw new Error("Division has no tenant");

  await validateUserAccess(division.tenant, auth.user);

  await dbAdmin.transact([
    dbAdmin.tx.divisions[divisionId].update({
      ...data,
      updatedAt: Date.now(),
    }),
  ]);
}

export async function deleteDivision(divisionId: string): Promise<void> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  // Get division with tenant to validate access
  const divisionResult = await dbAdmin.query({
    divisions: {
      $: {
        where: { id: divisionId },
      },
      tenant: {},
    },
  });

  const division = divisionResult.divisions[0];
  if (!division) throw new Error("Division not found");
  if (!division.tenant) throw new Error("Division has no tenant");

  await validateUserAccess(division.tenant, auth.user);

  await dbAdmin.transact([dbAdmin.tx.divisions[divisionId].delete()]);
}

export async function getDivisionsByTenant(
  tenant: Tenant
): Promise<DivisionWithRelations[]> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  await validateUserAccess(tenant, auth.user);

  const result = await dbAdmin.query({
    divisions: {
      $: {
        order: { createdAt: "desc" },
      },
      tenant: {},
      buildings: {},
    },
  });

  // Filter divisions by tenant in memory
  const divisionsForTenant = result.divisions.filter(
    (division) => division.tenant?.id === tenant.id
  );

  return divisionsForTenant as DivisionWithRelations[];
}

export async function getDivisionById(
  divisionId: string
): Promise<DivisionWithRelations | null> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  const result = await dbAdmin.query({
    divisions: {
      $: {
        where: { id: divisionId },
      },
      tenant: {},
      buildings: {
        $: {
          order: { createdAt: "desc" },
        },
      },
    },
  });

  const division = result.divisions[0];
  if (!division) return null;
  if (!division.tenant) throw new Error("Division has no tenant");

  await validateUserAccess(division.tenant, auth.user);

  return division;
}

export async function searchDivisions(
  tenant: Tenant,
  query: string
): Promise<DivisionWithTenant[]> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  await validateUserAccess(tenant, auth.user);

  const result = await dbAdmin.query({
    divisions: {
      $: {
        order: { createdAt: "desc" },
      },
      tenant: {},
    },
  });

  // Filter divisions by tenant and search query in memory
  const searchLower = query.toLowerCase();
  const divisionsForTenant = result.divisions.filter(
    (division) => 
      division.tenant?.id === tenant.id &&
      division.name.toLowerCase().includes(searchLower)
  );

  return divisionsForTenant;
}