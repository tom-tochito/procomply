"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import CompanySearch from "@/features/companies/components/CompanySearch";
import DivisionTable from "@/features/divisions/components/DivisionTable";
import AddDivisionModal from "@/features/divisions/components/AddDivisionModal";
import { Plus } from "lucide-react";
import type { Doc } from "~/convex/_generated/dataModel";
import type { DivisionWithRelations } from "@/features/divisions/models";

interface DivisionManagementProps {
  tenant: Doc<"tenants">;
}

export default function DivisionManagement({ tenant }: DivisionManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch divisions
  const divisions = useQuery(api.divisions.getDivisions, { tenantId: tenant._id }) || [];

  // Transform to DivisionWithRelations format
  const divisionsWithRelations: DivisionWithRelations[] = divisions.map(division => ({
    ...division,
    buildings: [] // DivisionTable will handle the count
  }));

  const filteredDivisions = divisionsWithRelations.filter((division) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      division.name.toLowerCase().includes(searchLower) ||
      (division.type && division.type.toLowerCase().includes(searchLower)) ||
      (division.description && division.description.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <CompanySearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#F30] text-white rounded-lg hover:bg-[#E02D00] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Division
        </button>
      </div>

      <DivisionTable 
        divisions={filteredDivisions}
        searchTerm={searchTerm}
      />

      {isAddModalOpen && (
        <AddDivisionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          tenant={tenant}
        />
      )}
    </div>
  );
}