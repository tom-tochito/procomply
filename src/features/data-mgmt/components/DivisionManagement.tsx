"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import CompanySearch from "./CompanySearch";
import DivisionTable from "@/features/division/components/DivisionTable";
import AddDivisionModal from "@/features/divisions/components/AddDivisionModal";
import { Plus } from "lucide-react";

export default function DivisionManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch divisions and tenant data
  const tenant = useQuery(api.tenants.getCurrentTenant, {});
  const divisions = useQuery(api.divisions.getDivisions, tenant ? { tenantId: tenant._id } : "skip") || [];

  const filteredDivisions = divisions.filter((division) => {
    if (
      searchTerm &&
      !division.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  if (!tenant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Add Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <CompanySearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#7600FF] hover:bg-[#6600e5] rounded-md transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Division
        </button>
      </div>

      {/* Divisions Table */}
      <div className="bg-white rounded-lg shadow">
        <DivisionTable divisions={filteredDivisions} />
      </div>

      {/* Add Division Modal */}
      <AddDivisionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        tenant={tenant}
      />
    </div>
  );
}