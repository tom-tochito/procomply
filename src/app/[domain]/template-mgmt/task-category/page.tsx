"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/common/components/Header";

export default function TaskCategoryPage() {
  const params = useParams();
  const domain = params.domain;

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Top header with logo and user info */}
      <Header />

      {/* Page title and breadcrumbs */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Task Category</h1>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <Link href={`/${domain}/dashboard`} className="hover:text-blue-600">
            <span>Template Mgmt</span>
          </Link>
          <span className="mx-2">/</span>
          <span>Task Category</span>
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
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
        <h2 className="text-xl font-medium text-gray-700 mb-2">
          Task Category Management
        </h2>
        <p className="text-gray-500 mb-6">
          This section is under development. You'll be able to manage task
          categories here.
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Create Task Category
        </button>
      </div>
    </div>
  );
}
