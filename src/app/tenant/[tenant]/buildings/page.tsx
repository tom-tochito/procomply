"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/common/components/Header";
import {
  buildings as initialBuildings,
  divisions,
  Building,
} from "@/data/buildings";
import { useParams } from "next/navigation";
import AddBuildingModal from "@/components/modals/AddBuildingModal";
import { generateTenantRedirectUrl } from "@/utils/tenant";

export default function BuildingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buildings, setBuildings] = useState<Building[]>(initialBuildings);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("Active Divisions");
  const [buildingUse, setBuildingUse] = useState("Building Use");
  const [availability, setAvailability] = useState("Availability");
  const [buildingUseOpen, setBuildingUseOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const params = useParams();
  const subdomain = typeof params.tenant === 'string' ? params.tenant : (Array.isArray(params.tenant) ? params.tenant[0] : '');

  // Check if screen is mobile size
  useEffect(() => {
    const handleResize = () => {
      // setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter buildings based on search and filters
  const filteredBuildings = buildings.filter((building) => {
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

  // Get compliance color based on value
  const getComplianceColor = (compliance: number) => {
    if (compliance >= 75) return "text-green-600";
    if (compliance >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const closeDropdowns = () => {
    setBuildingUseOpen(false);
    setAvailabilityOpen(false);
  };

  // Function to handle saving a new building
  const handleSaveBuilding = (newBuildingData: Building) => {
    // Here you would typically send the data to your backend/API
    // For now, we'll just add it to the local state
    setBuildings((prevBuildings) => [newBuildingData, ...prevBuildings]);
    console.log("New Building Saved:", newBuildingData);
    // Optionally refetch data or update UI further
  };

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-8 bg-gray-50 min-h-screen">
      {/* Top header with logo and user info */}
      <Header />

      {/* Page title and breadcrumbs */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Building
        </h1>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <Link
            href={generateTenantRedirectUrl(subdomain, "dashboard")}
            className="hover:text-blue-600"
          >
            <span>Data Mgmt</span>
          </Link>
          <span className="mx-2">/</span>
          <span>Building</span>
        </div>
      </div>

      {/* Filters and search section - mobile friendly */}
      <div className="space-y-3 md:space-y-0 md:flex md:flex-wrap md:items-center md:gap-3">
        {/* Search */}
        <div className="w-full md:w-48">
          <input
            type="text"
            placeholder="search address"
            className="border rounded-md pl-3 pr-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Building Use dropdown */}
        <div className="relative w-full md:w-48">
          <button
            className="appearance-none w-full flex items-center justify-between border rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            onClick={() => {
              setBuildingUseOpen(!buildingUseOpen);
              setAvailabilityOpen(false);
            }}
          >
            <span
              className={
                buildingUse === "Building Use"
                  ? "text-gray-500"
                  : "text-gray-900"
              }
            >
              {buildingUse}
            </span>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          {buildingUseOpen && (
            <>
              <div
                className="fixed inset-0 z-0"
                onClick={() => setBuildingUseOpen(false)}
              ></div>
              <div className="absolute left-0 mt-1 w-full bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
                <div
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setBuildingUse("Building Use");
                    setBuildingUseOpen(false);
                  }}
                >
                  All Building Uses
                </div>
                <div
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setBuildingUse("Residential");
                    setBuildingUseOpen(false);
                  }}
                >
                  Residential
                </div>
                <div
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setBuildingUse("Commercial");
                    setBuildingUseOpen(false);
                  }}
                >
                  Commercial
                </div>
                <div
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setBuildingUse("Mixed");
                    setBuildingUseOpen(false);
                  }}
                >
                  Mixed
                </div>
              </div>
            </>
          )}
        </div>

        {/* Availability dropdown */}
        <div className="relative w-full md:w-48">
          <button
            className="appearance-none w-full flex items-center justify-between border rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            onClick={() => {
              setAvailabilityOpen(!availabilityOpen);
              setBuildingUseOpen(false);
            }}
          >
            <span
              className={
                availability === "Availability"
                  ? "text-gray-500"
                  : "text-gray-900"
              }
            >
              {availability}
            </span>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          {availabilityOpen && (
            <>
              <div
                className="fixed inset-0 z-0"
                onClick={() => setAvailabilityOpen(false)}
              ></div>
              <div className="absolute left-0 mt-1 w-full bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
                <div
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setAvailability("Availability");
                    setAvailabilityOpen(false);
                  }}
                >
                  All Availability
                </div>
                <div
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setAvailability("Available");
                    setAvailabilityOpen(false);
                  }}
                >
                  Available
                </div>
                <div
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setAvailability("Unavailable");
                    setAvailabilityOpen(false);
                  }}
                >
                  Unavailable
                </div>
              </div>
            </>
          )}
        </div>

        {/* Add Building button */}
        <div className="w-full md:w-auto md:ml-auto">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
            onClick={() => setIsModalOpen(true)}
          >
            Add Building
          </button>
        </div>
      </div>

      {/* Filter tags - scrollable on mobile */}
      <div className="flex overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0 py-1 md:flex-wrap gap-2 hide-scrollbar">
        {divisions.map((division) => (
          <button
            key={division}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap flex-shrink-0 ${
              selectedDivision === division
                ? "bg-blue-100 text-blue-800 font-medium"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setSelectedDivision(division)}
          >
            {division}
          </button>
        ))}
      </div>

      {/* Building list */}
      <div className="space-y-4 md:space-y-6">
        {filteredBuildings.length > 0 ? (
          filteredBuildings.map((building) => (
            <Link
              key={building.id}
              href={generateTenantRedirectUrl(subdomain, `buildings/${building.id}`)}
              className="block hover:shadow-lg transition-shadow duration-200"
              onClick={() => closeDropdowns()}
            >
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Building image */}
                  <div className="w-full md:w-1/5 h-48 md:h-auto md:min-h-[12rem] bg-gray-100 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                    <Image
                      src={building.image || "/placeholder-building.jpg"}
                      alt={building.name}
                      layout="fill"
                      objectFit="cover"
                      className="w-full h-full"
                    />
                  </div>

                  {/* Building info */}
                  <div className="flex-1 p-4 md:p-6 flex flex-col md:flex-row">
                    <div className="flex-grow">
                      <div className="flex items-center">
                        <h2 className="text-lg font-medium text-gray-900">
                          {building.id} {building.name}
                        </h2>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs rounded ${
                            building.division === "Camden"
                              ? "bg-green-100 text-green-800"
                              : building.division === "Hampstead"
                              ? "bg-blue-100 text-blue-800"
                              : building.division === "Ealing"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {building.division}
                        </span>

                        {/* Mock building use badge */}
                        <span className="inline-block px-2 py-0.5 text-xs rounded bg-amber-100 text-amber-800">
                          {building.id.startsWith("400")
                            ? "Residential"
                            : "Commercial"}
                        </span>
                      </div>

                      {/* Quick action buttons on mobile */}
                      <div className="mt-3 md:hidden flex space-x-2">
                        <button
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`View tasks for ${building.name}`);
                          }}
                        >
                          View Tasks
                        </button>
                        <button
                          className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`View documents for ${building.name}`);
                          }}
                        >
                          Documents
                        </button>
                      </div>
                    </div>

                    {/* Compliance and inbox */}
                    <div className="flex flex-col justify-between mt-4 md:mt-0 md:w-48">
                      <div className="text-center mb-4">
                        <h4 className="text-sm text-gray-500">Compliance:</h4>
                        <div
                          className={`flex items-center justify-center ${getComplianceColor(
                            building.compliance
                          )}`}
                        >
                          {building.compliance < 50 ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : building.compliance >= 75 ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          <span className="text-lg font-semibold ml-1">
                            {building.compliance}%
                          </span>
                        </div>
                      </div>

                      <div className="text-center">
                        <h4 className="text-sm text-gray-500">Inbox:</h4>
                        <div className="flex items-center justify-center space-x-4 mt-1">
                          {"urgent" in building.inbox &&
                            building.inbox.urgent !== undefined &&
                            building.inbox.urgent > 0 && (
                              <div
                                className="relative group cursor-pointer"
                                onClick={(e) => {
                                  e.preventDefault();
                                  alert(
                                    `${building.inbox.urgent} urgent notifications`
                                  );
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6 text-red-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  />
                                </svg>
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                                  {building.inbox.urgent}
                                </span>
                                <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                  {building.inbox.urgent} urgent notifications
                                </div>
                              </div>
                            )}

                          {"warning" in building.inbox &&
                            building.inbox.warning !== undefined &&
                            building.inbox.warning > 0 && (
                              <div
                                className="relative group cursor-pointer"
                                onClick={(e) => {
                                  e.preventDefault();
                                  alert(`${building.inbox.warning} warnings`);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6 text-amber-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                  />
                                </svg>
                                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                                  {building.inbox.warning}
                                </span>
                                <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                  {building.inbox.warning} warnings
                                </div>
                              </div>
                            )}

                          {"email" in building.inbox &&
                            building.inbox.email && (
                              <div
                                className="relative group cursor-pointer"
                                onClick={(e) => {
                                  e.preventDefault();
                                  alert("New document notification");
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6 text-teal-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                  New document available
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm text-center">
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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

      {/* Pagination */}
      {filteredBuildings.length > 0 && (
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
              className="px-3 py-1 border rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none transition-colors"
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
        onSave={handleSaveBuilding}
      />
    </div>
  );
}
