"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import CompanySearch from "./CompanySearch";
import CompanyTable from "@/features/company/components/CompanyTable";
import AddCompanyModal from "@/features/companies/components/AddCompanyModal";
import { Plus } from "lucide-react";

export default function CompanyManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch companies and tenant data
  const companies = useQuery(api.companies.getCompanies, {}) || [];
  const tenant = useQuery(api.tenants.getCurrentTenant, {});

  const filteredCompanies = companies.filter((company) => {
    if (
      searchTerm &&
      !company.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !company.referral.toLowerCase().includes(searchTerm.toLowerCase())
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
          Add Company
        </button>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-lg shadow">
        <CompanyTable companies={filteredCompanies} />
      </div>

      {/* Add Company Modal */}
      <AddCompanyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        tenant={tenant}
      />
    </div>
  );
}