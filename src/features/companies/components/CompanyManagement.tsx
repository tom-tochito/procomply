"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import CompanySearch from "./CompanySearch";
import CompanyTable from "@/features/companies/components/CompanyTable";
import AddCompanyModal from "@/features/companies/components/AddCompanyModal";
import { Plus } from "lucide-react";
import type { Doc } from "~/convex/_generated/dataModel";

interface CompanyManagementProps {
  tenant: Doc<"tenants">;
}

export default function CompanyManagement({ tenant }: CompanyManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch companies with tenantId
  const companies = useQuery(api.companies.getCompanies, { tenantId: tenant._id }) || [];

  const filteredCompanies = companies.filter((company) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      company.name.toLowerCase().includes(searchLower) ||
      (company.referral && company.referral.toLowerCase().includes(searchLower)) ||
      (company.category && company.category.toLowerCase().includes(searchLower)) ||
      (company.email && company.email.toLowerCase().includes(searchLower))
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
          Add Company
        </button>
      </div>

      <CompanyTable 
        companies={filteredCompanies}
        searchTerm={searchTerm}
      />

      {isAddModalOpen && (
        <AddCompanyModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          tenant={tenant}
        />
      )}
    </div>
  );
}