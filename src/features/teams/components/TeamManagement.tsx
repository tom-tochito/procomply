"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import CompanySearch from "@/features/companies/components/CompanySearch";
import TeamTable from "@/features/teams/components/TeamTable";
import AddTeamModal from "@/features/teams/components/AddTeamModal";
import { Plus } from "lucide-react";
import type { Doc } from "~/convex/_generated/dataModel";

interface TeamManagementProps {
  tenant: Doc<"tenants">;
}

export default function TeamManagement({ tenant }: TeamManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch data from Convex
  const teams = useQuery(api.teams.getTeams, { tenantId: tenant._id }) || [];
  const companies = useQuery(api.companies.getCompanies, { tenantId: tenant._id }) || [];
  const users = useQuery(api.users.getUsers, { tenantId: tenant._id }) || [];

  // Transform teams data to include company and supervisor names
  const teamsWithDetails = teams.map((team: any) => {
    // Find user by matching profile id
    const supervisor = users.find((u: any) => u && u._id === team.supervisorId);
    return {
      id: team._id,
      code: team.code || "",
      description: team.name, // TeamTable expects 'description' not 'name'
      company: companies.find(c => c._id === team.companyId)?.name || "",
      supervisor: supervisor ? (supervisor.name || supervisor.email || "Unknown") : ""
    };
  });

  const filteredTeams = teamsWithDetails.filter((team) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      !searchTerm ||
      team.description.toLowerCase().includes(searchLower) ||
      team.code.toLowerCase().includes(searchLower) ||
      team.company.toLowerCase().includes(searchLower) ||
      team.supervisor.toLowerCase().includes(searchLower)
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
          Add Team
        </button>
      </div>

      <TeamTable 
        teams={filteredTeams}
        searchTerm={searchTerm}
      />

      {isAddModalOpen && (
        <AddTeamModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          companies={companies}
          supervisors={users}
          tenant={tenant}
        />
      )}
    </div>
  );
}