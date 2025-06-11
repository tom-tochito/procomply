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

export default function BuildingCardModern({ building, tenant }: BuildingCardProps) {
  const getComplianceColor = (compliance: number) => {
    if (compliance >= 75) return "text-green-600 bg-green-50";
    if (compliance >= 50) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getComplianceIcon = (compliance: number) => {
    if (compliance >= 75) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    } else if (compliance >= 50) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <Link
      href={generateTenantRedirectUrl(tenant, `buildings/${building.id}`)}
      className="block group"
    >
      <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 overflow-hidden">
        {/* Card Content */}
        <div className="flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="relative w-full lg:w-64 h-48 lg:h-auto lg:min-h-[200px] bg-gray-100">
            <Image
              src={building.image || "/placeholder-building.jpg"}
              alt={building.name}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
            />
            {/* Badges positioned on top right */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm backdrop-blur-sm ${
                building.status === "Active" 
                  ? "bg-green-500/90 text-white" 
                  : building.status === "Archived"
                  ? "bg-gray-500/90 text-white"
                  : "bg-yellow-500/90 text-white"
              }`}>
                {building.status}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800 shadow-sm backdrop-blur-sm">
                {building.id.startsWith("400") ? "Residential" : "Commercial"}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              {/* Main Info */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {building.id} • {building.name}
                </h3>
                
                {/* Division tag */}
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className={`font-medium ${
                    building.division === "Camden"
                      ? "text-green-700"
                      : building.division === "Hampstead"
                      ? "text-blue-700"
                      : building.division === "Ealing"
                      ? "text-purple-700"
                      : "text-gray-700"
                  }`}>
                    {building.division}
                  </span>
                </div>

                {/* Action Link */}
                <div className="hidden lg:block">
                  <span className="text-sm text-blue-600 hover:text-blue-800 font-medium group-hover:underline">
                    View Details →
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex gap-6 lg:gap-8">
                {/* Compliance */}
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-medium mb-2">COMPLIANCE</p>
                  <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${getComplianceColor(building.compliance)}`}>
                    {getComplianceIcon(building.compliance)}
                    <span className="text-lg font-bold">{building.compliance}%</span>
                  </div>
                </div>

                {/* Inbox */}
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-medium mb-2">INBOX</p>
                  <div className="flex items-center justify-center gap-3">
                    {building.inbox.urgent > 0 && (
                      <div className="relative">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {building.inbox.urgent}
                        </span>
                      </div>
                    )}
                    {building.inbox.warning > 0 && (
                      <div className="relative">
                        <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {building.inbox.warning}
                        </span>
                      </div>
                    )}
                    {building.inbox.email && (
                      <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    {!building.inbox.urgent && !building.inbox.warning && !building.inbox.email && (
                      <span className="text-gray-400 text-sm">None</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}