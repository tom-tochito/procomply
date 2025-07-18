"use server";

import { dbAdmin } from "~/lib/db-admin";
import { uploadFile } from "@/common/services/storage/storage.service";
import { requireAuth } from "@/features/auth";
import { findTenantById } from "@/features/tenant/repository/tenant.repository";
import { getBuildingById } from "@/features/buildings/repository/buildings.repository";
import { FormState } from "@/common/types/form";

export async function uploadDocumentForDataMgmtAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const tenantId = formData.get("tenantId") as string;
    const buildingId = formData.get("buildingId") as string;
    const file = formData.get("file") as File;
    const docType = formData.get("docType") as string;
    const code = formData.get("code") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const docCategory = formData.get("docCategory") as string;

    // These fields are collected but not yet stored in the current schema
    // They can be used in future schema updates
    // const reference = formData.get("reference") as string;
    // const subCategory = formData.get("subCategory") as string;
    // const validFrom = formData.get("validFrom") as string;
    // const expiry = formData.get("expiry") as string;
    // const isStatutory = formData.get("isStatutory") === "on";

    // Validate required fields
    if (
      !tenantId ||
      !file ||
      !docType ||
      !code ||
      !description ||
      !category ||
      !docCategory
    ) {
      return {
        error: "Please fill in all required fields",
        success: false,
      };
    }

    // Validate file
    if (file.size === 0) {
      return {
        error: "Please select a file to upload",
        success: false,
      };
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return {
        error: "File size must be less than 10MB",
        success: false,
      };
    }

    // Get file extension
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";

    // Determine file type category for better organization
    const getFileCategory = (ext: string) => {
      // Documents
      if (["pdf", "doc", "docx", "txt", "rtf", "odt"].includes(ext))
        return "document";
      // Spreadsheets
      if (["xls", "xlsx", "csv", "ods"].includes(ext)) return "spreadsheet";
      // Images
      if (["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(ext))
        return "image";
      // Videos
      if (["mp4", "avi", "mov", "wmv", "flv", "webm"].includes(ext))
        return "video";
      // Audio
      if (["mp3", "wav", "flac", "aac", "ogg", "wma"].includes(ext))
        return "audio";
      // Archives
      if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "archive";
      // Code
      if (
        [
          "js",
          "ts",
          "jsx",
          "tsx",
          "html",
          "css",
          "json",
          "xml",
          "py",
          "java",
          "cpp",
          "c",
          "h",
        ].includes(ext)
      )
        return "code";
      // Default
      return "other";
    };

    const fileCategory = getFileCategory(fileExtension);

    // Get tenant
    const tenant = await findTenantById(tenantId);
    if (!tenant) {
      return {
        error: "Tenant not found",
        success: false,
      };
    }

    // Get authenticated user
    const authData = await requireAuth(tenant);
    const user = authData.user;

    // Get building if specified
    let building = null;
    if (buildingId) {
      building = await getBuildingById(buildingId);
      if (!building) {
        return {
          error: "Building not found",
          success: false,
        };
      }
    }

    // Generate storage path following the expected pattern
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const path = `/files/documents/${fileCategory}/${timestamp}-${safeName}`;

    // Upload file to storage
    const uploadedPath = await uploadFile(tenant.slug, path, file);

    // Create document record in InstantDB
    const documentId = crypto.randomUUID();

    const documentData = {
      id: documentId,
      name: file.name,
      type:
        file.type ||
        `application/${fileExtension}` ||
        "application/octet-stream",
      path: uploadedPath,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Build transaction with links
    const txns = [
      dbAdmin.tx.documents[documentId].update(documentData).link({
        tenant: tenant.id,
        uploader: user.id,
        ...(building ? { building: building.id } : {}),
      }),
    ];

    // Execute transaction
    await dbAdmin.transact(txns);

    return {
      error: null,
      success: true,
    };
  } catch (error) {
    console.error("Document upload error:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to upload document",
      success: false,
    };
  }
}
