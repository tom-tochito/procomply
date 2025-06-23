"use client";

import React, { useState } from "react";
import CompanySearch from "./CompanySearch";
import TeamTable from "@/features/team/components/TeamTable";
import AddTeamModal from "@/features/teams/components/AddTeamModal";
import { Plus } from "lucide-react";
import { Tenant } from "@/features/tenant/models";
import type { Company } from "@/features/companies/models";
import type { FullUser } from "@/features/user/models";

interface Team {
  id: number;
  code: string;
  description: string;
  company: string;
  supervisor: string;
}

interface TeamManagementProps {
  initialTeams: Team[];
  tenant: Tenant;
  companies: Company[];
  supervisors: FullUser[];
}

export default function TeamManagement({
  initialTeams,
  tenant,
  companies,
  supervisors,
}: TeamManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#F30] text-white px-4 py-2 rounded-md hover:bg-[#E20] transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-[#F30] focus:ring-offset-2"
        >
          <Plus className="h-5 w-5 mr-1" />
          Add Team
        </button>
      </div>

      <AddTeamModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        tenant={tenant}
        companies={companies}
        supervisors={supervisors}
      />
    </>
  );
}