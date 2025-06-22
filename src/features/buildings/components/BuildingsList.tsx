"use client";

import React, { useState } from "react";
import BuildingCard from "./BuildingCard";
import BuildingsTable from "./BuildingsTable";
import BuildingFilters from "./BuildingFilters";
import BuildingSearch from "./BuildingSearch";
import AddBuildingModal from "./AddBuildingModalNew";
import { BuildingWithStats } from "@/features/buildings/models";
import { Tenant } from "@/features/tenant/models";

interface BuildingsListProps {
  initialBuildings: BuildingWithStats[];
  divisions: string[];
  tenant: Tenant;
}

export default function BuildingsList({
  initialBuildings,
  divisions,
  tenant,
}: BuildingsListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("Active Divisions");
  const [buildingUse, setBuildingUse] = useState("Building Use");
  const [availability, setAvailability] = useState("Availability");
  const [viewMode, setViewMode] = useState<"cards" | "table">("table");

  // Filter buildings based on search and filters
  const filteredBuildings = initialBuildings.filter((building) => {
    // Search filter
    if (
      searchTerm &&
      !building.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !building.id.includes(searchTerm)
    ) {
      return false;
    }

    // Division filter
    if (
      selectedDivision !== "Active Divisions" &&
      building.division !== selectedDivision
    ) {
      if (selectedDivision === "Archived") {
        return building.status === "Archived";
      }
      return false;
    }

    // Building Use filter
    if (buildingUse !== "Building Use") {
      // Mock filter - would need actual building use data
      if (buildingUse === "Residential" && building.id.startsWith("400")) {
        return true;
      } else if (
        buildingUse === "Commercial" &&
        !building.id.startsWith("400")
      ) {
        return true;
      } else if (
        buildingUse !== "Residential" &&
        buildingUse !== "Commercial"
      ) {
        return true;
      } else {
        return false;
      }
    }

    // Availability filter
    if (availability !== "Availability") {
      // Mock filter - would need actual availability data
      return true;
    }

    return true;
  });


  return (
    <>
      {/* Filters and search section */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="w-full lg:w-96">
          <BuildingSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:flex-1">
          <BuildingFilters
            buildingUse={buildingUse}
            setBuildingUse={setBuildingUse}
            availability={availability}
            setAvailability={setAvailability}
          />
        </div>

        {/* View mode toggle and Add Building button */}
        <div className="lg:ml-4 flex items-center gap-2 mt-4 lg:mt-0">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setViewMode("table")}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === "cards"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setViewMode("cards")}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
          <button
            className="bg-[#F30] hover:bg-[#E20] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#F30] focus:ring-offset-2 whitespace-nowrap"
            onClick={() => setIsModalOpen(true)}
          >
            Add Building
          </button>
        </div>
      </div>

      {/* Filter tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {divisions.map((division) => (
          <button
            key={division}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap flex-shrink-0 ${
              selectedDivision === division
                ? "bg-red-50 text-[#F30] font-medium border border-[#F30]"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setSelectedDivision(division)}
          >
            {division}
          </button>
        ))}
      </div>

      {/* Building list */}
      {viewMode === "table" ? (
        <BuildingsTable buildings={filteredBuildings} tenant={tenant.slug} searchTerm={searchTerm} />
      ) : (
        <div className="space-y-4">
          {filteredBuildings.length > 0 ? (
            filteredBuildings.map((building) => (
              <BuildingCard
                key={building.id}
                building={building}
                tenant={tenant.slug}
              />
            ))
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center border border-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No buildings found
              </h3>
              <p className="text-gray-500 mb-6">
                No buildings match your current filters. Try adjusting your search
                criteria.
              </p>
              <button
                className="px-4 py-2 bg-[#F30] text-white rounded-md hover:bg-[#E20] transition-colors"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDivision("Active Divisions");
                  setBuildingUse("Building Use");
                  setAvailability("Availability");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Pagination for card view */}
      {viewMode === "cards" && filteredBuildings.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 text-sm gap-3">
          <div className="text-gray-500">
            Showing {filteredBuildings.length} buildings
          </div>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 focus:outline-none transition-colors"
              onClick={() => alert("Previous page")}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 border rounded-md bg-[#F30] text-white hover:bg-[#E20] focus:outline-none transition-colors"
              onClick={() => alert("Next page")}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add Building Modal */}
      <AddBuildingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tenant={tenant}
      />
    </>
  );
}
