"use client";

import React, { useState } from "react";
import CompanySearch from "./CompanySearch";
import DivisionTable from "@/features/division/components/DivisionTable";
import AddDivisionModal from "@/features/divisions/components/AddDivisionModal";
import { Plus } from "lucide-react";
import { Tenant } from "@/features/tenant/models";
import { DivisionWithRelations } from "@/features/divisions/models";

interface DivisionManagementProps {
  initialDivisions: DivisionWithRelations[];
  tenant: Tenant;
}

export default function DivisionManagement({
  initialDivisions,
  tenant,
}: DivisionManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredDivisions = initialDivisions.filter((division) => {
    if (
      searchTerm &&
      !division.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-6">
        <CompanySearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-[#F30] text-white rounded-md hover:bg-[#E62E00] transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Division
        </button>
      </div>

      <DivisionTable divisions={filteredDivisions} searchTerm={searchTerm} />

      <AddDivisionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        tenant={tenant}
      />
    </>
  );
}