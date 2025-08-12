"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/common/components/Table/Table";

interface DocumentTypeTemplateData {
  code: string;
  description: string;
  title: string;
  statutory: string;
  category: string;
  subCategory: string;
  repeatValue: string;
  repeatUnit: string;
}

interface DocumentTypeTemplateTableProps {
  templates: DocumentTypeTemplateData[];
  onEdit: (template: DocumentTypeTemplateData) => void;
}

export default function DocumentTypeTemplateTable({
  templates,
  onEdit,
}: DocumentTypeTemplateTableProps) {
  const columns: ColumnDef<DocumentTypeTemplateData>[] = [
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
      accessorKey: "title",
      header: "Title",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "statutory",
      header: "Statutory",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "subCategory",
      header: "Sub Category",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "repeatValue",
      header: "Repeat Value",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "repeatUnit",
      header: "Repeat Unit",
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
      data={templates}
      emptyMessage="No document type templates found"
      showPagination={templates.length > 10}
    />
  );
}