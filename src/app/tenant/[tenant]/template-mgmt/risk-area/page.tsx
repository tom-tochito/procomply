"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/common/components/Header/Header";
import RiskAreaForm from "@/components/RiskAreaForm";
import { generateTenantRedirectUrl } from "@/utils/tenant";
import RiskAreaTable from "@/features/template-mgmt/components/RiskAreaTable";

// Define the RiskAreaData interface
interface RiskAreaData {
  code: string;
  description: string;
}

export default function RiskAreaPage() {
  const paramsHook = useParams();
  const subdomain =
    typeof paramsHook.tenant === "string"
      ? paramsHook.tenant
      : Array.isArray(paramsHook.tenant)
      ? paramsHook.tenant[0]
      : "";
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RiskAreaData | null>(null); // Type editingItem
  const [riskAreas, setRiskAreas] = useState<RiskAreaData[]>([
    {
      code: "Asbestos",
      description: "Asbestos",
    },
    {
      code: "Bomb / Other Emergencies",
      description: "Bomb / Other Emergencies",
    },
    {
      code: "Building Regulations",
      description: "Building Regulations",
    },
    {
      code: "Contractors / 3rd Parties",
      description: "Contractors / 3rd Parties",
    },
    {
      code: "DSE",
      description: "Display Screen Equipment",
    },
    {
      code: "Electrical",
      description: "Electrical",
    },
    {
      code: "Electricity Supply",
      description: "Electricity Supply",
    },
    {
      code: "Energy",
      description: "Energy",
    },
    {
      code: "Environmental",
      description: "Environmental",
    },
    {
      code: "Equality / Disability",
      description: "Equality / Disability",
    },
    {
      code: "External Premises",
      description: "External Premises",
    },
  ]);

  // Filter risk areas based on search
  const filteredRiskAreas = riskAreas.filter((item: RiskAreaData) => {
    // Type item
    if (!searchTerm) return true;
    return (
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle editing a risk area
  const handleEdit = (item: RiskAreaData) => {
    // Type item
    setEditingItem(item);
    setFormOpen(true);
  };

  // Handle saving a risk area
  const handleSave = (data: RiskAreaData) => {
    // Type data
    if (editingItem) {
      // Update existing item
      setRiskAreas(
        riskAreas.map((item: RiskAreaData) =>
          item.code === editingItem.code ? data : item
        ) // Type item
      );
    } else {
      // Add new item
      setRiskAreas([...riskAreas, data]);
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
            Risk Area
          </h1>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Link
              href={generateTenantRedirectUrl(subdomain, "dashboard")}
              className="hover:text-blue-600"
            >
              <span>Template Mgmt</span>
            </Link>
            <span className="mx-2">/</span>
            <span>Risk Area</span>
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
          Add Risk Area
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
      <RiskAreaTable
        riskAreas={filteredRiskAreas}
        searchTerm={searchTerm}
        onEdit={handleEdit}
      />

      {/* Form Modal */}
      <RiskAreaForm
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
