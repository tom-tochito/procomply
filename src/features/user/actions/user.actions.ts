"use server";

import { revalidatePath } from "next/cache";
import { Tenant } from "@/features/tenant/models";
import {
  createUser,
  updateUser,
} from "../repository/user.repository";

export async function createUserAction(
  tenant: Tenant,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const data = {
      email: formData.get("email") as string,
      role: formData.get("role") as string || "user",
      tenantId: tenant.id,
      name: formData.get("name") as string | undefined,
      phone: formData.get("phone") as string | undefined,
      phoneMobile: formData.get("phoneMobile") as string | undefined,
      position: formData.get("position") as string | undefined,
      companyId: formData.get("companyId") as string | undefined,
    };

    const user = await createUser(data);
    if (user) {
      revalidatePath(`/tenant/${tenant.slug}/data-mgmt/person`);
      return { success: true };
    }
    
    return { success: false, error: "Failed to create user" };
  } catch (error) {
    console.error("Error creating user:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create user" 
    };
  }
}

export async function updateUserAction(
  tenant: Tenant,
  userId: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const data = {
      email: formData.get("email") as string,
      role: formData.get("role") as string,
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      phoneMobile: formData.get("phoneMobile") as string,
      position: formData.get("position") as string,
      companyId: formData.get("companyId") as string,
    };

    await updateUser(userId, data);
    revalidatePath(`/tenant/${tenant.slug}/data-mgmt/person`);
    
    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update user" 
    };
  }
}