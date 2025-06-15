"use client";

import React, { useMemo } from "react";
import { Table, ColumnDef } from "@/common/components/Table";

interface RiskAreaData {
  code: string;
  description: string;
}

interface RiskAreaTableProps {
  riskAreas: RiskAreaData[];
  searchTerm?: string;
  onEdit: (item: RiskAreaData) => void;
}

export default function RiskAreaTable({ riskAreas, searchTerm = "", onEdit }: RiskAreaTableProps) {
  const columns = useMemo<ColumnDef<RiskAreaData>[]>(
    () => [
      {
        accessorKey: "code",
        header: "Code",
        cell: ({ row }) => (
          <span className="text-gray-900">{row.original.code}</span>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <span className="text-gray-900">{row.original.description}</span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => onEdit(row.original)}
          >
            Edit
          </button>
        ),
        enableSorting: false,
      },
    ],
    [onEdit]
  );

  return (
    <Table
      columns={columns}
      data={riskAreas}
      globalFilter={searchTerm}
      pageSize={10}
      emptyMessage="No risk areas found matching your search"
    />
  );
}