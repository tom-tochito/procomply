"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/common/components/Table/Table";

interface SubsectionData {
  code: string;
  description: string;
}

interface SubsectionTableProps {
  subsections: SubsectionData[];
  onEdit: (subsection: SubsectionData) => void;
}

export default function SubsectionTable({
  subsections,
  onEdit,
}: SubsectionTableProps) {
  const columns: ColumnDef<SubsectionData>[] = [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900">{getValue() as string}</span>
      ),
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
      data={subsections}
      emptyMessage="No subsections found matching your search"
      showPagination={subsections.length > 10}
    />
  );
}