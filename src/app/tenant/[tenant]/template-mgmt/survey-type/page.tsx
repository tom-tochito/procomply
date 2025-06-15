"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/common/components/Header/Header";
import SurveyTypeForm from "@/components/SurveyTypeForm";
import { generateTenantRedirectUrl } from "@/utils/tenant";
import SurveyTypeTable from "@/components/SurveyTypeTable";

// Define the SurveyTypeData interface
interface SurveyTypeData {
  name: string;
  description: string;
}

export default function SurveyTypePage() {
  const paramsHook = useParams();
  const subdomain =
    typeof paramsHook.subdomain === "string"
      ? paramsHook.subdomain
      : Array.isArray(paramsHook.subdomain)
      ? paramsHook.subdomain[0]
      : "";
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SurveyTypeData | null>(null); // Type editingItem
  const [surveyTypes, setSurveyTypes] = useState<SurveyTypeData[]>([
    {
      name: "ASB-DS",
      description: "Asbestos Demolition Survey",
    },
    {
      name: "ASB-MS",
      description: "Asbestos Management Survey",
    },
    {
      name: "ASB-RS",
      description: "Asbestos Refurbishment Survey",
    },
    {
      name: "ACC-AR",
      description: "Disability/Access Audit Report",
    },
    {
      name: "EICR",
      description: "Electrical Installation Condition Report",
    },
    {
      name: "F DR INS",
      description: "Fire Door Inspection",
    },
    {
      name: "FDI",
      description: "Fire Door Inspection",
    },
    {
      name: "FRA",
      description: "Fire Risk Assessment",
    },
    {
      name: "HS-MVR",
      description: "Health & Safety Monthly Visit Report",
    },
    {
      name: "HSRA",
      description: "H&S Risk Assessment",
    },
    {
      name: "LRA",
      description: "L8 Legionella Risk Assessment",
    },
  ]);

  // Filter survey types based on search
  const filteredSurveyTypes = surveyTypes.filter((item: SurveyTypeData) => {
    // Type item
    if (!searchTerm) return true;
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle editing a survey type
  const handleEdit = (item: SurveyTypeData) => {
    // Type item
    setEditingItem(item);
    setFormOpen(true);
  };

  // Handle saving a survey type
  const handleSave = (data: SurveyTypeData) => {
    // Type data
    if (editingItem) {
      // Update existing item
      setSurveyTypes(
        surveyTypes.map(
          (
            item: SurveyTypeData // Type item
          ) => (item.name === editingItem.name ? data : item)
        )
      );
    } else {
      // Add new item
      setSurveyTypes([...surveyTypes, data]);
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
            SurveyType
          </h1>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Link
              href={generateTenantRedirectUrl(subdomain, "dashboard")}
              className="hover:text-blue-600"
            >
              <span>Template Mgmt</span>
            </Link>
            <span className="mx-2">/</span>
            <span>SurveyType</span>
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
          Add Survey Type
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
      <SurveyTypeTable surveyTypes={filteredSurveyTypes} onEdit={handleEdit} />

      {/* Form Modal */}
      <SurveyTypeForm
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
