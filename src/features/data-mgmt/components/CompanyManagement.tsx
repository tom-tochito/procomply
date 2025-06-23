"use client";

import React, { useState } from "react";
import CompanySearch from "./CompanySearch";
import CompanyTable from "@/features/company/components/CompanyTable";
import AddCompanyModal from "@/features/companies/components/AddCompanyModal";
import { Plus } from "lucide-react";
import { Tenant } from "@/features/tenant/models";

interface Company {
  id: string;
  name: string;
  referral: string;
  category: string;
  email: string | null;
  phone: string | null;
  postcode: string | null;
  number_of_employees: number | null;
}

interface CompanyManagementProps {
  initialCompanies: Company[];
  tenant: Tenant;
}

export default function CompanyManagement({
  initialCompanies,
  tenant,
}: CompanyManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredCompanies = initialCompanies.filter((company) => {
    if (
      searchTerm &&
      !company.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !company.referral.toLowerCase().includes(searchTerm.toLowerCase())
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
          Add Company
        </button>
      </div>

      <CompanyTable companies={filteredCompanies} searchTerm={searchTerm} />

      <AddCompanyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        tenant={tenant}
      />
    </>
  );
}