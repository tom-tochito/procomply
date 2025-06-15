"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/common/components/Header/Header";
import { documents, Document } from "@/data/documents";
import DocumentDetailsDialog from "@/components/DocumentDetailsDialog";
import UploadDocumentDialog from "@/components/UploadDocumentDialog";
import { useParams } from "next/navigation";
import { generateTenantRedirectUrl } from "@/utils/tenant";
import { Search, Upload } from "lucide-react";
import DocumentTable from "@/components/DocumentTable";

// Define the DocumentData interface if not already imported from a shared types file
// This should match the one used in UploadDocumentDialog
interface UploadedDocumentData {
  file: File | null;
  docType: string;
  code: string;
  reference: string;
  building: string;
  description: string;
  category: string;
  subCategory: string;
  docCategory: string;
  validFrom: Date | null;
  expiry: Date | null;
  isStatutory: boolean;
}

// Icons
const SearchIcon = Search;

const UploadIcon = Upload;

export default function DocumentPage() {
  const params = useParams();
  const subdomain =
    typeof params.tenant === "string"
      ? params.tenant
      : Array.isArray(params.tenant)
      ? params.tenant[0]
      : "";
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

  // Check if screen is mobile size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle document click to open document details dialog
  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
    setDialogOpen(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  // Handle upload button click
  const handleUploadClick = () => {
    setUploadDialogOpen(true);
  };

  // Handle document upload
  const handleUploadDocument = (documentData: UploadedDocumentData) => {
    console.log("Document uploaded:", documentData);
    // Here you would typically send the data to your backend
    // For now, we'll just show an alert
    alert(
      `Document "${
        documentData.file?.name || "Unknown"
      }" uploaded successfully!`
    );
  };

  // Filter documents based on search and filters
  const filteredDocuments = documents.filter((document) => {
    // Search filter
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

    // Status filter
    if (selectedStatus && document.status !== selectedStatus) {
      return false;
    }

    // Category filter
    if (selectedCategory && document.category !== selectedCategory) {
      return false;
    }

    // Doc Category filter
    if (
      selectedDocCategory &&
      document.document_category !== selectedDocCategory
    ) {
      return false;
    }

    // File type filter
    if (selectedFileType && document.file_type !== selectedFileType) {
      return false;
    }

    return true;
  });

  // Extract unique values for filters
  const categories = Array.from(new Set(documents.map((doc) => doc.category)));
  const fileTypes = Array.from(new Set(documents.map((doc) => doc.file_type)));

  // Document categories from the screenshot
  const docCategories = [
    "Asbestos",
    "Electrical",
    "Energy",
    "Environmental",
    "Equality / Disability",
    "Fire",
    "Gas",
    "Health and Safety",
    "Legionella",
    "Lift",
    "Miscellaneous",
    "Operation",
    "Third Party",
  ];

  return (
    <div className="p-2 md:p-4 lg:p-6 space-y-4 md:space-y-6 bg-gray-50 min-h-screen max-w-full overflow-x-hidden">
      {/* Top header with logo and user info */}
      <Header />

      {/* Document details dialog */}
      {selectedDocument && (
        <DocumentDetailsDialog
          isOpen={dialogOpen}
          onClose={handleDialogClose}
          document={selectedDocument}
        />
      )}

      {/* Upload document dialog */}
      <UploadDocumentDialog
        isOpen={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUpload={handleUploadDocument}
      />

      {/* Page title and breadcrumbs */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
            Documents
          </h1>
          <div className="flex items-center text-xs md:text-sm text-gray-600 mt-1">
            <Link
              href={generateTenantRedirectUrl(subdomain, "dashboard")}
              className="hover:text-blue-600"
            >
              <span>Data Mgmt</span>
            </Link>
            <span className="mx-2">/</span>
            <span>Document</span>
          </div>
        </div>

        {/* Mobile sidebar toggle */}
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
        {/* Left sidebar - hidden on mobile unless toggled */}
        {sidebarOpen && (
          <div className="w-full lg:w-64 xl:w-72 bg-white rounded-md shadow-sm p-3 md:p-4 order-2 lg:order-1 max-h-[calc(100vh-12rem)] overflow-y-auto sticky top-4">
            {/* Doc Categories */}
            <div className="mb-5">
              <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">
                DOC CATEGORIES:
              </h3>
              <div className="space-y-1 max-h-[250px] overflow-y-auto pr-1">
                <button
                  className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
                    selectedDocCategory === null
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100"
                  } cursor-pointer`}
                  onClick={() => setSelectedDocCategory(null)}
                >
                  All Categories
                </button>
                {docCategories.map((category) => (
                  <button
                    key={category}
                    className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
                      selectedDocCategory === category
                        ? "bg-blue-100 text-blue-600"
                        : "hover:bg-gray-100"
                    } cursor-pointer flex items-center`}
                    onClick={() =>
                      setSelectedDocCategory(
                        selectedDocCategory === category ? null : category
                      )
                    }
                  >
                    <span className="text-gray-700 mr-2">›</span>
                    <span className="truncate">{category}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">
                FILTERS:
              </h3>
              <div className="space-y-1">
                <button
                  className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
                    selectedStatus === null
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100"
                  } cursor-pointer`}
                  onClick={() => setSelectedStatus(null)}
                >
                  All Documents
                </button>
                <button
                  className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
                    selectedStatus === "Active"
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100"
                  } cursor-pointer flex items-center`}
                  onClick={() => setSelectedStatus("Active")}
                >
                  <span className="text-gray-700 mr-2">›</span> Active Documents
                </button>
                <button
                  className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
                    selectedStatus === "Pending"
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100"
                  } cursor-pointer flex items-center`}
                  onClick={() => setSelectedStatus("Pending")}
                >
                  <span className="text-gray-700 mr-2">›</span> Pending Review
                </button>
                <button
                  className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
                    selectedStatus === "Archived"
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100"
                  } cursor-pointer flex items-center`}
                  onClick={() => setSelectedStatus("Archived")}
                >
                  <span className="text-gray-700 mr-2">›</span> Archived
                  Documents
                </button>
              </div>
            </div>

            <div className="mb-5">
              <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">
                CATEGORIES:
              </h3>
              <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
                      selectedCategory === category
                        ? "bg-blue-100 text-blue-600"
                        : "hover:bg-gray-100"
                    } cursor-pointer flex items-center`}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === category ? null : category
                      )
                    }
                  >
                    <span className="text-gray-700 mr-2">›</span>
                    <span className="truncate">{category}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">
                FILE TYPES:
              </h3>
              <div className="space-y-1 max-h-[150px] overflow-y-auto pr-1">
                {fileTypes.map((fileType) => (
                  <button
                    key={fileType}
                    className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
                      selectedFileType === fileType
                        ? "bg-blue-100 text-blue-600"
                        : "hover:bg-gray-100"
                    } cursor-pointer flex items-center`}
                    onClick={() =>
                      setSelectedFileType(
                        selectedFileType === fileType ? null : fileType
                      )
                    }
                  >
                    <span className="text-gray-700 mr-2">›</span>
                    <span className="truncate">{fileType}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex-grow order-1 lg:order-2 min-w-0">
          {/* Action Bar */}
          <div className="bg-white rounded-md shadow-sm p-3 mb-3 md:mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="w-full pl-9 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUploadClick}
                className="bg-blue-600 text-white px-3 py-2 text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center whitespace-nowrap"
              >
                <UploadIcon className="h-4 w-4 mr-2" />
                <span>Add document</span>
              </button>
            </div>
          </div>

          {/* Active filters */}
          {(selectedStatus ||
            selectedCategory ||
            selectedFileType ||
            selectedDocCategory) && (
            <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
              {selectedStatus && (
                <div className="flex items-center bg-blue-50 text-blue-800 px-2 py-1 rounded-full text-xs md:text-sm">
                  <span className="truncate max-w-[150px]">
                    Status: {selectedStatus}
                  </span>
                  <button
                    className="ml-1 md:ml-2 text-blue-800 hover:text-blue-900"
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
                <div className="flex items-center bg-blue-50 text-blue-800 px-2 py-1 rounded-full text-xs md:text-sm">
                  <span className="truncate max-w-[150px]">
                    Category: {selectedCategory}
                  </span>
                  <button
                    className="ml-1 md:ml-2 text-blue-800 hover:text-blue-900"
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
                <div className="flex items-center bg-blue-50 text-blue-800 px-2 py-1 rounded-full text-xs md:text-sm">
                  <span className="truncate max-w-[150px]">
                    File Type: {selectedFileType}
                  </span>
                  <button
                    className="ml-1 md:ml-2 text-blue-800 hover:text-blue-900"
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
                <div className="flex items-center bg-blue-50 text-blue-800 px-2 py-1 rounded-full text-xs md:text-sm">
                  <span className="truncate max-w-[150px]">
                    Doc Category: {selectedDocCategory}
                  </span>
                  <button
                    className="ml-1 md:ml-2 text-blue-800 hover:text-blue-900"
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
                className="text-blue-600 hover:text-blue-800 text-xs md:text-sm font-medium"
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

          {/* Documents List */}
          <DocumentTable
            documents={filteredDocuments}
            onRowClick={handleDocumentClick}
            onDownload={(document) => alert(`Downloading ${document.name}`)}
          />
        </div>
      </div>
    </div>
  );
}
