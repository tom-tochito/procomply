"use server";

import { revalidatePath } from "next/cache";
import { Tenant } from "@/features/tenant/models";
import {
  createCompany,
  updateCompany,
  deleteCompany,
} from "../repository/companies.repository";

export async function createCompanyAction(
  tenant: Tenant,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const data = {
      name: formData.get("name") as string,
      referral: formData.get("referral") as string,
      category: formData.get("category") as string | undefined,
      email: formData.get("email") as string | undefined,
      phone: formData.get("phone") as string | undefined,
      postcode: formData.get("postcode") as string | undefined,
      numberOfEmployees: formData.get("numberOfEmployees") 
        ? parseInt(formData.get("numberOfEmployees") as string) 
        : undefined,
    };

    await createCompany(tenant, data);
    revalidatePath(`/tenant/${tenant.slug}/data-mgmt/company`);
    
    return { success: true };
  } catch (error) {
    console.error("Error creating company:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create company" 
    };
  }
}

export async function updateCompanyAction(
  tenant: Tenant,
  companyId: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const data = {
      name: formData.get("name") as string,
      referral: formData.get("referral") as string,
      category: formData.get("category") as string | undefined,
      email: formData.get("email") as string | undefined,
      phone: formData.get("phone") as string | undefined,
      postcode: formData.get("postcode") as string | undefined,
      numberOfEmployees: formData.get("numberOfEmployees") 
        ? parseInt(formData.get("numberOfEmployees") as string) 
        : undefined,
    };

    await updateCompany(companyId, data);
    revalidatePath(`/tenant/${tenant.slug}/data-mgmt/company`);
    
    return { success: true };
  } catch (error) {
    console.error("Error updating company:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update company" 
    };
  }
}

export async function deleteCompanyAction(
  tenant: Tenant,
  companyId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteCompany(companyId);
    revalidatePath(`/tenant/${tenant.slug}/data-mgmt/company`);
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting company:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete company" 
    };
  }
}