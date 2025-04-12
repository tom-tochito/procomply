"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/common/components/Header";

export default function LegislationPage() {
  const params = useParams();
  const domain = params.domain;

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Top header with logo and user info */}
      <Header />

      {/* Page title and breadcrumbs */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Legislation</h1>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <Link href={`/${domain}/dashboard`} className="hover:text-blue-600">
            <span>Template Mgmt</span>
          </Link>
          <span className="mx-2">/</span>
          <span>Legislation</span>
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
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
        <h2 className="text-xl font-medium text-gray-700 mb-2">
          Legislation Management
        </h2>
        <p className="text-gray-500 mb-6">
          This section is under development. You'll be able to manage
          legislation references here.
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Add Legislation
        </button>
      </div>
    </div>
  );
}
