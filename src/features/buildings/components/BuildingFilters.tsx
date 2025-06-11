"use client";

import React, { useState } from "react";

interface BuildingFiltersProps {
  buildingUse: string;
  setBuildingUse: (value: string) => void;
  availability: string;
  setAvailability: (value: string) => void;
}

export default function BuildingFilters({
  buildingUse,
  setBuildingUse,
  availability,
  setAvailability,
}: BuildingFiltersProps) {
  const [buildingUseOpen, setBuildingUseOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);

  return (
    <>
      {/* Building Use dropdown */}
      <div className="relative w-full lg:w-48">
        <button
          className="w-full flex items-center justify-between px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          onClick={() => {
            setBuildingUseOpen(!buildingUseOpen);
            setAvailabilityOpen(false);
          }}
        >
          <span
            className={
              buildingUse === "Building Use"
                ? "text-gray-500"
                : "text-gray-900 font-medium"
            }
          >
            {buildingUse}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${buildingUseOpen ? 'rotate-180' : ''}`}
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
            <div className="absolute left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-10 py-1 border border-gray-200">
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
      <div className="relative w-full lg:w-48">
        <button
          className="w-full flex items-center justify-between px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          onClick={() => {
            setAvailabilityOpen(!availabilityOpen);
            setBuildingUseOpen(false);
          }}
        >
          <span
            className={
              availability === "Availability"
                ? "text-gray-500"
                : "text-gray-900 font-medium"
            }
          >
            {availability}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${availabilityOpen ? 'rotate-180' : ''}`}
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
            <div className="absolute left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-10 py-1 border border-gray-200">
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
    </>
  );
}