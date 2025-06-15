"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/common/components/Table/Table";

interface CountryData {
  code: string;
  description: string;
}

interface CountryTableProps {
  countries: CountryData[];
  onEdit: (country: CountryData) => void;
}

export default function CountryTable({ countries, onEdit }: CountryTableProps) {
  const columns: ColumnDef<CountryData>[] = [
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
      data={countries}
      emptyMessage="No countries found matching your search"
      showPagination={countries.length > 10}
    />
  );
}