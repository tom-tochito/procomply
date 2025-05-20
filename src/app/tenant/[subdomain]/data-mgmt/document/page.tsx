"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/common/components/Header";
import { documents, Document } from "@/data/documents";
import DocumentDetailsDialog from "@/components/DocumentDetailsDialog";
import UploadDocumentDialog from "@/components/UploadDocumentDialog";
import { useParams } from "next/navigation";
import { generateTenantRedirectUrl } from "@/utils/tenant";

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
const SearchIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const DownloadIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

const UploadIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
    />
  </svg>
);

export default function DocumentPage() {
  const params = useParams();
  const subdomain = typeof params.subdomain === 'string' ? params.subdomain : (Array.isArray(params.subdomain) ? params.subdomain[0] : '');
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

  // Get file icon based on type
  const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase();
    if (type === "pdf") {
      return (
        <div className="bg-red-100 text-red-700 w-8 h-8 rounded flex items-center justify-center">
          <span className="text-xs font-bold">PDF</span>
        </div>
      );
    } else if (type === "docx" || type === "doc") {
      return (
        <div className="bg-blue-100 text-blue-700 w-8 h-8 rounded flex items-center justify-center">
          <span className="text-xs font-bold">DOC</span>
        </div>
      );
    } else if (type === "xlsx" || type === "xls") {
      return (
        <div className="bg-green-100 text-green-700 w-8 h-8 rounded flex items-center justify-center">
          <span className="text-xs font-bold">XLS</span>
        </div>
      );
    } else {
      return (
        <div className="bg-gray-100 text-gray-700 w-8 h-8 rounded flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
      );
    }
  };

  // Status badge
  const renderStatusBadge = (status: string) => {
    let bgColor = "bg-gray-100 text-gray-800";

    if (status === "Active") {
      bgColor = "bg-green-100 text-green-800";
    } else if (status === "Archived") {
      bgColor = "bg-gray-100 text-gray-800";
    } else if (status === "Pending") {
      bgColor = "bg-yellow-100 text-yellow-800";
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}
      >
        {status}
      </span>
    );
  };

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
          <div className="bg-white rounded-md shadow-sm overflow-hidden">
            {/* Mobile and tablet view - list with cards */}
            <div className="block lg:hidden">
              {filteredDocuments.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredDocuments.map((document) => (
                    <div
                      key={document.id}
                      className="p-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleDocumentClick(document)}
                    >
                      <div className="flex items-start space-x-2">
                        {getFileIcon(document.file_type)}
                        <div className="flex-grow min-w-0">
                          <h3 className="font-medium text-gray-900 mb-1 truncate">
                            {document.name}
                          </h3>
                          <div className="flex flex-wrap text-xs text-gray-500 gap-x-2 gap-y-1 mb-1">
                            <span>Uploaded: {document.upload_date}</span>
                            <span>Size: {document.size}</span>
                          </div>
                          {document.description && (
                            <p className="text-xs text-gray-600 line-clamp-2 mb-1.5">
                              {document.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-1.5">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {renderStatusBadge(document.status)}
                              {document.document_category && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                  {document.document_category}
                                </span>
                              )}
                            </div>
                            <button
                              className="text-blue-600 hover:text-blue-800 p-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Download action would go here
                                alert(`Downloading ${document.name}`);
                              }}
                            >
                              <DownloadIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 italic text-sm">
                  No documents found matching your filters
                </div>
              )}
            </div>

            {/* Desktop view - table */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Document
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell"
                      >
                        Doc Category
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell"
                      >
                        Upload Date
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDocuments.length > 0 ? (
                      filteredDocuments.map((document) => (
                        <tr
                          key={document.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleDocumentClick(document)}
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              {getFileIcon(document.file_type)}
                              <div className="ml-3 max-w-[250px]">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {document.name}
                                </div>
                                {document.description && (
                                  <div className="text-xs text-gray-500 truncate">
                                    {document.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900 truncate max-w-[150px]">
                              {document.category}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap hidden xl:table-cell">
                            <div className="text-sm text-gray-900 truncate max-w-[150px]">
                              {document.document_category || "-"}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {renderStatusBadge(document.status)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                            {document.upload_date}
                          </td>
                          <td
                            className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="text-blue-600 hover:text-blue-900 mr-3"
                              onClick={() => handleDocumentClick(document)}
                            >
                              View
                            </button>
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              onClick={() =>
                                alert(`Downloading ${document.name}`)
                              }
                            >
                              Download
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-8 text-center text-gray-500 italic"
                        >
                          No documents found matching your filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-3 md:mt-4 text-xs md:text-sm">
            <div className="text-gray-500">
              Showing {filteredDocuments.length} documents
            </div>
            <div className="flex space-x-2">
              <button className="px-2 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 focus:outline-none transition-colors text-xs md:text-sm">
                Previous
              </button>
              <button className="px-2 py-1 border rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none transition-colors text-xs md:text-sm">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
