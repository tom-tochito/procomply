"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/common/components/Header";
import { buildings, divisions } from "@/data/buildings";

export default function BuildingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("Active Divisions");
  const [buildingUse, setBuildingUse] = useState("Building Use");
  const [availability, setAvailability] = useState("Availability");

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

    return true;
  });

  // Get compliance color based on value
  const getComplianceColor = (compliance: number) => {
    if (compliance >= 75) return "text-green-600";
    if (compliance >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Top header with logo and user info */}
      <Header />

      {/* Page title and breadcrumbs */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Building</h1>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <Link href="/dashboard" className="hover:text-blue-600">
            <span>Data Mgmt</span>
          </Link>
          <span className="mx-2">/</span>
          <span>Building</span>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="search address"
            className="border rounded-md pl-3 pr-10 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        {/* Building Use dropdown */}
        <div className="relative">
          <select
            className="appearance-none border rounded-md px-3 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={buildingUse}
            onChange={(e) => setBuildingUse(e.target.value)}
          >
            <option>Building Use</option>
            <option>Residential</option>
            <option>Commercial</option>
            <option>Mixed</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
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
          </div>
        </div>

        {/* Availability dropdown */}
        <div className="relative">
          <select
            className="appearance-none border rounded-md px-3 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            <option>Availability</option>
            <option>Available</option>
            <option>Unavailable</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
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
          </div>
        </div>
      </div>

      {/* Filter tags */}
      <div className="flex flex-wrap gap-2">
        {divisions.map((division) => (
          <button
            key={division}
            className={`px-4 py-1.5 rounded-full text-sm ${
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
      <div className="space-y-6">
        {filteredBuildings.map((building) => (
          <Link
            key={building.id}
            href={`/buildings/${building.id}`}
            className="block hover:shadow-lg transition-shadow duration-200"
          >
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Building image */}
                <div className="md:w-1/5 h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                  <img
                    src={building.image || "/placeholder-building.jpg"}
                    alt={building.name}
                    className="w-full h-full object-cover"
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
                  </div>

                  {/* Compliance and inbox */}
                  <div className="md:w-48 flex md:flex-col justify-between mt-4 md:mt-0">
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
                            <div className="relative">
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
                            </div>
                          )}

                        {"warning" in building.inbox &&
                          building.inbox.warning !== undefined &&
                          building.inbox.warning > 0 && (
                            <div className="relative">
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
                            </div>
                          )}

                        {"email" in building.inbox && building.inbox.email && (
                          <div className="relative">
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
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
