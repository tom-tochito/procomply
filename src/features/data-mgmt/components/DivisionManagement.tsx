"use client";

import React, { useState } from "react";
import CompanySearch from "./CompanySearch";
import DivisionTable from "@/features/division/components/DivisionTable";

interface DivisionManagementProps {
  initialDivisions: string[];
  tenant: string;
}

export default function DivisionManagement({
  initialDivisions,
}: DivisionManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDivisions = initialDivisions.filter((division) => {
    if (
      searchTerm &&
      !division.toLowerCase().includes(searchTerm.toLowerCase())
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

      <DivisionTable divisions={filteredDivisions} searchTerm={searchTerm} />
    </>
  );
}