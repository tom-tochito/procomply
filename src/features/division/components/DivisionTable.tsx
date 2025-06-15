"use client";

import React, { useMemo } from "react";
import { Table, ColumnDef } from "@/common/components/Table";

interface DivisionData {
  name: string;
  buildingsCount: number;
}

interface DivisionTableProps {
  divisions: string[];
  searchTerm?: string;
}

export default function DivisionTable({ divisions, searchTerm = "" }: DivisionTableProps) {
  // Transform divisions array into table data format
  const divisionData: DivisionData[] = useMemo(
    () => divisions.map(division => ({
      name: division,
      buildingsCount: 0 // Mock data - in real app this would come from backend
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