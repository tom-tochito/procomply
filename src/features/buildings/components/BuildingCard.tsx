"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Building } from "@/data/buildings";
import { generateTenantRedirectUrl } from "@/utils/tenant";

interface BuildingCardProps {
  building: Building;
  tenant: string;
}

export default function BuildingCard({ building, tenant }: BuildingCardProps) {
  const getComplianceColor = (compliance: number) => {
    if (compliance >= 75) return "text-green-600";
    if (compliance >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Link
      href={generateTenantRedirectUrl(tenant, `/buildings/${building.id}`)}
      className="block"
    >
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <div className="flex">
          {/* Image */}
          <div className="relative w-48 h-48 flex-shrink-0 bg-gray-100">
            <Image
              src={building.image || "/placeholder-building.jpg"}
              alt={building.name}
              layout="fill"
              objectFit="cover"
            />
            {/* Status badge */}
            <div className="absolute top-2 right-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  building.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : building.status === "Archived"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {building.status}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900">
                  {building.id} • {building.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {building.division} •{" "}
                  {building.id.startsWith("400") ? "Residential" : "Commercial"}
                </p>
              </div>

              {/* Compliance */}
              <div className="sm:text-right">
                <div className="bg-gray-50 rounded-lg px-3 py-2 inline-block">
                  <p className="text-xs text-gray-500">Compliance</p>
                  <p
                    className={`text-lg font-bold ${getComplianceColor(
                      building.compliance
                    )}`}
                  >
                    {building.compliance}%
                  </p>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="mt-3 flex items-center gap-4">
              <p className="text-xs text-gray-500">Inbox:</p>
              <div className="flex items-center gap-2">
                {building.inbox.urgent > 0 && (
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-red-500"
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
                    <span className="text-xs font-medium text-red-600">
                      {building.inbox.urgent}
                    </span>
                  </div>
                )}

                {building.inbox.warning > 0 && (
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-amber-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span className="text-xs font-medium text-amber-600">
                      {building.inbox.warning}
                    </span>
                  </div>
                )}

                {!building.inbox.urgent && !building.inbox.warning && (
                  <span className="text-xs text-gray-400">None</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
