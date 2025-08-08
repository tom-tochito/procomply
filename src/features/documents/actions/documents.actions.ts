"use server";

import { revalidatePath } from "next/cache";
import { uploadDocument, deleteDocument } from "../repository/documents.repository";
import { findBuildingById } from "@/features/buildings/repository/buildings.repository";
import { findTenantById } from "@/features/tenant/repository/tenant.repository";

export async function uploadDocumentAction(
  buildingId: string,
  tenantId: string,
  formData: FormData
) {
  try {
    const file = formData.get("file") as File;
    
    if (!file || file.size === 0) {
      return { success: false, error: "No file provided" };
    }
    
    // Get full models
    const building = await findBuildingById(buildingId);
    if (!building) {
      return { success: false, error: "Building not found" };
    }
    
    const tenant = await findTenantById(tenantId);
    if (!tenant) {
      return { success: false, error: "Tenant not found" };
    }
    
    const documentId = await uploadDocument(building, tenant, file);
    revalidatePath(`/tenant/[tenant]/buildings/[id]`, "page");
    
    return { success: true, documentId };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to upload document" 
    };
  }
}

export async function deleteDocumentAction(documentId: string) {
  try {
    await deleteDocument(documentId);
    revalidatePath(`/tenant/[tenant]/buildings/[id]`, "page");
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete document" 
    };
  }
}