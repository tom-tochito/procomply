"use server";

import { revalidatePath } from "next/cache";
import { id } from "@instantdb/admin";
import {
  createBuilding,
  updateBuilding,
  deleteBuilding,
} from "../repository/buildings.repository";
import { Tenant } from "@/features/tenant/models";

function parseFormData(formData: FormData) {
  return {
    // Basic Information
    name: formData.get("name") as string,
    description: formData.get("description") as string | undefined,
    address: formData.get("address") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    zipCode: formData.get("zipCode") as string,
    floors: parseInt(formData.get("floors") as string),
    
    // General Data
    division: formData.get("division") as string | undefined,
    billingAccount: formData.get("billingAccount") as string | undefined,
    availability: formData.get("availability") as string | undefined,
    openingHours: formData.get("openingHours") as string | undefined,
    archived: formData.get("archived") === "on",
    siteAccess: formData.get("siteAccess") as string | undefined,
    
    // Position Data
    complex: formData.get("complex") as string | undefined,
    
    // Maintenance Data
    condition: formData.get("condition") as string | undefined,
    criticality: formData.get("criticality") as string | undefined,
    fireRiskRating: formData.get("fireRiskRating") as string | undefined,
    lastCheckDate: formData.get("lastCheckDate") as string | undefined,
    
    // Dimensional Data
    totalGrossArea: formData.get("totalGrossArea") ? parseInt(formData.get("totalGrossArea") as string) : undefined,
    totalNetArea: formData.get("totalNetArea") ? parseInt(formData.get("totalNetArea") as string) : undefined,
    coveredArea: formData.get("coveredArea") ? parseInt(formData.get("coveredArea") as string) : undefined,
    glazedArea: formData.get("glazedArea") ? parseInt(formData.get("glazedArea") as string) : undefined,
    cleanableArea: formData.get("cleanableArea") ? parseInt(formData.get("cleanableArea") as string) : undefined,
    totalVolume: formData.get("totalVolume") ? parseInt(formData.get("totalVolume") as string) : undefined,
    heatedVolume: formData.get("heatedVolume") ? parseInt(formData.get("heatedVolume") as string) : undefined,
    numberOfRooms: formData.get("numberOfRooms") ? parseInt(formData.get("numberOfRooms") as string) : undefined,
    numberOfUnits: formData.get("numberOfUnits") ? parseInt(formData.get("numberOfUnits") as string) : undefined,
    
    // Contact Information
    outOfHourContact: formData.get("outOfHourContact") as string | undefined,
    telephone: formData.get("telephone") as string | undefined,
    
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
    const { imageFile, ...buildingData } = data;

    // Generate building ID first
    const buildingId = id();

    // Create building with all data including image file
    await createBuilding(tenant, {
      ...buildingData,
      ...(imageFile && imageFile.size > 0 ? { imageFile } : {}),
    }, buildingId);

    revalidatePath(`/tenant/[tenant]/buildings`, "page");
    return { success: true, buildingId };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create building",
    };
  }
}

export async function updateBuildingAction(
  buildingId: string,
  formData: FormData
) {
  try {
    const data = parseFormData(formData);
    const { imageFile, ...buildingData } = data;

    // Filter out undefined values to create partial update
    const filteredData = Object.entries(buildingData).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        (acc as Record<string, unknown>)[key] = value;
      }
      return acc;
    }, {} as Partial<typeof buildingData>);

    await updateBuilding(buildingId, {
      ...filteredData,
      ...(imageFile && imageFile.size > 0 ? { imageFile } : {}),
    });

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

export async function deleteBuildingAction(buildingId: string) {
  try {
    await deleteBuilding(buildingId);
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