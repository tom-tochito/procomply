"use client";

import React, { useMemo } from "react";
import { Table, ColumnDef } from "@/common/components/Table";
import { Company } from "@/data/companies";

interface CompanyTableProps {
  companies: Company[];
  searchTerm?: string;
}

export default function CompanyTable({ companies, searchTerm = "" }: CompanyTableProps) {
  const columns = useMemo<ColumnDef<Company>[]>(
    () => [
      {
        accessorKey: "number_of_employees",
        header: "Number of Employees",
        cell: ({ row }) => (
          <span className="text-gray-500">
            {row.original.number_of_employees || "-"}
          </span>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
          <span className="text-gray-500">{row.original.category || "-"}</span>
        ),
      },
      {
        accessorKey: "referral",
        header: "Ref",
        cell: ({ row }) => (
          <span className="text-gray-500">{row.original.referral || "-"}</span>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="font-medium text-gray-900">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "email",
        header: "E-mail",
        cell: ({ row }) => (
          <span className="text-gray-500">{row.original.email || "-"}</span>
        ),
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => (
          <span className="text-gray-500">{row.original.phone || "-"}</span>
        ),
      },
      {
        accessorKey: "postcode",
        header: "Postcode",
        cell: ({ row }) => (
          <span className="text-gray-500">{row.original.postcode || "-"}</span>
        ),
      },
    ],
    []
  );

  return (
    <Table
      columns={columns}
      data={companies}
      globalFilter={searchTerm}
      pageSize={10}
      emptyMessage="No companies found"
    />
  );
}