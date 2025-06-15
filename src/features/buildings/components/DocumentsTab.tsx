"use client";

import React, { useState } from "react";
import { FileText, Download, Eye, Search, Filter, Upload } from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  size: string;
  uploadedDate: string;
  uploadedBy: string;
  status: "active" | "archived" | "draft";
}

interface DocumentsTabProps {
  buildingId: string;
}

export default function DocumentsTab({ buildingId }: DocumentsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [documents] = useState<Document[]>([
    {
      id: "1",
      name: "Fire Safety Certificate 2024",
      type: "PDF",
      category: "Compliance",
      size: "2.4 MB",
      uploadedDate: "2024-03-15",
      uploadedBy: "John Smith",
      status: "active"
    },
    {
      id: "2",
      name: "Building Inspection Report",
      type: "PDF",
      category: "Inspection",
      size: "5.1 MB",
      uploadedDate: "2024-03-10",
      uploadedBy: "Sarah Johnson",
      status: "active"
    },
    {
      id: "3",
      name: "Asbestos Survey Results",
      type: "DOCX",
      category: "Survey",
      size: "1.8 MB",
      uploadedDate: "2024-02-28",
      uploadedBy: "Mike Wilson",
      status: "active"
    },
    {
      id: "4",
      name: "Water Safety Assessment",
      type: "PDF",
      category: "Compliance",
      size: "3.2 MB",
      uploadedDate: "2024-02-15",
      uploadedBy: "Emma Davis",
      status: "active"
    },
    {
      id: "5",
      name: "Electrical Installation Certificate",
      type: "PDF",
      category: "Compliance",
      size: "1.5 MB",
      uploadedDate: "2024-01-20",
      uploadedBy: "Tom Brown",
      status: "archived"
    }
  ]);

  const categories = ["all", "Compliance", "Inspection", "Survey", "Maintenance", "Other"];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "archived": return "bg-gray-100 text-gray-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getFileIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case "PDF": return "🔴";
      case "DOCX": return "🔵";
      case "XLSX": return "🟢";
      default: return "📄";
    }
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
            {categories.map(category => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>

          <button className="px-3 sm:px-4 py-2 bg-[#F30] text-white rounded-md hover:bg-[#E62E00] transition-colors flex items-center gap-2 text-sm sm:text-base">
            <Upload className="h-4 w-4" />
            Upload Document
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
                    <span className="mr-3 text-lg">{getFileIcon(doc.type)}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                      <div className="text-sm text-gray-500">{doc.type}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doc.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doc.size}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(doc.uploadedDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doc.uploadedBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(doc.status)}`}>
                    {doc.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <button className="text-[#F30] hover:text-[#E62E00]">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-[#F30] hover:text-[#E62E00]">
                      <Download className="h-4 w-4" />
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