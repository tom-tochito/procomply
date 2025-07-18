"use server";

import { id } from "@instantdb/admin";
import { dbAdmin } from "~/lib/db-admin";
import { getAuthCookies } from "@/features/auth/repository/auth.repository";
import type { FullUser } from "@/features/user/repository/user.repository";
import type { Team, TeamWithRelations } from "@/features/teams/models";
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

export async function getTeamsByTenant(
  tenant: Tenant
): Promise<TeamWithRelations[]> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  await validateUserAccess(tenant, auth.user);

  const result = await dbAdmin.query({
    teams: {
      $: {
        order: { createdAt: "desc" },
      },
      tenant: {},
      company: {},
      supervisor: {},
    },
  });

  // Filter teams by tenant in memory
  const teamsForTenant = result.teams.filter(
    (team) => team.tenant?.id === tenant.id
  );

  // Sort by code in memory since it's not indexed
  teamsForTenant.sort((a, b) => {
    const codeA = a.code || '';
    const codeB = b.code || '';
    return codeA.localeCompare(codeB);
  });

  return teamsForTenant as TeamWithRelations[];
}

export async function createTeam(
  data: {
    code?: string;
    description: string;
    companyId?: string;
    supervisorId?: string;
    tenantId: string;
  }
): Promise<Team> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  const teamId = id();
  const now = Date.now();

  const transactions = [
    dbAdmin.tx.teams[teamId]
      .update({
        code: data.code,
        description: data.description,
        createdAt: now,
        updatedAt: now,
      })
      .link({
        tenant: data.tenantId,
        ...(data.companyId && { company: data.companyId }),
        ...(data.supervisorId && { supervisor: data.supervisorId }),
      }),
  ];

  await dbAdmin.transact(transactions);

  const result = await dbAdmin.query({
    teams: {
      $: { where: { id: teamId } },
    },
  });

  return result.teams[0];
}

export async function updateTeam(
  teamId: string,
  data: Partial<{
    code: string;
    description: string;
    companyId: string;
    supervisorId: string;
  }>
): Promise<boolean> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  try {
    const updates: Record<string, unknown> = {
      updatedAt: Date.now(),
    };

    if (data.code !== undefined) updates.code = data.code;
    if (data.description !== undefined) updates.description = data.description;

    const transactions = [dbAdmin.tx.teams[teamId].update(updates)];

    // Update links if provided
    if (data.companyId !== undefined) {
      if (data.companyId) {
        transactions.push(
          dbAdmin.tx.teams[teamId].link({ company: data.companyId })
        );
      }
    }

    if (data.supervisorId !== undefined) {
      if (data.supervisorId) {
        transactions.push(
          dbAdmin.tx.teams[teamId].link({ supervisor: data.supervisorId })
        );
      }
    }

    await dbAdmin.transact(transactions);
    return true;
  } catch (error) {
    console.error("Error updating team:", error);
    return false;
  }
}

export async function deleteTeam(teamId: string): Promise<boolean> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  try {
    await dbAdmin.transact([dbAdmin.tx.teams[teamId].delete()]);
    return true;
  } catch (error) {
    console.error("Error deleting team:", error);
    return false;
  }
}