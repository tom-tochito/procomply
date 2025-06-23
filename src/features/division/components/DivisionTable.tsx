"use client";

import React, { useMemo } from "react";
import { Table, ColumnDef } from "@/common/components/Table";
import { DivisionWithRelations } from "@/features/divisions/models";

interface DivisionData {
  id: string;
  name: string;
  type: string;
  buildingsCount: number;
}

interface DivisionTableProps {
  divisions: DivisionWithRelations[];
  searchTerm?: string;
}

export default function DivisionTable({ divisions, searchTerm = "" }: DivisionTableProps) {
  // Transform divisions array into table data format
  const divisionData: DivisionData[] = useMemo(
    () => divisions.map(division => ({
      id: division.id,
      name: division.name,
      type: division.type,
      buildingsCount: division.buildings?.length || 0
    })),
    [divisions]
  );

  const columns = useMemo<ColumnDef<DivisionData>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="font-medium text-gray-900">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.original.type === "Active" ? "bg-green-100 text-green-800" :
            row.original.type === "Archived" ? "bg-gray-100 text-gray-800" :
            "bg-blue-100 text-blue-800"
          }`}>
            {row.original.type}
          </span>
        ),
      },
      {
        accessorKey: "buildingsCount",
        header: "Buildings Count",
        cell: ({ row }) => (
          <span className="text-gray-500">{row.original.buildingsCount}</span>
        ),
      },
    ],
    []
  );

  return (
    <Table
      columns={columns}
      data={divisionData}
      globalFilter={searchTerm}
      pageSize={10}
      emptyMessage="No divisions found"
    />
  );
}