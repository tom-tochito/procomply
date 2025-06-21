"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/common/components/Table/Table";

interface SurveyTypeData {
  name: string;
  description: string;
}

interface SurveyTypeTableProps {
  surveyTypes: SurveyTypeData[];
  onEdit: (surveyType: SurveyTypeData) => void;
}

export default function SurveyTypeTable({
  surveyTypes,
  onEdit,
}: SurveyTypeTableProps) {
  const columns: ColumnDef<SurveyTypeData>[] = [
    {
      accessorKey: "name",
      header: "Name",
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
      data={surveyTypes}
      emptyMessage="No survey types found matching your search"
      showPagination={surveyTypes.length > 10}
    />
  );
}