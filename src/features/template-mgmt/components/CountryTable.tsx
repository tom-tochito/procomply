"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/common/components/Table/Table";

interface CountryData {
  id: string;
  code: string;
  description: string;
}

interface CountryTableProps {
  countries: CountryData[];
  onEdit: (country: CountryData) => void;
  onDelete?: (country: CountryData) => void;
}

export default function CountryTable({ countries, onEdit, onDelete }: CountryTableProps) {
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
      data={countries}
      emptyMessage="No countries found matching your search"
      showPagination={countries.length > 10}
    />
  );
}