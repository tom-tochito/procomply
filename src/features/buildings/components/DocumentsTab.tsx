"use client";

import React, { useState } from "react";
import { Search, Upload } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import DocumentTable from "@/features/documents/components/DocumentTable";
import DocumentViewer from "@/features/documents/components/DocumentViewer";
import UploadDocumentDialog from "@/features/documents/components/UploadDocumentDialog";
import { Building } from "@/features/buildings/models";
import { Tenant } from "@/features/tenant/models";
import { getStorageFileUrl } from "@/common/utils/storage";
import { DocumentWithRelations } from "@/features/documents/models";
import { toast } from "sonner";
import { Id } from "~/convex/_generated/dataModel";

interface DocumentsTabProps {
  building: Building;
  tenant: Tenant;
}

export default function DocumentsTab({
  building,
  tenant,
}: DocumentsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentWithRelations | null>(null);

  // TODO: Migrate useDocuments to Convex
  const documents: DocumentWithRelations[] = [];
  const isLoading = false;
  // const error = null;

  const handleDocumentClick = (document: DocumentWithRelations) => {
    setSelectedDocument(document);
    setViewerOpen(true);
  };

  const handleDownload = (document: DocumentWithRelations) => {
    if (document.path) {
      const downloadUrl = getStorageFileUrl(tenant.slug, document.path);
      window.open(downloadUrl, "_blank");
    } else {
      alert("File path not available");
    }
  };

  const deleteDocument = useMutation(api.documents.deleteDocument);

  const handleDelete = async (document: DocumentWithRelations) => {
    try {
      await deleteDocument({ documentId: document._id as Id<"documents"> });
      toast.success("Document deleted successfully");
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F30]"></div>
      </div>
    );
  }

  // Error handling removed temporarily - useDocuments needs migration to Convex

  return (
    <div>
      <DocumentViewer
        document={selectedDocument}
        tenantSlug={tenant.slug}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        onDownload={handleDownload}
      />
      {/* Search and upload controls */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-0 sm:min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30] focus:border-[#F30]"
              />
            </div>
          </div>

          <div className="text-sm text-gray-500 flex items-center">
            {documents.length} document{documents.length !== 1 ? 's' : ''}
          </div>

          <button
            onClick={() => setUploadDialogOpen(true)}
            className="px-3 sm:px-4 py-2 bg-[#F30] text-white rounded-md hover:bg-[#E62E00] transition-colors flex items-center gap-2 text-sm sm:text-base"
          >
            <Upload className="h-4 w-4" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Documents table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <DocumentTable
          documents={documents}
          onRowClick={handleDocumentClick}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      </div>

      {/* Upload dialog */}
      <UploadDocumentDialog
        isOpen={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        tenant={tenant}
        defaultBuilding={building}
      />
    </div>
  );
}