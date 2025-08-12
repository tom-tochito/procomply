"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/common/components/Table/Table";

interface LegislationData {
  id: string;
  code: string;
  title: string;
  url?: string;
}

interface LegislationTableProps {
  legislation: LegislationData[];
  onEdit: (legislation: LegislationData) => void;
  onDelete?: (legislation: LegislationData) => void;
}

export default function LegislationTable({
  legislation,
  onEdit,
  onDelete,
}: LegislationTableProps) {
  const columns: ColumnDef<LegislationData>[] = [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "url",
      header: "URL",
      cell: ({ getValue }) => {
        const url = getValue() as string | undefined;
        return url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline text-sm truncate block max-w-xs"
          >
            {url}
          </a>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            onClick={() => onEdit(row.original)}
          >
            Edit
          </button>
          {onDelete && (
            <button
              className="text-red-600 hover:text-red-800 text-sm font-medium"
              onClick={() => onDelete(row.original)}
            >
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={legislation}
      emptyMessage="No legislation found matching your search"
      showPagination={legislation.length > 10}
    />
  );
}