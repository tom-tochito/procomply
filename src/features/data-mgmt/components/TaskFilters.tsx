"use client";

import React, { useState } from "react";

interface TaskFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedDivision: string;
  setSelectedDivision: (division: string) => void;
  selectedTeam: string;
  setSelectedTeam: (team: string) => void;
  selectedAssignee: string;
  setSelectedAssignee: (assignee: string) => void;
  buildingUse: string;
  setBuildingUse: (use: string) => void;
  onAddTaskClick: () => void;
  onColumnsMenuToggle: () => void;
  divisions?: string[]; // Dynamic divisions from database
}

const availableTeams = [
  "ASAP Comply Ltd",
  "Property Fire Protection",
  "UK Fire Protection",
  "All Teams",
];

export default function TaskFilters({
  searchTerm,
  setSearchTerm,
  selectedDivision,
  setSelectedDivision,
  selectedTeam,
  setSelectedTeam,
  selectedAssignee,
  setSelectedAssignee,
  buildingUse,
  setBuildingUse,
  onAddTaskClick,
  onColumnsMenuToggle,
  divisions = ["All Divisions"], // Default if no divisions provided
}: TaskFiltersProps) {
  const [teamsDropdownOpen, setTeamsDropdownOpen] = useState(false);
  const [assigneeDropdownOpen, setAssigneeDropdownOpen] = useState(false);
  const [buildingUseDropdownOpen, setBuildingUseDropdownOpen] = useState(false);

  return (
    <div className="bg-white rounded-md shadow-sm p-4 sm:p-6 mb-6">
      {/* Top section: Search and Division filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        {/* Search input */}
        <div className="relative w-full lg:w-64">
          <input
            type="text"
            placeholder="search tasks"
            className="border rounded-md pl-3 pr-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#F30] focus:border-transparent"
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

        {/* Division pills for desktop */}
        <div className="hidden lg:flex flex-wrap gap-2 flex-1">
          <button
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              selectedDivision === "All Divisions"
                ? "bg-red-50 text-[#F30] font-medium border border-[#F30]"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setSelectedDivision("All Divisions")}
          >
            All Divisions
          </button>
          {divisions.map(div => (
            <button
              key={div}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                selectedDivision === div
                  ? "bg-red-50 text-[#F30] font-medium border border-[#F30]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedDivision(div)}
            >
              {div}
            </button>
          ))}
        </div>

        {/* Mobile division dropdown */}
        <div className="lg:hidden w-full">
          <select
            className="appearance-none w-full border rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#F30] focus:border-transparent"
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
          >
            <option value="All Divisions">All Divisions</option>
            {divisions.map(div => (
              <option key={div} value={div}>{div}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Middle section: Filter dropdowns */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-4">
        {/* Team filter */}
        <div className="relative">
          <button
            className="inline-flex items-center justify-between border px-3 py-1.5 rounded-md text-sm hover:bg-gray-50 min-w-[160px]"
            onClick={() => setTeamsDropdownOpen(!teamsDropdownOpen)}
          >
            {selectedTeam || "Filter by team"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {teamsDropdownOpen && (
            <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
              {availableTeams.map((team) => (
                <div
                  key={team}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedTeam(team === "All Teams" ? "" : team);
                    setTeamsDropdownOpen(false);
                  }}
                >
                  {team}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assignee filter */}
        <div className="relative">
          <button
            className="inline-flex items-center justify-between border px-3 py-1.5 rounded-md text-sm hover:bg-gray-50 min-w-[180px]"
            onClick={() => setAssigneeDropdownOpen(!assigneeDropdownOpen)}
          >
            {selectedAssignee || "Filter by assignee"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {assigneeDropdownOpen && (
            <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
              <div
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelectedAssignee("");
                  setAssigneeDropdownOpen(false);
                }}
              >
                All Assignees
              </div>
              <div
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelectedAssignee("Mark Burchall (ASAP)");
                  setAssigneeDropdownOpen(false);
                }}
              >
                Mark Burchall (ASAP)
              </div>
            </div>
          )}
        </div>

        {/* Icon button groups */}
        <div className="flex gap-2">
          <div className="flex border rounded-md">
            <button
              className="p-1.5 border-r hover:bg-gray-50"
              onClick={() => alert("Priority filter clicked")}
              title="Priority"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </button>
            <button
              className="p-1.5 hover:bg-gray-50"
              onClick={() => alert("Completed filter clicked")}
              title="Completed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
          </div>

          <div className="flex border rounded-md">
            <button
              className="p-1.5 border-r hover:bg-gray-50"
              onClick={() => alert("Critical filter clicked")}
              title="Critical"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </button>
            <button
              className="p-1.5 hover:bg-gray-50"
              onClick={() => alert("Statutory filter clicked")}
              title="Statutory"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Building use filter */}
        <div className="relative">
          <button
            className="inline-flex items-center justify-between border px-3 py-1.5 rounded-md text-sm hover:bg-gray-50 min-w-[140px]"
            onClick={() => setBuildingUseDropdownOpen(!buildingUseDropdownOpen)}
          >
            {buildingUse}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {buildingUseDropdownOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
              <div
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setBuildingUse("Building Use");
                  setBuildingUseDropdownOpen(false);
                }}
              >
                All Building Uses
              </div>
              <div
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setBuildingUse("Residential");
                  setBuildingUseDropdownOpen(false);
                }}
              >
                Residential
              </div>
              <div
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setBuildingUse("Commercial");
                  setBuildingUseDropdownOpen(false);
                }}
              >
                Commercial
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom section: Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="empty:hidden"></div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            className="flex items-center border border-gray-300 px-3 py-1.5 rounded-md text-sm font-medium bg-white hover:bg-gray-50"
            onClick={onColumnsMenuToggle}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            Columns
          </button>

          <button
            className="bg-[#F30] text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center hover:bg-[#E20] transition-colors focus:outline-none focus:ring-2 focus:ring-[#F30] focus:ring-offset-2 flex-1 sm:flex-initial justify-center"
            onClick={onAddTaskClick}
          >
            Add task
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          
          <button
            className="bg-white border border-gray-300 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50"
            onClick={() => alert("CSV export would start here")}
          >
            CSV
          </button>
        </div>
      </div>
    </div>
  );
}