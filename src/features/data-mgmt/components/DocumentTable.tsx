"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/common/components/Table/Table";
import { Document } from "@/data/documents";
import { Download, Trash2 } from "lucide-react";

interface DocumentTableProps {
  documents: Document[];
  onRowClick: (document: Document) => void;
  onDownload: (document: Document) => void;
  onDelete?: (document: Document) => void;
}

export default function DocumentTable({
  documents,
  onRowClick,
  onDownload,
  onDelete,
}: DocumentTableProps) {
  // Helper function to get file icon
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

  // Helper function to render status badge
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

  const columns: ColumnDef<Document>[] = [
    {
      accessorKey: "name",
      header: "Document",
      cell: ({ row }) => (
        <div className="flex items-center">
          {getFileIcon(row.original.file_type)}
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
      accessorKey: "category",
      header: "Category",
      cell: ({ getValue }) => (
        <div className="text-sm text-gray-900 truncate max-w-[150px]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "document_category",
      header: "Doc Category",
      cell: ({ getValue }) => (
        <div className="text-sm text-gray-900 truncate max-w-[150px]">
          {(getValue() as string) || "-"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => renderStatusBadge(getValue() as string),
    },
    {
      accessorKey: "upload_date",
      header: "Upload Date",
      cell: ({ getValue }) => (
        <div className="text-sm text-gray-500">{getValue() as string}</div>
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
    <Table
      columns={columns}
      data={documents}
      onRowClick={onRowClick}
      emptyMessage="No documents found matching your filters"
      showPagination={documents.length > 10}
    />
  );
}