"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Table, ColumnDef } from "@/common/components/Table";
import { BuildingWithStats } from "@/features/buildings/models";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import { getFileUrl } from "~/src/common/utils/file";

interface BuildingsTableProps {
  buildings: BuildingWithStats[];
  tenant: string;
  searchTerm?: string;
}

export default function BuildingsTable({
  buildings,
  tenant,
  searchTerm = "",
}: BuildingsTableProps) {
  const router = useRouter();

  const columns = useMemo<ColumnDef<BuildingWithStats>[]>(
    () => [
      {
        accessorKey: "image",
        header: "",
        cell: ({ row }) => (
          <div className="w-16 h-16 relative overflow-hidden rounded-lg">
            {row.original.image ? (
              <Image
                src={getFileUrl(tenant, row.original.image as `/${string}`)}
                alt={row.original.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-xs">No image</span>
              </div>
            )}
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="font-medium text-gray-900">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "division",
        header: "Division",
        cell: ({ row }) => (
          <span className="text-gray-600">{row.original.division}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const statusClasses = {
            Active: "bg-green-100 text-green-800",
            Leasehold: "bg-blue-100 text-blue-800",
            Archived: "bg-gray-100 text-gray-800",
          };
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                statusClasses[status as keyof typeof statusClasses] ||
                "bg-gray-100 text-gray-800"
              }`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: "compliance",
        header: "Compliance",
        cell: ({ row }) => {
          const compliance = row.original.compliance ?? 0;
          const getComplianceColor = (value: number) => {
            if (value >= 70) return "text-green-600";
            if (value >= 40) return "text-orange-600";
            return "text-red-600";
          };
          return (
            <div className="flex items-center gap-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    compliance >= 70
                      ? "bg-green-600"
                      : compliance >= 40
                      ? "bg-orange-600"
                      : "bg-red-600"
                  }`}
                  style={{ width: `${compliance}%` }}
                />
              </div>
              <span
                className={`text-sm font-medium ${getComplianceColor(
                  compliance
                )}`}
              >
                {compliance}%
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "inbox",
        header: "Inbox",
        cell: ({ row }) => {
          const { urgent, warning, email } = row.original.inbox ?? {
            urgent: 0,
            warning: 0,
            email: false,
          };
          return (
            <div className="flex items-center gap-3">
              {urgent > 0 && (
                <div className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-sm text-gray-700">{urgent}</span>
                </div>
              )}
              {warning > 0 && (
                <div className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-sm text-gray-700">{warning}</span>
                </div>
              )}
              {email && (
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              )}
            </div>
          );
        },
        enableSorting: false,
      },
    ],
    []
  );

  const handleRowClick = (building: BuildingWithStats) => {
    router.push(generateTenantRedirectUrl(tenant, `/buildings/${building.id}`));
  };

  return (
    <Table
      columns={columns}
      data={buildings}
      onRowClick={handleRowClick}
      emptyMessage="No buildings found. Try adjusting your search criteria."
      pageSize={10}
      globalFilter={searchTerm}
    />
  );
}
