"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Table, ColumnDef } from "@/common/components/Table";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import { Plus } from "lucide-react";
import AddComplianceCheckDialog from "./AddComplianceCheckDialog";
import type { Tenant } from "@/features/tenant/models";

interface ComplianceData {
  id: string;
  name: string;
  location: string;
  compliance: string;
  pm: string;
  annualFlatDoor: { date: string; status: string };
  asbestosReinspections: { date: string; status: string };
  asbestosSurveys: { date: string; status: string };
  fireAlarmTesting: { date: string; status: string };
  fireRiskAssessment: { date: string; status: string };
  hsMonthlyVisit: { date: string; status: string };
  hsRiskAssessment: { date: string; status: string };
  legionellaRisk: { date: string; status: string };
}

interface ComplianceTableProps {
  data: ComplianceData[];
  searchTerm?: string;
  tenant: Tenant;
  onDataChange?: () => void;
}

const StatusCell = ({ date, status }: { date: string; status: string }) => {
  if (!date) return null;
  
  const statusStyles = {
    success: "bg-emerald-500 text-white",
    warning: "bg-red-500 text-white",
    "": "",
  };

  return (
    <div
      className={`inline-block px-2 py-1 rounded-md text-xs ${
        statusStyles[status as keyof typeof statusStyles] || ""
      }`}
    >
      {date}
    </div>
  );
};

export default function ComplianceTable({ 
  data, 
  searchTerm = "", 
  tenant,
  onDataChange 
}: ComplianceTableProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<{ id: string; name: string } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const columns = useMemo<ColumnDef<ComplianceData>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Building",
        cell: ({ row }) => (
          <Link href={generateTenantRedirectUrl(tenant.slug, `/buildings/${row.original.id}`)}>
            <div className="cursor-pointer hover:underline">
              <div className="font-medium text-blue-600">{row.original.name}</div>
              <div className="text-gray-600 text-sm">{row.original.location}</div>
            </div>
          </Link>
        ),
      },
      {
        accessorKey: "compliance",
        header: "Cpl %",
        cell: ({ row }) => (
          <div className="text-center font-medium">{row.original.compliance}</div>
        ),
      },
      {
        accessorKey: "pm",
        header: "PM",
        cell: ({ row }) => (
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center font-medium text-sm">
              {row.original.pm}
            </div>
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "annualFlatDoor",
        header: () => (
          <div className="text-center">
            <div>Annual Flat</div>
            <div>Door Inspection</div>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <StatusCell {...row.original.annualFlatDoor} />
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "asbestosReinspections",
        header: () => (
          <div className="text-center">
            Asbestos<br />Reinspections
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <StatusCell {...row.original.asbestosReinspections} />
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "asbestosSurveys",
        header: () => (
          <div className="text-center">
            Asbestos<br />Surveys
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <StatusCell {...row.original.asbestosSurveys} />
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "fireAlarmTesting",
        header: () => (
          <div className="text-center">
            Fire Alarm<br />Testing
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <StatusCell {...row.original.fireAlarmTesting} />
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "fireRiskAssessment",
        header: () => (
          <div className="text-center">
            Fire Risk<br />Assessment
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <StatusCell {...row.original.fireRiskAssessment} />
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "hsMonthlyVisit",
        header: () => (
          <div className="text-center">
            H&S Monthly<br />Visit Report
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <StatusCell {...row.original.hsMonthlyVisit} />
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "hsRiskAssessment",
        header: () => (
          <div className="text-center">
            H&S Risk<br />Assessment
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <StatusCell {...row.original.hsRiskAssessment} />
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "legionellaRisk",
        header: () => (
          <div className="text-center">
            Legionella<br />Risk Assessment
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <StatusCell {...row.original.legionellaRisk} />
          </div>
        ),
        enableSorting: false,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="text-center">
            <button
              onClick={() => {
                setSelectedBuilding({ id: row.original.id, name: row.original.name });
                setIsDialogOpen(true);
              }}
              className="p-1.5 text-[#F30] hover:bg-red-50 rounded transition-colors"
              title="Add compliance check"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [tenant]
  );

  return (
    <>
      <Table
        columns={columns}
        data={data}
        globalFilter={searchTerm}
        pageSize={10}
        className="text-sm"
      />
      {selectedBuilding && (
        <AddComplianceCheckDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedBuilding(null);
          }}
          buildingId={selectedBuilding.id}
          buildingName={selectedBuilding.name}
          tenant={tenant}
          onSuccess={() => {
            onDataChange?.();
          }}
        />
      )}
    </>
  );
}