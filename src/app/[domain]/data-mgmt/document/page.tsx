"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/common/components/Header";
import { documents, Document } from "@/data/documents";
import DocumentDetailsDialog from "@/components/DocumentDetailsDialog";
import UploadDocumentDialog from "@/components/UploadDocumentDialog";
import { useParams } from "next/navigation";

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

const FilterIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
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
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<string | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [fileTypeDropdownOpen, setFileTypeDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
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
  const handleUploadDocument = (documentData: any) => {
    console.log("Document uploaded:", documentData);
    // Here you would typically send the data to your backend
    // For now, we'll just show an alert
    alert(`Document "${documentData.file.name}" uploaded successfully!`);
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

    // File type filter
    if (selectedFileType && document.fileType !== selectedFileType) {
      return false;
    }

    return true;
  });

  // Extract unique values for filters
  const statuses = Array.from(new Set(documents.map((doc) => doc.status)));
  const categories = Array.from(new Set(documents.map((doc) => doc.category)));
  const fileTypes = Array.from(new Set(documents.map((doc) => doc.fileType)));

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

  return (
    <div className="p-3 md:p-6 space-y-6 md:space-y-8 bg-gray-50 min-h-screen">
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
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Documents
          </h1>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Link
              href={`/${params.domain}/dashboard`}
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

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left sidebar - hidden on mobile unless toggled */}
        {sidebarOpen && (
          <div className="w-full lg:w-60 bg-white rounded-md shadow-sm p-4 order-2 lg:order-1">
            <div className="mb-6">
              <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3">
                FILTERS:
              </h3>
              <div className="space-y-1">
                <button
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                    selectedStatus === null
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100"
                  } cursor-pointer`}
                  onClick={() => setSelectedStatus(null)}
                >
                  All Documents
                </button>
                <button
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                    selectedStatus === "Active"
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100"
                  } cursor-pointer flex items-center`}
                  onClick={() => setSelectedStatus("Active")}
                >
                  <span className="text-gray-700 mr-2">›</span> Active Documents
                </button>
                <button
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                    selectedStatus === "Pending"
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100"
                  } cursor-pointer flex items-center`}
                  onClick={() => setSelectedStatus("Pending")}
                >
                  <span className="text-gray-700 mr-2">›</span> Pending Review
                </button>
                <button
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
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

            <div className="mb-6">
              <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3">
                CATEGORIES:
              </h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${
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
                    <span className="text-gray-700 mr-2">›</span> {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3">
                FILE TYPES:
              </h3>
              <div className="space-y-1">
                {fileTypes.map((fileType) => (
                  <button
                    key={fileType}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${
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
                    <span className="text-gray-700 mr-2">›</span> {fileType}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex-grow order-1 lg:order-2">
          {/* Action Bar */}
          <div className="bg-white rounded-md shadow-sm p-3 sm:p-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search documents by name, description, or ID..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUploadClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <UploadIcon className="h-5 w-5 mr-2" />
                <span>Upload Document</span>
              </button>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedStatus && (
              <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                <span>Status: {selectedStatus}</span>
                <button
                  className="ml-2 text-blue-800 hover:text-blue-900"
                  onClick={() => setSelectedStatus(null)}
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
            {selectedCategory && (
              <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                <span>Category: {selectedCategory}</span>
                <button
                  className="ml-2 text-blue-800 hover:text-blue-900"
                  onClick={() => setSelectedCategory(null)}
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
            {selectedFileType && (
              <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                <span>File Type: {selectedFileType}</span>
                <button
                  className="ml-2 text-blue-800 hover:text-blue-900"
                  onClick={() => setSelectedFileType(null)}
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
            {(selectedStatus || selectedCategory || selectedFileType) && (
              <button
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                onClick={() => {
                  setSelectedStatus(null);
                  setSelectedCategory(null);
                  setSelectedFileType(null);
                }}
              >
                Clear All Filters
              </button>
            )}
          </div>

          {/* Documents List */}
          <div className="bg-white rounded-md shadow-sm">
            {/* Mobile and tablet view - list with cards */}
            <div className="block lg:hidden">
              {filteredDocuments.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredDocuments.map((document) => (
                    <div
                      key={document.id}
                      className="p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleDocumentClick(document)}
                    >
                      <div className="flex items-start">
                        {getFileIcon(document.fileType)}
                        <div className="ml-3 flex-grow">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {document.name}
                          </h3>
                          <div className="flex flex-wrap items-center text-xs text-gray-500 gap-x-3 gap-y-1 mb-2">
                            <span>Uploaded: {document.uploadDate}</span>
                            <span>Size: {document.size}</span>
                            <span>By: {document.uploadedBy}</span>
                          </div>
                          {document.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {document.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <div>
                              {renderStatusBadge(document.status)}
                              <span className="ml-2 text-xs text-gray-500">
                                {document.category}
                              </span>
                            </div>
                            <button
                              className="text-blue-600 hover:text-blue-800 p-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Download action would go here
                                alert(`Downloading ${document.name}`);
                              }}
                            >
                              <DownloadIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500 italic">
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
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Document
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Upload Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Size
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Uploaded By
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getFileIcon(document.fileType)}
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {document.name}
                                </div>
                                {document.description && (
                                  <div className="text-xs text-gray-500 max-w-xs truncate">
                                    {document.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {document.category}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {renderStatusBadge(document.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {document.uploadDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {document.size}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {document.uploadedBy}
                          </td>
                          <td
                            className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
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
                          colSpan={7}
                          className="px-6 py-10 text-center text-gray-500 italic"
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
          <div className="flex justify-between items-center mt-4 text-sm">
            <div className="text-gray-500">
              Showing {filteredDocuments.length} documents
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 focus:outline-none transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 border rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
