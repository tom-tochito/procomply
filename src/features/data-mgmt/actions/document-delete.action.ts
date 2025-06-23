"use server";

import { dbAdmin } from "~/lib/db-admin";
import { deleteFile } from "@/common/services/storage/storage.service";
import { requireAuth } from "@/features/auth/repository/auth.repository";
import { FormState } from "@/common/types/form";

export async function deleteDocumentAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const documentId = formData.get("documentId") as string;
    const tenantSlug = formData.get("tenantSlug") as string;
    
    if (!documentId || !tenantSlug) {
      return {
        error: "Missing required parameters",
        success: false
      };
    }
    
    // Require authentication
    await requireAuth(tenantSlug);
    
    // Get document to retrieve the file path
    const result = await dbAdmin.query({
      documents: {
        $: {
          where: {
            id: documentId
          }
        }
      }
    });
    
    const document = result.documents?.[0];
    if (!document) {
      return {
        error: "Document not found",
        success: false
      };
    }
    
    // Delete file from storage
    if (document.path) {
      try {
        await deleteFile(document.path as `/${string}`);
      } catch (error) {
        console.error("Error deleting file from storage:", error);
        // Continue with database deletion even if storage deletion fails
      }
    }
    
    // Delete document from InstantDB
    await dbAdmin.transact([
      dbAdmin.tx.documents[documentId].delete()
    ]);
    
    return {
      error: null,
      success: true
    };
  } catch (error) {
    console.error("Document deletion error:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to delete document",
      success: false
    };
  }
}