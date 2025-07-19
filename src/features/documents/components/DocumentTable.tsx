"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/common/components/Table/Table";
import { DocumentWithRelations } from "@/features/documents/models";
import { Download, Trash2, ChevronUp, ChevronDown, FileText } from "lucide-react";
import { formatTimestamp } from "@/common/utils/date";

interface DocumentTableProps {
  documents: DocumentWithRelations[];
  onRowClick: (document: DocumentWithRelations) => void;
  onDownload: (document: DocumentWithRelations) => void;
  onDelete?: (document: DocumentWithRelations) => void;
  showViewOptions?: boolean;
}

type SortField = "name" | "docCategory" | "reference" | "uploadedAt" | "expiryDate";
type SortDirection = "asc" | "desc";

export default function DocumentTable({
  documents,
  onRowClick,
  onDownload,
  onDelete,
  showViewOptions = true,
}: DocumentTableProps) {
  const [sortField, setSortField] = useState<SortField>("uploadedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [visibleColumns, setVisibleColumns] = useState({
    reference: true,
    validDate: true,
    building: true,
    uploader: true,
  });

  // Helper function to get file icon
  const getFileIcon = (fileName: string, mimeType?: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase() || "";
    
    if (extension === "pdf" || mimeType?.includes("pdf")) {
      return (
        <div className="bg-red-100 text-red-700 w-8 h-8 rounded flex items-center justify-center">
          <span className="text-xs font-bold">PDF</span>
        </div>
      );
    } else if (["docx", "doc"].includes(extension) || mimeType?.includes("word")) {
      return (
        <div className="bg-blue-100 text-blue-700 w-8 h-8 rounded flex items-center justify-center">
          <span className="text-xs font-bold">DOC</span>
        </div>
      );
    } else if (["xlsx", "xls"].includes(extension) || mimeType?.includes("sheet")) {
      return (
        <div className="bg-green-100 text-green-700 w-8 h-8 rounded flex items-center justify-center">
          <span className="text-xs font-bold">XLS</span>
        </div>
      );
    } else {
      return (
        <div className="bg-gray-100 text-gray-700 w-8 h-8 rounded flex items-center justify-center">
          <FileText className="h-4 w-4" />
        </div>
      );
    }
  };

  // Helper function to render status badge
  const renderStatusBadge = (doc: DocumentWithRelations) => {
    const now = Date.now();
    const isExpired = doc.expiryDate && doc.expiryDate < now;
    const isExpiringSoon = doc.expiryDate && doc.expiryDate < now + 30 * 24 * 60 * 60 * 1000; // 30 days
    
    if (!doc.isActive) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Archived</span>;
    }
    
    if (isExpired) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Expired</span>;
    }
    
    if (isExpiringSoon) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Expiring Soon</span>;
    }
    
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
  };

  // Sort documents
  const sortedDocuments = [...documents].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "docCategory":
        aValue = a.docCategory?.toLowerCase() || "";
        bValue = b.docCategory?.toLowerCase() || "";
        break;
      case "reference":
        aValue = a.reference?.toLowerCase() || "";
        bValue = b.reference?.toLowerCase() || "";
        break;
      case "uploadedAt":
        aValue = a.uploadedAt;
        bValue = b.uploadedAt;
        break;
      case "expiryDate":
        aValue = a.expiryDate || 0;
        bValue = b.expiryDate || 0;
        break;
      default:
        return 0;
    }

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
  };

  const columns: ColumnDef<DocumentWithRelations>[] = [
    {
      accessorKey: "name",
      header: () => (
        <button 
          className="flex items-center gap-1 hover:text-gray-700"
          onClick={() => handleSort("name")}
        >
          Document <SortIcon field="name" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center">
          {getFileIcon(row.original.name, row.original.type)}
          <div className="ml-3 max-w-[250px]">
            <div className="text-sm font-medium text-gray-900 truncate">
              {row.original.name}
            </div>
            {row.original.description && (
              <div className="text-xs text-gray-500 truncate">
                {row.original.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "docCategory",
      header: () => (
        <button 
          className="flex items-center gap-1 hover:text-gray-700"
          onClick={() => handleSort("docCategory")}
        >
          Category <SortIcon field="docCategory" />
        </button>
      ),
      cell: ({ getValue }) => (
        <div className="text-sm text-gray-900 truncate max-w-[150px]">
          {(getValue() as string) || "Miscellaneous"}
        </div>
      ),
    },
    ...(visibleColumns.reference ? [{
      accessorKey: "reference",
      header: () => (
        <button 
          className="flex items-center gap-1 hover:text-gray-700"
          onClick={() => handleSort("reference")}
        >
          Reference <SortIcon field="reference" />
        </button>
      ),
      cell: ({ getValue }) => (
        <div className="text-sm text-gray-900">
          {(getValue() as string) || "-"}
        </div>
      ),
    }] : []),
    ...(visibleColumns.validDate ? [{
      accessorKey: "expiryDate",
      header: () => (
        <button 
          className="flex items-center gap-1 hover:text-gray-700"
          onClick={() => handleSort("expiryDate")}
        >
          Valid Until <SortIcon field="expiryDate" />
        </button>
      ),
      cell: ({ getValue }) => {
        const timestamp = getValue() as number | undefined;
        return (
          <div className="text-sm text-gray-500">
            {timestamp ? formatTimestamp(timestamp) : "-"}
          </div>
        );
      },
    }] : []),
    ...(visibleColumns.building ? [{
      accessorKey: "building.name",
      header: "Building",
      cell: ({ row }) => (
        <div className="text-sm text-gray-900 truncate max-w-[150px]">
          {row.original.building?.name || "-"}
        </div>
      ),
    }] : []),
    ...(visibleColumns.uploader ? [{
      accessorKey: "uploader.email",
      header: "Uploaded By",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500 truncate max-w-[150px]">
          {row.original.uploader?.profile?.name || row.original.uploader?.email || "-"}
        </div>
      ),
    }] : []),
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => renderStatusBadge(row.original),
    },
    {
      accessorKey: "uploadedAt",
      header: () => (
        <button 
          className="flex items-center gap-1 hover:text-gray-700"
          onClick={() => handleSort("uploadedAt")}
        >
          Upload Date <SortIcon field="uploadedAt" />
        </button>
      ),
      cell: ({ getValue }) => (
        <div className="text-sm text-gray-500">
          {formatTimestamp(getValue() as number)}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-3">
          <button
            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              onRowClick(row.original);
            }}
          >
            View
          </button>
          <button
            className="text-blue-600 hover:text-blue-900"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(row.original);
            }}
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
          {onDelete && (
            <button
              className="text-red-600 hover:text-red-900"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Are you sure you want to delete "${row.original.name}"?`)) {
                  onDelete(row.original);
                }
              }}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      {showViewOptions && (
        <div className="mb-4 flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">View Options:</span>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={visibleColumns.reference}
              onChange={(e) => setVisibleColumns({ ...visibleColumns, reference: e.target.checked })}
              className="rounded border-gray-300 text-[#F30] focus:ring-[#F30]"
            />
            <span className="text-sm text-gray-600">Reference</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={visibleColumns.validDate}
              onChange={(e) => setVisibleColumns({ ...visibleColumns, validDate: e.target.checked })}
              className="rounded border-gray-300 text-[#F30] focus:ring-[#F30]"
            />
            <span className="text-sm text-gray-600">Valid Date</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={visibleColumns.building}
              onChange={(e) => setVisibleColumns({ ...visibleColumns, building: e.target.checked })}
              className="rounded border-gray-300 text-[#F30] focus:ring-[#F30]"
            />
            <span className="text-sm text-gray-600">Building</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={visibleColumns.uploader}
              onChange={(e) => setVisibleColumns({ ...visibleColumns, uploader: e.target.checked })}
              className="rounded border-gray-300 text-[#F30] focus:ring-[#F30]"
            />
            <span className="text-sm text-gray-600">Uploader</span>
          </label>
        </div>
      )}
      <Table
        columns={columns}
        data={sortedDocuments}
        onRowClick={onRowClick}
        emptyMessage="No documents found matching your filters"
        showPagination={sortedDocuments.length > 10}
      />
    </div>
  );
}