"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/common/components/Table/Table";

interface TaskCategoryData {
  code: string;
  description: string;
}

interface TaskCategoryTableProps {
  categories: TaskCategoryData[];
  onEdit: (category: TaskCategoryData) => void;
}

export default function TaskCategoryTable({
  categories,
  onEdit,
}: TaskCategoryTableProps) {
  const columns: ColumnDef<TaskCategoryData>[] = [
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
      data={categories}
      emptyMessage="No task categories found matching your search"
      showPagination={categories.length > 10}
    />
  );
}