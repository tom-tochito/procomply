"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/common/components/Table/Table";

interface LegislationData {
  code: string;
  title: string;
  url?: string;
}

interface LegislationTableProps {
  legislations: LegislationData[];
  onEdit: (legislation: LegislationData) => void;
}

export default function LegislationTable({
  legislations,
  onEdit,
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
        <button
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          onClick={() => onEdit(row.original)}
        >
          Edit
        </button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={legislations}
      emptyMessage="No legislation found matching your search"
      showPagination={legislations.length > 10}
    />
  );
}