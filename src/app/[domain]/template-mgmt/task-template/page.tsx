"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/common/components/Header";

export default function TaskTemplatePage() {
  const params = useParams();
  const domain = params.domain;

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Top header with logo and user info */}
      <Header />

      {/* Page title and breadcrumbs */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Task Template</h1>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <Link href={`/${domain}/dashboard`} className="hover:text-blue-600">
            <span>Template Mgmt</span>
          </Link>
          <span className="mx-2">/</span>
          <span>Task Template</span>
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h2 className="text-xl font-medium text-gray-700 mb-2">
          Task Template Management
        </h2>
        <p className="text-gray-500 mb-6">
          This section is under development. You'll be able to manage task
          templates here.
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Create Task Template
        </button>
      </div>
    </div>
  );
}
