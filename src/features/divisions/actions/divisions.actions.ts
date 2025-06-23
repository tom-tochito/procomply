"use server";

import { revalidatePath } from "next/cache";
import { Tenant } from "@/features/tenant/models";
import {
  createDivision,
  updateDivision,
  deleteDivision,
} from "../repository/divisions.repository";

export async function createDivisionAction(
  tenant: Tenant,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const data = {
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      description: formData.get("description") as string | undefined,
    };

    await createDivision(tenant, data);
    revalidatePath(`/tenant/${tenant.slug}/data-mgmt/division`);
    
    return { success: true };
  } catch (error) {
    console.error("Error creating division:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create division" 
    };
  }
}

export async function updateDivisionAction(
  tenant: Tenant,
  divisionId: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const data = {
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      description: formData.get("description") as string | undefined,
    };

    await updateDivision(divisionId, data);
    revalidatePath(`/tenant/${tenant.slug}/data-mgmt/division`);
    
    return { success: true };
  } catch (error) {
    console.error("Error updating division:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update division" 
    };
  }
}

export async function deleteDivisionAction(
  tenant: Tenant,
  divisionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteDivision(divisionId);
    revalidatePath(`/tenant/${tenant.slug}/data-mgmt/division`);
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting division:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete division" 
    };
  }
}