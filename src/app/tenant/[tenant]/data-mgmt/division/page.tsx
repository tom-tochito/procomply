"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/common/components/Header/Header";
import { divisions } from "@/data/buildings";
import { useParams } from "next/navigation";
import { generateTenantRedirectUrl } from "@/utils/tenant";
import DivisionTable from "@/features/division/components/DivisionTable";

export default function DivisionPage() {
  const params = useParams();
  const subdomain =
    typeof params.tenant === "string"
      ? params.tenant
      : Array.isArray(params.tenant)
      ? params.tenant[0]
      : "";
  const [searchTerm, setSearchTerm] = useState("");

  // Filter divisions based on search
  const filteredDivisions = divisions.filter((division) => {
    if (
      searchTerm &&
      !division.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Top header with logo and user info */}
      <Header />

      {/* Page title and breadcrumbs */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Division</h1>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <Link
            href={generateTenantRedirectUrl(subdomain, "dashboard")}
            className="hover:text-blue-600"
          >
            <span>Data Mgmt</span>
          </Link>
          <span className="mx-2">/</span>
          <span>Division</span>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="search"
            className="border rounded-md pl-3 pr-10 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Divisions table */}
      <DivisionTable divisions={filteredDivisions} searchTerm={searchTerm} />
    </div>
  );
}
