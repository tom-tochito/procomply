"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/common/components/Header";
import CountryForm from "@/components/CountryForm";
import { generateTenantRedirectUrl } from "@/utils/tenant";
import CountryTable from "@/components/CountryTable";

// Define the CountryData interface
interface CountryData {
  code: string;
  description: string;
}

export default function CountryPage() {
  const paramsHook = useParams();
  const subdomain = typeof paramsHook.subdomain === 'string' ? paramsHook.subdomain : (Array.isArray(paramsHook.subdomain) ? paramsHook.subdomain[0] : '');
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CountryData | null>(null); // Type editingItem
  const [countries, setCountries] = useState<CountryData[]>([
    {
      code: "ENG",
      description: "England",
    },
    {
      code: "NI",
      description: "Northern Ireland",
    },
    {
      code: "ROI",
      description: "Republic of Ireland",
    },
    {
      code: "SCO",
      description: "Scotland",
    },
    {
      code: "WAL",
      description: "Wales",
    },
  ]);

  // Filter countries based on search
  const filteredCountries = countries.filter((item: CountryData) => {
    // Type item
    if (!searchTerm) return true;
    return (
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle editing a country
  const handleEdit = (item: CountryData) => {
    // Type item
    setEditingItem(item);
    setFormOpen(true);
  };

  // Handle saving a country
  const handleSave = (data: CountryData) => {
    // Type data
    if (editingItem) {
      // Update existing item
      setCountries(
        countries.map((item: CountryData) =>
          item.code === editingItem.code ? data : item
        ) // Type item
      );
    } else {
      // Add new item
      setCountries([...countries, data]);
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
            Country
          </h1>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Link
              href={generateTenantRedirectUrl(subdomain, "dashboard")}
              className="hover:text-blue-600"
            >
              <span>Template Mgmt</span>
            </Link>
            <span className="mx-2">/</span>
            <span>Country</span>
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
          Add Country
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
      <CountryTable countries={filteredCountries} onEdit={handleEdit} />

      {/* Form Modal */}
      <CountryForm
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
        editData={editingItem || undefined}
      />
    </div>
  );
}
