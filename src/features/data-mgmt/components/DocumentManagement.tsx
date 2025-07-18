"use client";

import React, {
  useState,
  useEffect,
  useActionState,
  startTransition,
} from "react";
import { db } from "~/lib/db";
import { Document } from "@/data/documents"; // Use the legacy Document type
import DocumentDetailsDialog from "./DocumentDetailsDialog";
import UploadDocumentDialog from "./UploadDocumentDialog";
import DocumentTable from "./DocumentTable";
import DocumentSidebar from "./DocumentSidebar";
import DocumentActionBar from "./DocumentActionBar";
import { Tenant } from "@/features/tenant/models";
import { getFileUrl } from "@/common/utils/file";
import { deleteDocumentAction } from "@/features/data-mgmt/actions/document-delete.action";
import { FormState } from "@/common/types/form";

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
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  // Delete action state
  const initialDeleteState: FormState = { error: null, success: false };
  const [deleteState, deleteAction] = useActionState(
    deleteDocumentAction,
    initialDeleteState
  );

  // Subscribe to documents using InstantDB
  const { data, isLoading, error } = db.useQuery({
    documents: {
      $: {
        where: {
          tenant: tenant.id,
        },
      },
      building: {},
      uploader: {},
      tenant: {},
    },
  });

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

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDelete = async (document: Document) => {
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

  // Upload is now handled directly by the server action in UploadDocumentDialog

  // Transform documents to match UI expectations
  const transformedDocuments: Document[] = documents.map((doc) => ({
    id: doc.id,
    name: doc.name,
    file_type: doc.type,
    category: doc.type, // Will be enhanced with proper categories
    document_category: "Miscellaneous", // Default for now
    upload_date: new Date(doc.uploadedAt).toLocaleDateString("en-GB"),
    uploaded_by: doc.uploader?.email || "Unknown",
    size: `${(doc.size / 1024 / 1024).toFixed(1)} MB`,
    status: "Active" as const,
    building_id: doc.building?.id || "",
    task_id: "",
    description: "",
    tags: [],
    last_accessed: new Date(doc.updatedAt).toLocaleDateString("en-GB"),
    version: "1.0",
  }));

  const filteredDocuments = transformedDocuments.filter((document) => {
    if (
      searchTerm &&
      !document.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !(
        document.description &&
        document.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) &&
      !document.id.includes(searchTerm)
    ) {
      return false;
    }

    if (selectedStatus && document.status !== selectedStatus) {
      return false;
    }

    if (selectedCategory && document.category !== selectedCategory) {
      return false;
    }

    if (
      selectedDocCategory &&
      document.document_category !== selectedDocCategory
    ) {
      return false;
    }

    if (selectedFileType && document.file_type !== selectedFileType) {
      return false;
    }

    return true;
  });

  const categories = Array.from(
    new Set(transformedDocuments.map((doc) => doc.category))
  );
  const fileTypes = Array.from(
    new Set(transformedDocuments.map((doc) => doc.file_type))
  );

  if (isLoading) {
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
          document={selectedDocument}
          onDownload={(document) => {
            // Find the original document to get the path
            const originalDoc = documents.find((d) => d.id === document.id);
            if (originalDoc?.path) {
              // Generate download URL using the utility function
              const downloadUrl = getFileUrl(tenant.slug, originalDoc.path);
              window.open(downloadUrl, "_blank");
            } else {
              alert("File path not available");
            }
          }}
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

      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
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
          />
        )}

        <div className="flex-grow order-1 lg:order-2 min-w-0">
          <DocumentActionBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onUploadClick={handleUploadClick}
          />

          {(selectedStatus ||
            selectedCategory ||
            selectedFileType ||
            selectedDocCategory) && (
            <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
              {selectedStatus && (
                <div className="flex items-center bg-red-50 text-[#F30] px-2 py-1 rounded-full text-xs md:text-sm">
                  <span className="truncate max-w-[150px]">
                    Status: {selectedStatus}
                  </span>
                  <button
                    className="ml-1 md:ml-2 text-[#F30] hover:text-[#E20]"
                    onClick={() => setSelectedStatus(null)}
                    aria-label="Remove status filter"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 md:h-4 md:w-4"
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
                  </button>
                </div>
              )}
              {selectedCategory && (
                <div className="flex items-center bg-red-50 text-[#F30] px-2 py-1 rounded-full text-xs md:text-sm">
                  <span className="truncate max-w-[150px]">
                    Category: {selectedCategory}
                  </span>
                  <button
                    className="ml-1 md:ml-2 text-[#F30] hover:text-[#E20]"
                    onClick={() => setSelectedCategory(null)}
                    aria-label="Remove category filter"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 md:h-4 md:w-4"
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
                  </button>
                </div>
              )}
              {selectedFileType && (
                <div className="flex items-center bg-red-50 text-[#F30] px-2 py-1 rounded-full text-xs md:text-sm">
                  <span className="truncate max-w-[150px]">
                    File Type: {selectedFileType}
                  </span>
                  <button
                    className="ml-1 md:ml-2 text-[#F30] hover:text-[#E20]"
                    onClick={() => setSelectedFileType(null)}
                    aria-label="Remove file type filter"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 md:h-4 md:w-4"
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
                  </button>
                </div>
              )}
              {selectedDocCategory && (
                <div className="flex items-center bg-red-50 text-[#F30] px-2 py-1 rounded-full text-xs md:text-sm">
                  <span className="truncate max-w-[150px]">
                    Doc Category: {selectedDocCategory}
                  </span>
                  <button
                    className="ml-1 md:ml-2 text-[#F30] hover:text-[#E20]"
                    onClick={() => setSelectedDocCategory(null)}
                    aria-label="Remove doc category filter"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 md:h-4 md:w-4"
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
                  </button>
                </div>
              )}
              <button
                className="text-[#F30] hover:text-[#E20] text-xs md:text-sm font-medium"
                onClick={() => {
                  setSelectedStatus(null);
                  setSelectedCategory(null);
                  setSelectedFileType(null);
                  setSelectedDocCategory(null);
                }}
              >
                Clear All
              </button>
            </div>
          )}

          <DocumentTable
            documents={filteredDocuments}
            onRowClick={handleDocumentClick}
            onDownload={(document) => {
              // Find the original document to get the path
              const originalDoc = documents.find((d) => d.id === document.id);
              if (originalDoc?.path) {
                // Generate download URL using the utility function
                const downloadUrl = getFileUrl(tenant.slug, originalDoc.path);
                window.open(downloadUrl, "_blank");
              } else {
                alert("File path not available");
              }
            }}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </>
  );
}
