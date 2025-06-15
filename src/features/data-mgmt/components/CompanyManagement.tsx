"use client";

import React, { useState } from "react";
import CompanySearch from "./CompanySearch";
import CompanyTable from "@/features/company/components/CompanyTable";

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
  tenant: string;
}

export default function CompanyManagement({
  initialCompanies,
}: CompanyManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");

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
      </div>

      <CompanyTable companies={filteredCompanies} searchTerm={searchTerm} />
    </>
  );
}