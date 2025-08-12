"use client";

import React, { useMemo } from "react";
import { Table, ColumnDef } from "@/common/components/Table";

interface Team {
  id: number | string;
  code: string;
  description: string;
  company: string;
  supervisor: string;
}

interface TeamTableProps {
  teams: Team[];
  searchTerm?: string;
}

export default function TeamTable({ teams, searchTerm = "" }: TeamTableProps) {
  const columns = useMemo<ColumnDef<Team>[]>(
    () => [
      {
        accessorKey: "code",
        header: "Code",
        cell: ({ row }) => (
          <span className="text-gray-500">{row.original.code || "-"}</span>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <span className="font-medium text-gray-900">{row.original.description}</span>
        ),
      },
      {
        accessorKey: "company",
        header: "Company",
        cell: ({ row }) => (
          <span className="text-gray-500">{row.original.company}</span>
        ),
      },
      {
        accessorKey: "supervisor",
        header: "Supervisor",
        cell: ({ row }) => (
          <span className="text-gray-500">{row.original.supervisor || "-"}</span>
        ),
      },
    ],
    []
  );

  return (
    <Table
      columns={columns}
      data={teams}
      globalFilter={searchTerm}
      pageSize={10}
      emptyMessage="No teams found"
    />
  );
}