"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import BuildingCard from "./BuildingCard";
import BuildingsTable from "./BuildingsTable";
import BuildingSearch from "./BuildingSearch";
import AddBuildingModal from "./AddBuildingModalNew";
import { BuildingWithStats } from "@/features/buildings/models";
import { Tenant } from "@/features/tenant/models";
import { getStorageFileUrl } from "@/common/utils/storage";
// import { COMPLIANCE_CHECK_TYPES } from "@/features/compliance/models";

interface BuildingsListProps {
  tenant: Tenant;
}

export default function BuildingsList({ tenant }: BuildingsListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("table");
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  // Fetch buildings with Convex
  const buildings = useQuery(api.buildings.getBuildings, {
    tenantId: tenant._id,
  });

  // Fetch divisions data
  // const divisions = useQuery(api.divisions.getDivisions, {
  //   tenantId: tenant._id,
  //   type: "Active",
  // });

  // Fetch tasks for buildings
  const tasks = useQuery(api.tasks.getTasks, { tenantId: tenant._id });

  // Transform buildings to include stats
  const buildingsWithStats = useMemo(() => {
    if (!buildings) return [];
    
    return buildings.map((building): BuildingWithStats => {
      // Get tasks for this building
      const buildingTasks = tasks?.filter(t => t.buildingId === building._id) || [];
      
      // Calculate task-based compliance
      const taskStats = {
        total: buildingTasks.length,
        completed: buildingTasks.filter((task) => task.status === "completed").length,
      };
      const taskCompliance = taskStats.total > 0
        ? Math.round((taskStats.completed / taskStats.total) * 100)
        : 100;

      // For now, we'll use task-based compliance only
      // TODO: Add compliance checks when that feature is implemented
      const compliance = taskCompliance;
      
      return {
        ...building,
        image: building.image ? getStorageFileUrl(tenant.slug, building.image) : undefined,
        division: building.division || "Unassigned",
        status: "Active",
        compliance,
        inbox: { urgent: 0, warning: 0, email: false },
      };
    });
  }, [buildings, tasks, tenant.slug]);

  const buildingsLoading = buildings === undefined || tasks === undefined;
  const buildingsError = null; // Convex handles errors differently

  // Filter buildings based on search
  const filteredBuildings = useMemo(() => {
    if (!buildingsWithStats) return [];
    
    let filtered = [...buildingsWithStats];
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (building) =>
          building.name.toLowerCase().includes(term) ||
          (building.templateData && JSON.stringify(building.templateData).toLowerCase().includes(term))
      );
    }
    
    return filtered;
  }, [buildingsWithStats, searchTerm]);

  // Pagination
  const paginatedBuildings = useMemo(() => {
    const startIndex = (pageNumber - 1) * pageSize;
    return filteredBuildings.slice(startIndex, startIndex + pageSize);
  }, [filteredBuildings, pageNumber, pageSize]);

  // Get count of buildings per division
  // const divisionCounts = useMemo(() => {
  //   if (!divisions || !buildingsWithStats) return {};
  //   
  //   const counts: Record<string, number> = {};
  //   divisions.forEach((division) => {
  //     counts[division._id] = buildingsWithStats.filter(
  //       (building) => building.divisionId === division._id
  //     ).length;
  //   });
  //   return counts;
  // }, [divisions, buildingsWithStats]);

  // const handleDeleteBuilding = (buildingId: string) => {
  //   // Implement delete functionality
  //   console.log("Delete building:", buildingId);
  // };

  // const handleEditBuilding = (buildingId: string) => {
  //   // Implement edit functionality
  //   console.log("Edit building:", buildingId);
  // };

  const totalPages = Math.ceil(filteredBuildings.length / pageSize);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Buildings</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-md bg-[#F30] px-4 py-2 text-sm font-medium text-white hover:bg-[#D20]"
        >
          Add Building
        </button>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <BuildingSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("cards")}
              className={`p-2 ${viewMode === "cards" ? "text-[#F30]" : "text-gray-400"}`}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 ${viewMode === "table" ? "text-[#F30]" : "text-gray-400"}`}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>


        {buildingsLoading && (
          <div className="flex h-64 items-center justify-center">
            <div className="text-gray-500">Loading buildings...</div>
          </div>
        )}

        {buildingsError && (
          <div className="flex h-64 items-center justify-center">
            <div className="text-red-500">Error loading buildings</div>
          </div>
        )}

        {!buildingsLoading && !buildingsError && paginatedBuildings.length === 0 && (
          <div className="flex h-64 items-center justify-center">
            <div className="text-gray-500">No buildings found</div>
          </div>
        )}

        {!buildingsLoading && !buildingsError && paginatedBuildings.length > 0 && (
          <>
            {viewMode === "cards" ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedBuildings.map((building) => (
                  <BuildingCard key={building._id} building={building} tenant={tenant.slug} />
                ))}
              </div>
            ) : (
              <BuildingsTable
                buildings={paginatedBuildings}
                tenant={tenant.slug}
              />
            )}

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                  disabled={pageNumber === 1}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {pageNumber} of {totalPages}
                </span>
                <button
                  onClick={() => setPageNumber(Math.min(totalPages, pageNumber + 1))}
                  disabled={pageNumber === totalPages}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {isModalOpen && (
        <AddBuildingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          tenant={tenant}
        />
      )}
    </div>
  );
}