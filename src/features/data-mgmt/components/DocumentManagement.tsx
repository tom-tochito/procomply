"use client";

import React, {
  useState,
  useEffect,
  useActionState,
  startTransition,
} from "react";
import { db } from "~/lib/db";
import DocumentDetailsDialog from "./DocumentDetailsDialog";
import UploadDocumentDialog from "./UploadDocumentDialog";
import DocumentTable from "@/features/documents/components/DocumentTable";
import DocumentSidebar from "./DocumentSidebar";
import DocumentActionBar from "./DocumentActionBar";
import { Tenant } from "@/features/tenant/models";
import { getFileUrl } from "@/common/utils/file";
import { deleteDocumentAction } from "@/features/data-mgmt/actions/document-delete.action";
import { FormState } from "@/common/types/form";
import { DocumentWithRelations } from "@/features/documents/models";
import { useDocumentCounts } from "@/features/documents/hooks/useDocuments";

interface DocumentManagementProps {
  tenant: Tenant;
}

export default function DocumentManagement({
  tenant,
}: DocumentManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDocCategory, setSelectedDocCategory] = useState<string | null>(
    null
  );
  const [selectedFileType, setSelectedFileType] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentWithRelations | null>(
    null
  );
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  // Delete action state
  const initialDeleteState: FormState = { error: null, success: false };
  const [deleteState, deleteAction] = useActionState(
    deleteDocumentAction,
    initialDeleteState
  );

  // Subscribe to documents using InstantDB with pagination
  const { data, isLoading, error } = db.useQuery({
    documents: {
      $: {
        where: {
          tenant: tenant.id,
        },
        order: { uploadedAt: "desc" },
        limit: pageSize,
        offset: (pageNumber - 1) * pageSize,
      },
      building: {},
      uploader: {
        profile: {},
      },
      tenant: {},
    },
  });

  // Get document counts for categories
  const docCategoryCounts = useDocumentCounts(tenant);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const documents = data?.documents || [];

  // Apply client-side filters
  let filteredDocuments = documents;

  // Search filter
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filteredDocuments = filteredDocuments.filter(
      (doc) =>
        doc.name.toLowerCase().includes(searchLower) ||
        doc.type.toLowerCase().includes(searchLower) ||
        doc.description?.toLowerCase().includes(searchLower) ||
        doc.reference?.toLowerCase().includes(searchLower)
    );
  }

  // Status filter
  if (selectedStatus) {
    filteredDocuments = filteredDocuments.filter((doc) => {
      const now = Date.now();
      const isExpired = doc.expiryDate && doc.expiryDate < now;
      const isActive = doc.isActive !== false;
      
      switch (selectedStatus) {
        case "Active":
          return isActive && !isExpired;
        case "Pending":
          return doc.expiryDate && doc.expiryDate < now + 30 * 24 * 60 * 60 * 1000; // 30 days
        case "Archived":
          return !isActive;
        default:
          return true;
      }
    });
  }

  // Category filter
  if (selectedCategory) {
    filteredDocuments = filteredDocuments.filter(
      (doc) => doc.category === selectedCategory
    );
  }

  // Doc category filter
  if (selectedDocCategory) {
    filteredDocuments = filteredDocuments.filter(
      (doc) => doc.docCategory === selectedDocCategory
    );
  }

  // File type filter
  if (selectedFileType) {
    filteredDocuments = filteredDocuments.filter((doc) => {
      const extension = doc.name.split(".").pop()?.toLowerCase() || "";
      switch (selectedFileType) {
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

  const handleDocumentClick = (document: DocumentWithRelations) => {
    setSelectedDocument(document);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDelete = async (document: DocumentWithRelations) => {
    const formData = new FormData();
    formData.append("documentId", document.id);
    formData.append("tenantSlug", tenant.slug);

    startTransition(() => {
      deleteAction(formData);
    });
  };

  // Show error if delete fails
  React.useEffect(() => {
    if (deleteState.error) {
      alert(`Error deleting document: ${deleteState.error}`);
    }
  }, [deleteState.error]);

  const handleUploadClick = () => {
    setUploadDialogOpen(true);
  };

  const handleDownload = (document: DocumentWithRelations) => {
    if (document.path) {
      const downloadUrl = getFileUrl(tenant.slug, document.path);
      window.open(downloadUrl, "_blank");
    } else {
      alert("File path not available");
    }
  };

  // Get unique categories and file types from current documents
  const categories = Array.from(
    new Set(documents.map((doc) => doc.category).filter((cat): cat is string => Boolean(cat)))
  );
  const fileTypes = ["pdf", "doc", "xls", "image"];

  // For now, we'll show the count of current page
  // TODO: Implement proper total count query when InstantDB supports it
  const totalDocuments = filteredDocuments.length;

  if (isLoading && pageNumber === 1) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F30]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading documents: {error.message}
      </div>
    );
  }

  return (
    <>
      {selectedDocument && (
        <DocumentDetailsDialog
          isOpen={dialogOpen}
          onClose={handleDialogClose}
          document={{
            id: selectedDocument.id,
            name: selectedDocument.name,
            file_type: selectedDocument.type,
            category: selectedDocument.category || "",
            document_category: selectedDocument.docCategory || "Miscellaneous",
            upload_date: new Date(selectedDocument.uploadedAt).toLocaleDateString("en-GB"),
            uploaded_by: selectedDocument.uploader?.email || "Unknown",
            size: `${(selectedDocument.size / 1024 / 1024).toFixed(1)} MB`,
            status: selectedDocument.isActive ? "Active" : "Archived",
            building_id: selectedDocument.building?.id || "",
            task_id: "",
            description: selectedDocument.description || "",
            tags: [],
            last_accessed: new Date(selectedDocument.updatedAt).toLocaleDateString("en-GB"),
            version: "1.0",
          }}
          onDownload={() => handleDownload(selectedDocument)}
        />
      )}

      <UploadDocumentDialog
        isOpen={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        tenant={tenant}
      />

      <div className="flex items-center justify-between mb-6">
        <button
          className="block lg:hidden rounded-md border p-2 text-gray-600 hover:bg-gray-100"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close filters" : "Open filters"}
        >
          {sidebarOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      <DocumentActionBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onUploadClick={handleUploadClick}
        documentCount={totalDocuments}
      />

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {sidebarOpen && (
          <DocumentSidebar
            selectedDocCategory={selectedDocCategory}
            setSelectedDocCategory={setSelectedDocCategory}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedFileType={selectedFileType}
            setSelectedFileType={setSelectedFileType}
            categories={categories}
            fileTypes={fileTypes}
            docCategoryCounts={docCategoryCounts}
          />
        )}

        <div className="flex-1 order-1 lg:order-2">
          <div className="bg-white rounded-md shadow-sm p-4">
            <DocumentTable
              documents={filteredDocuments}
              onRowClick={handleDocumentClick}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />

            {/* Pagination Controls */}
            {(filteredDocuments.length > 0 || pageNumber > 1) && (
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 text-sm gap-3">
                <div className="text-gray-500">
                  Showing {filteredDocuments.length} documents {pageNumber > 1 && `(Page ${pageNumber})`}
                </div>
                <div className="flex space-x-2">
                  <button
                    className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setPageNumber(pageNumber - 1)}
                    disabled={pageNumber <= 1}
                  >
                    Previous
                  </button>
                  <button
                    className="px-3 py-1 border rounded-md bg-[#F30] text-white hover:bg-[#E20] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setPageNumber(pageNumber + 1)}
                    disabled={filteredDocuments.length < pageSize}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* No results message */}
            {filteredDocuments.length === 0 && pageNumber === 1 && (
              <div className="text-center py-8 text-gray-500">
                No documents found matching your filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}