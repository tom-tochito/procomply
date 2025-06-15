"use client";

import React, { useState } from "react";
import CompanySearch from "./CompanySearch";
import TeamTable from "@/features/team/components/TeamTable";

interface Team {
  id: number;
  code: string;
  description: string;
  company: string;
  supervisor: string;
}

interface TeamManagementProps {
  initialTeams: Team[];
  tenant: string;
}

export default function TeamManagement({
  initialTeams,
}: TeamManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTeams = initialTeams.filter((team) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (team.code && team.code.toLowerCase().includes(searchLower)) ||
      (team.description &&
        team.description.toLowerCase().includes(searchLower)) ||
      (team.company && team.company.toLowerCase().includes(searchLower)) ||
      (team.supervisor && team.supervisor.toLowerCase().includes(searchLower))
    );
  });

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-6">
        <CompanySearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <TeamTable teams={filteredTeams} searchTerm={searchTerm} />

      <div className="flex justify-end mt-6">
        <button className="bg-[#F30] text-white px-4 py-2 rounded-md hover:bg-[#E20] transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-[#F30] focus:ring-offset-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Team
        </button>
      </div>
    </>
  );
}