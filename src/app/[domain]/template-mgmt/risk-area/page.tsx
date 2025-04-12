"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/common/components/Header";

export default function RiskAreaPage() {
  const params = useParams();
  const domain = params.domain;

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Top header with logo and user info */}
      <Header />

      {/* Page title and breadcrumbs */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Risk Area</h1>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <Link href={`/${domain}/dashboard`} className="hover:text-blue-600">
            <span>Template Mgmt</span>
          </Link>
          <span className="mx-2">/</span>
          <span>Risk Area</span>
        </div>
      </div>

      {/* Placeholder content */}
      <div className="bg-white rounded-md shadow-sm p-6 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="text-xl font-medium text-gray-700 mb-2">
          Risk Area Management
        </h2>
        <p className="text-gray-500 mb-6">
          This section is under development. You'll be able to manage risk areas
          here.
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Create Risk Area
        </button>
      </div>
    </div>
  );
}
