"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import CompanySearch from "@/features/companies/components/CompanySearch";
import TeamTable from "@/features/teams/components/TeamTable";
import AddTeamModal from "@/features/teams/components/AddTeamModal";
import { Plus } from "lucide-react";

export default function TeamManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch data from Convex
  const tenant = useQuery(api.tenants.getCurrentTenant, {});
  const teams = useQuery(api.teams.getTeams, tenant ? { tenantId: tenant._id } : "skip") || [];
  const companies = useQuery(
    api.companies.getCompanies, 
    tenant ? { tenantId: tenant._id } : "skip"
  ) || [];
  const users = useQuery(api.users.getUsers, tenant ? { tenantId: tenant._id } : "skip") || [];

  // Transform teams data to include company and supervisor names
  const teamsWithDetails = teams.map((team: any) => {
    // Find user by matching profile id
    const supervisor = users.find((u: any) => u && u._id === team.supervisorId);
    return {
      id: team._id,
      code: team.code || "",
      description: team.description,
      company: companies.find(c => c._id === team.companyId)?.name || "",
      supervisor: supervisor?.name || supervisor?.email || ""
    };
  });

  const filteredTeams = teamsWithDetails.filter((team) => {
    if (
      searchTerm &&
      !team.code.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !team.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !team.company.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !team.supervisor.toLowerCase().includes(searchTerm.toLowerCase())
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
          Add Team
        </button>
      </div>

      {/* Teams Table */}
      <div className="bg-white rounded-lg shadow">
        <TeamTable teams={filteredTeams} />
      </div>

      {/* Add Team Modal */}
      <AddTeamModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        tenant={tenant}
        companies={companies}
        supervisors={users.filter((u: any) => u !== null) as any}
      />
    </div>
  );
}