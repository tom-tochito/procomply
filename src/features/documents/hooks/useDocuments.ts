"use client";

import { db } from "~/lib/db";
import { Building } from "@/features/buildings/models";
import { Tenant } from "@/features/tenant/models";

interface UseDocumentsParams {
  tenant?: Tenant;
  building?: Building;
  searchTerm?: string;
  categoryFilter?: string;
  fileTypeFilter?: string;
}

export function useDocuments({
  tenant,
  building,
  searchTerm,
  categoryFilter,
  fileTypeFilter,
}: UseDocumentsParams) {
  // Build where clause based on filters
  const whereClause: Record<string, string> = {};
  
  if (tenant) {
    whereClause.tenant = tenant.id;
  }
  
  if (building) {
    whereClause.building = building.id;
  }

  // Use InstantDB query with relations
  const { data, isLoading, error } = db.useQuery({
    documents: {
      $: {
        where: whereClause,
      },
      building: {},
      uploader: {},
      tenant: {},
    },
  });

  // Apply client-side filters
  let filteredDocuments = data?.documents || [];

  // Search filter
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filteredDocuments = filteredDocuments.filter(
      (doc) =>
        doc.name.toLowerCase().includes(searchLower) ||
        doc.type.toLowerCase().includes(searchLower)
    );
  }

  // Category filter
  if (categoryFilter && categoryFilter !== "all") {
    filteredDocuments = filteredDocuments.filter((doc) => {
      return doc.docCategory === categoryFilter;
    });
  }

  // File type filter
  if (fileTypeFilter && fileTypeFilter !== "all") {
    filteredDocuments = filteredDocuments.filter((doc) => {
      const extension = doc.name.split(".").pop()?.toLowerCase() || "";
      switch (fileTypeFilter) {
        case "pdf":
          return extension === "pdf";
        case "doc":
          return ["doc", "docx"].includes(extension);
        case "xls":
          return ["xls", "xlsx"].includes(extension);
        case "image":
          return ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(extension);
        default:
          return true;
      }
    });
  }

  // Sort by upload date (newest first)
  filteredDocuments.sort((a, b) => b.uploadedAt - a.uploadedAt);

  return {
    documents: filteredDocuments,
    isLoading,
    error,
    totalCount: data?.documents.length || 0,
    filteredCount: filteredDocuments.length,
  };
}

// Hook for getting document counts by category
export function useDocumentCounts(tenant?: Tenant, building?: Building) {
  const { documents } = useDocuments({ tenant, building });

  // TODO: Fetch categories from database instead of hardcoding
  // For now, dynamically build counts from actual document categories
  const categoryCounts: Record<string, number> = {};

  // Count documents by category
  documents.forEach((doc) => {
    const category = doc.docCategory || "Miscellaneous";
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  return categoryCounts;
}

// Hook for getting a single document with relations
export function useDocument(documentId: string) {
  const { data, isLoading, error } = db.useQuery({
    documents: {
      $: {
        where: {
          id: documentId,
        },
      },
      building: {},
      uploader: {
        profile: {},
      },
      tenant: {},
    },
  });

  return {
    document: data?.documents[0],
    isLoading,
    error,
  };
}