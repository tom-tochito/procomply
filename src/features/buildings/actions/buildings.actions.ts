"use server";

import { revalidatePath } from "next/cache";
import {
  createBuilding,
  updateBuilding,
  deleteBuilding,
  findBuildingById,
} from "../repository/buildings.repository";
import { Tenant } from "@/features/tenant/models";

function parseFormData(formData: FormData) {
  return {
    // Basic Information
    name: formData.get("name") as string,
    division: formData.get("division") as string | undefined,
    divisionId: formData.get("divisionId") as string | undefined,
    
    // Template Data
    templateId: formData.get("templateId") as string | undefined,
    templateData: formData.get("templateData") as string | undefined,
    
    // Image
    imageFile: formData.get("image") as File | null,
  };
}

export async function createBuildingAction(
  tenant: Tenant,
  formData: FormData
) {
  try {
    const data = parseFormData(formData);
    const { imageFile, templateData, ...buildingData } = data;

    // Parse template data if provided
    const parsedTemplateData = templateData ? JSON.parse(templateData) : undefined;

    // Create building with minimal data
    await createBuilding(tenant, {
      ...buildingData,
      ...(parsedTemplateData ? { data: parsedTemplateData } : {}),
      ...(imageFile && imageFile.size > 0 ? { imageFile } : {}),
    });

    revalidatePath(`/tenant/[tenant]/buildings`, "page");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create building",
    };
  }
}

export async function updateBuildingAction(
  tenant: Tenant,
  buildingId: string,
  formData: FormData
) {
  try {
    const data = parseFormData(formData);
    const { imageFile, templateData, ...buildingData } = data;

    // Get existing building to preserve template link
    const existingBuilding = await findBuildingById(buildingId);
    if (!existingBuilding) {
      throw new Error("Building not found");
    }

    // Parse template data if provided
    const parsedTemplateData = templateData ? JSON.parse(templateData) : undefined;

    // Filter out undefined values to create partial update
    const filteredData = Object.entries(buildingData).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        (acc as Record<string, unknown>)[key] = value;
      }
      return acc;
    }, {} as Partial<typeof buildingData>);

    await updateBuilding(tenant, buildingId, {
      ...filteredData,
      ...(parsedTemplateData ? { data: parsedTemplateData } : {}),
      ...(imageFile && imageFile.size > 0 ? { imageFile } : {}),
    }, existingBuilding);

    revalidatePath(`/tenant/[tenant]/buildings`, "page");
    revalidatePath(`/tenant/[tenant]/buildings/[id]`, "page");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update building",
    };
  }
}

export async function deleteBuildingAction(
  tenant: Tenant,
  buildingId: string
) {
  try {
    await deleteBuilding(tenant, buildingId);
    revalidatePath(`/tenant/[tenant]/buildings`, "page");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete building",
    };
  }
}