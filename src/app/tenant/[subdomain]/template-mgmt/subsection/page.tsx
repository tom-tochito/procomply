"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/common/components/Header";
import SubsectionForm from "@/components/SubsectionForm";
import { generateTenantRedirectUrl } from "@/utils/tenant";

// Define the SubsectionData interface
interface SubsectionData {
  code: string;
  description: string;
}

export default function SubsectionPage() {
  const paramsHook = useParams();
  const subdomain = typeof paramsHook.subdomain === 'string' ? paramsHook.subdomain : (Array.isArray(paramsHook.subdomain) ? paramsHook.subdomain[0] : '');
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SubsectionData | null>(null); // Type editingItem
  const [subsections, setSubsections] = useState<SubsectionData[]>([
    {
      code: "Access & Egress",
      description: "Access & Egress",
    },
    {
      code: "Access Gates",
      description: "Access Gates",
    },
    {
      code: "Accessible Toilet",
      description: "Accessible Toilet",
    },
    {
      code: "Access",
      description: "Access to complete an assessment",
    },
    {
      code: "Access to Electrical Panels",
      description: "Access to Electrical Panels",
    },
    {
      code: "Air Conditioning",
      description: "Air Conditioning",
    },
    {
      code: "Appliance Testing",
      description: "Appliance Testing",
    },
    {
      code: "Approach",
      description: "Approach",
    },
    {
      code: "Arson Risk",
      description: "Arson Risk",
    },
    {
      code: "Asbestos Management Plan",
      description: "Asbestos Management Plan",
    },
    {
      code: "Cabling",
      description: "Cabling",
    },
  ]);

  // Filter subsections based on search
  const filteredSubsections = subsections.filter((item: SubsectionData) => {
    // Type item
    if (!searchTerm) return true;
    return (
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle editing a subsection
  const handleEdit = (item: SubsectionData) => {
    // Type item
    setEditingItem(item);
    setFormOpen(true);
  };

  // Handle saving a subsection
  const handleSave = (data: SubsectionData) => {
    // Type data
    if (editingItem) {
      // Update existing item
      setSubsections(
        subsections.map(
          (
            item: SubsectionData // Type item
          ) => (item.code === editingItem.code ? data : item)
        )
      );
    } else {
      // Add new item
      setSubsections([...subsections, data]);
    }
    setFormOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="p-3 md:p-6 space-y-6 md:space-y-8 bg-gray-50 min-h-screen">
      {/* Top header with logo and user info */}
      <Header />

      {/* Page title and breadcrumbs */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Subsection
          </h1>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Link
              href={generateTenantRedirectUrl(subdomain, "dashboard")}
              className="hover:text-blue-600"
            >
              <span>Template Mgmt</span>
            </Link>
            <span className="mx-2">/</span>
            <span>Subsection</span>
          </div>
        </div>

        {/* Add button */}
        <button
          className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          onClick={() => {
            setEditingItem(null); // Reset editing state
            setFormOpen(true); // Open form
          }}
        >
          Add Subsection
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-md shadow-sm p-4 mb-6">
        <div className="relative w-full md:w-64">
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
      </div>

      {/* Table */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Code
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubsections.map((item) => (
                <tr
                  key={item.code}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.code}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.description}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSubsections.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center text-sm text-gray-500 italic"
                  >
                    No subsections found matching your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      <SubsectionForm
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
        editData={editingItem || undefined} // Handle null for editData
      />
    </div>
  );
}
