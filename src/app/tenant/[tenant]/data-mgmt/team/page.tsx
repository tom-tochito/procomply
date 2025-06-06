"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/common/components/Header";
import { generateTenantRedirectUrl } from "@/utils/tenant";

// Mock data based on the screenshot
const mockTeams = [
  {
    id: 1,
    code: "",
    description: "Akelius Residential Ltd",
    company: "Akelius",
    supervisor: "",
  },
  {
    id: 2,
    code: "",
    description: "ASAP Comply Ltd",
    company: "ASAP Comply",
    supervisor: "",
  },
];

export default function TeamPage() {
  const params = useParams();
  const subdomain = typeof params.subdomain === 'string' ? params.subdomain : (Array.isArray(params.subdomain) ? params.subdomain[0] : '');
  const [searchTerm, setSearchTerm] = useState("");

  // Filter teams based on search term
  const filteredTeams = mockTeams.filter((team) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (team.code && team.code.toLowerCase().includes(searchLower)) ||
      (team.description &&
        team.description.toLowerCase().includes(searchLower)) ||
      (team.company && team.company.toLowerCase().includes(searchLower)) ||
      (team.supervisor && team.supervisor.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Top header with logo and user info */}
      <Header />

      {/* Page title and breadcrumbs */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Team</h1>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <Link href={generateTenantRedirectUrl(subdomain, "data-mgmt")} className="hover:text-blue-600">
            <span>Data Mgmt</span>
          </Link>
          <span className="mx-2">/</span>
          <span>Team</span>
        </div>
      </div>

      {/* Search field */}
      <div className="relative w-full sm:w-64">
        <input
          type="text"
          placeholder="search"
          className="border rounded-md pl-3 pr-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Teams table */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Code
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Company
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Supervisor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTeams.map((team) => (
                <tr key={team.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.code || ""}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {team.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.company}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.supervisor || ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add button at bottom right */}
      <div className="flex justify-end">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Team
        </button>
      </div>
    </div>
  );
}
