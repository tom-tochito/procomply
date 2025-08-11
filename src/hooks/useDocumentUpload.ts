"use client";

import { useState } from "react";
import { uploadDocumentAction } from "@/features/documents/actions/upload-document.action";

export function useDocumentUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadDocument = async (
    file: File,
    buildingId: string,
    metadata?: {
      category?: string;
      docCategory?: string;
      description?: string;
    }
  ) => {
    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadDocumentAction({
        file,
        buildingId,
        ...metadata,
      });

      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadDocument,
    isUploading,
    error,
  };
}