"use server";

import { revalidatePath } from "next/cache";
import { Tenant } from "@/features/tenant/models";
import {
  createTeam,
  updateTeam,
  deleteTeam,
} from "../repository/teams.repository";

export async function createTeamAction(
  tenant: Tenant,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const data = {
      code: formData.get("code") as string | undefined,
      description: formData.get("description") as string,
      companyId: formData.get("companyId") as string | undefined,
      supervisorId: formData.get("supervisorId") as string | undefined,
      tenantId: tenant.id,
    };

    await createTeam(data);
    revalidatePath(`/tenant/${tenant.slug}/data-mgmt/team`);
    
    return { success: true };
  } catch (error) {
    console.error("Error creating team:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create team" 
    };
  }
}

export async function updateTeamAction(
  tenant: Tenant,
  teamId: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const data = {
      code: formData.get("code") as string | undefined,
      description: formData.get("description") as string,
      companyId: formData.get("companyId") as string | undefined,
      supervisorId: formData.get("supervisorId") as string | undefined,
    };

    await updateTeam(teamId, data);
    revalidatePath(`/tenant/${tenant.slug}/data-mgmt/team`);
    
    return { success: true };
  } catch (error) {
    console.error("Error updating team:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update team" 
    };
  }
}

export async function deleteTeamAction(
  tenant: Tenant,
  teamId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteTeam(teamId);
    revalidatePath(`/tenant/${tenant.slug}/data-mgmt/team`);
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting team:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete team" 
    };
  }
}