"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/common/components/Table/Table";

interface TaskTemplateData {
  code: string;
  name: string;
  taskCategory: string;
  type: string;
  instruction: string;
  riskArea: string;
  subsection: string;
  priority: string;
  riskLevel: string;
  statutory: string;
  repeatValue: string;
  repeatUnit: string;
  amberValue: string;
  amberUnit: string;
}

interface TaskTemplateTableProps {
  templates: TaskTemplateData[];
  onEdit: (template: TaskTemplateData) => void;
}

export default function TaskTemplateTable({
  templates,
  onEdit,
}: TaskTemplateTableProps) {
  const columns: ColumnDef<TaskTemplateData>[] = [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900 whitespace-nowrap">
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900 whitespace-nowrap">
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "taskCategory",
      header: "Task Category",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900 whitespace-nowrap">
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900 whitespace-nowrap">
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "instruction",
      header: "Instruction",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-500 whitespace-nowrap">
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "riskArea",
      header: "Risk Area",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900 whitespace-nowrap">
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "subsection",
      header: "Subsection",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900 whitespace-nowrap">
          {(getValue() as string) || "-"}
        </span>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ getValue }) => {
        const priority = getValue() as string;
        const colorClass =
          priority === "High"
            ? "text-red-600"
            : priority === "Medium"
            ? "text-yellow-600"
            : "text-green-600";
        return (
          <span className={`text-sm font-medium whitespace-nowrap ${colorClass}`}>
            {priority}
          </span>
        );
      },
    },
    {
      accessorKey: "riskLevel",
      header: "Risk Level",
      cell: ({ getValue }) => {
        const riskLevel = getValue() as string;
        const colorClass =
          riskLevel === "High"
            ? "text-red-600"
            : riskLevel === "Medium"
            ? "text-yellow-600"
            : "text-green-600";
        return (
          <span className={`text-sm font-medium whitespace-nowrap ${colorClass}`}>
            {riskLevel}
          </span>
        );
      },
    },
    {
      accessorKey: "statutory",
      header: "Statutory",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900 whitespace-nowrap">
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "repeatValue",
      header: "Repeat Value",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900 whitespace-nowrap">
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "repeatUnit",
      header: "Repeat Unit",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900 whitespace-nowrap">
          {(getValue() as string) || "-"}
        </span>
      ),
    },
    {
      accessorKey: "amberValue",
      header: "Amber Value",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900 whitespace-nowrap">
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "amberUnit",
      header: "Amber Unit",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900 whitespace-nowrap">
          {getValue() as string}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <button
          className="text-blue-600 hover:text-blue-800 text-sm font-medium whitespace-nowrap"
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
      emptyMessage="No task templates found"
      showPagination={templates.length > 10}
      className="task-template-table"
    />
  );
}