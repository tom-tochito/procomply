"use server";

import { id } from "@instantdb/admin";
import { dbAdmin } from "~/lib/db-admin";
import { getAuthCookies } from "@/features/auth/repository/auth.repository";
import {
  uploadFile,
  deleteFile,
} from "@/common/services/storage/storage.service";
import type { DocumentWithRelations } from "@/features/documents/models";
import type { Building } from "@/features/buildings/models";
import type { Tenant } from "@/features/tenant/models";

export async function uploadDocument(
  building: Building,
  tenant: Tenant,
  file: File
): Promise<string> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  const documentId = id();
  const now = new Date().toISOString();

  // Generate file path
  const fileExtension = file.name.split(".").pop() || "";
  const fileName = `${documentId}.${fileExtension}`;
  const path =
    `/tenant/${tenant.slug}/buildings/${building.id}/documents/${fileName}` as `/${string}`;

  // Upload file to storage
  await uploadFile(path, file);

  // Create document record
  await dbAdmin.transact([
    dbAdmin.tx.documents[documentId]
      .update({
        name: file.name,
        type: file.type || "application/octet-stream",
        path,
        size: file.size,
        uploadedAt: now,
        createdAt: now,
        updatedAt: now,
      })
      .link({
        building: building.id,
        uploader: auth.user.id,
        tenant: tenant.id,
      }),
  ]);

  return documentId;
}

export async function getDocumentsByBuilding(
  building: Building
): Promise<DocumentWithRelations[]> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  const result = await dbAdmin.query({
    documents: {
      $: {
        where: { "building.id": building.id },
        order: { uploadedAt: "desc" },
      },
      building: {},
      uploader: {},
      tenant: {},
    },
  });

  return result.documents || [];
}

export async function getDocumentsByTenant(
  tenant: Tenant
): Promise<DocumentWithRelations[]> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  // Verify user has access
  const isAdmin = auth.user.profile?.role === "admin";
  const belongsToTenant = auth.user.tenant?.id === tenant.id;

  if (!isAdmin && !belongsToTenant) {
    throw new Error("Unauthorized: User must be admin or belong to tenant");
  }

  const result = await dbAdmin.query({
    documents: {
      $: {
        where: { "tenant.id": tenant.id },
        order: { uploadedAt: "desc" },
      },
      building: {},
      uploader: {},
      tenant: {},
    },
  });

  return result.documents || [];
}

export async function deleteDocument(documentId: string): Promise<void> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  // Get document to verify access and get path
  const result = await dbAdmin.query({
    documents: {
      $: {
        where: { id: documentId },
      },
      building: {
        tenant: {},
      },
    },
  });

  const document = result.documents[0];
  if (!document) throw new Error("Document not found");

  // Verify user has access
  const isAdmin = auth.user.profile?.role === "admin";
  const belongsToTenant =
    auth.user.tenant?.id === document.building?.tenant?.id;

  if (!isAdmin && !belongsToTenant) {
    throw new Error("Unauthorized: User must be admin or belong to tenant");
  }

  // Delete from storage
  await deleteFile(document.path as `/${string}`);

  // Delete record
  await dbAdmin.transact([dbAdmin.tx.documents[documentId].delete()]);
}
