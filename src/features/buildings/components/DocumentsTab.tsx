"use client";

import React, { useState, useRef } from "react";
import { FileText, Download, Eye, Search, Upload, Trash2 } from "lucide-react";
import {
  uploadDocumentAction,
  deleteDocumentAction,
} from "@/features/documents/actions/documents.actions";
import { useRouter } from "next/navigation";
import { DocumentWithUploader } from "@/features/documents/models";
import { getFileUrl } from "~/src/common/utils/file";

interface DocumentsTabProps {
  buildingId: string;
  tenantId: string;
  tenant: string;
  documents: DocumentWithUploader[]; // Documents from server
}

export default function DocumentsTab({
  buildingId,
  tenantId,
  tenant,
  documents = [],
}: DocumentsTabProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isUploading, setIsUploading] = useState(false);

  const categories = [
    "all",
    "Compliance",
    "Inspection",
    "Survey",
    "Maintenance",
    "Other",
  ];

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.uploader?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" ||
      getDocumentCategory(doc.type) === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getDocumentCategory = (type: string) => {
    // Map document types to categories
    if (type.includes("pdf")) return "Compliance";
    if (type.includes("image")) return "Inspection";
    return "Other";
  };

  const getStatusBadgeClass = () => {
    // All uploaded documents are active
    return "bg-green-100 text-green-800";
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return "🔴";
    if (type.includes("word") || type.includes("doc")) return "🔵";
    if (type.includes("excel") || type.includes("sheet")) return "🟢";
    if (type.includes("image")) return "🖼️";
    return "📄";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await uploadDocumentAction(buildingId, tenantId, formData);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || "Failed to upload document");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload document");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (documentId: string, documentName: string) => {
    if (!confirm(`Are you sure you want to delete "${documentName}"?`)) {
      return;
    }

    try {
      const result = await deleteDocumentAction(documentId);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || "Failed to delete document");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete document");
    }
  };

  const handleDownload = (doc: DocumentWithUploader) => {
    // Generate download URL
    const downloadUrl = getFileUrl(tenant, doc.path);
    window.open(downloadUrl, "_blank");
  };

  const handleView = (doc: DocumentWithUploader) => {
    // For PDFs and images, open in new tab
    const viewUrl = getFileUrl(tenant, doc.path);
    window.open(viewUrl, "_blank");
  };

  return (
    <div>
      {/* Search and filters */}
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

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30] focus:border-[#F30]"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleUpload}
            className="hidden"
            accept="*/*"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-3 sm:px-4 py-2 bg-[#F30] text-white rounded-md hover:bg-[#E62E00] transition-colors flex items-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload Document"}
          </button>
        </div>
      </div>

      {/* Documents table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="mr-3 text-lg">
                        {getFileIcon(doc.type)}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {doc.name}
                        </div>
                        <div className="text-sm text-gray-500">{doc.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getDocumentCategory(doc.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatFileSize(doc.size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.uploader?.email || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass()}`}
                    >
                      active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleView(doc)}
                        className="text-[#F30] hover:text-[#E62E00]"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(doc)}
                        className="text-[#F30] hover:text-[#E62E00]"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id, doc.name)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">No documents found</p>
          </div>
        )}
      </div>
    </div>
  );
}
