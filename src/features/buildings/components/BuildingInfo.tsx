"use client";

import React, { useState } from "react";
import { Building } from "@/features/buildings/models";
import { Division } from "@/features/divisions/models";
import EditBuildingModal from "./EditBuildingModal";

interface BuildingInfoProps {
  building: Building;
  divisions?: Division[];
}

export default function BuildingInfo({ building, divisions = [] }: BuildingInfoProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // Building data from database
  const buildingData = {
    generalData: {
      name: building.name,
      description: building.description || "—",
      division: building.division || "—",
      billingAccount: building.billingAccount || "—",
      availability: building.availability || "—",
      openingHours: building.openingHours || "—",
      archived: building.archived ? "Yes" : "No",
      siteAccess: building.siteAccess || "—"
    },
    position: {
      complex: building.complex || "—",
      address: building.address || "—",
      postcode: building.zipCode || "—",
      cityTown: building.city || "—",
      country: building.state || "—"
    },
    maintenanceData: {
      condition: building.condition || "—",
      criticality: building.criticality || "—",
      fireRiskRating: building.fireRiskRating || "—",
      lastCheckDate: building.lastCheckDate ? new Date(building.lastCheckDate).toLocaleDateString() : "—"
    },
    dimensionalData: {
      totalGrossArea: building.totalGrossArea?.toString() || "—",
      totalNetArea: building.totalNetArea?.toString() || "—",
      coveredArea: building.coveredArea?.toString() || "—",
      glazedArea: building.glazedArea?.toString() || "—",
      cleanableArea: building.cleanableArea?.toString() || "—",
      totalVolume: building.totalVolume?.toString() || "—",
      heatedVolume: building.heatedVolume?.toString() || "—",
      numberOfFloors: building.floors?.toString() || "—",
      numberOfRooms: building.numberOfRooms?.toString() || "—",
      numberOfUnits: building.numberOfUnits?.toString() || "—"
    },
    contact: {
      outOfHourContact: building.outOfHourContact || "—",
      telephone: building.telephone || "—"
    },
    statistics: {
      compliancePercent: 100, // TODO: Calculate from tasks when available
      statutoryDocCompliance: "—",
      lowPriorityTasks: "0",
      mediumPriorityTasks: "0",
      highPriorityTasks: "2",
      lowRiskLevelTasks: "0"
    }
  };

  const recentActivities = [
    {
      initials: "EH",
      title: "Fire Risk Assessment - Common Areas",
      details: ["Scheduled Date → 2025-03-28", "Assignee → Wayne Ross - ASAP", "Team → ASAP Comply Ltd"]
    },
    {
      initials: "AD",
      title: "Quarterly Communal Fire Door Inspections",
      details: ["Created this task"]
    },
    {
      initials: "AK",
      title: "Quarterly Communal Fire Door Inspections",
      details: ["Team → ASAP Comply Ltd", "Assignee → Mark Burchall (ASAP)"]
    },
    {
      initials: "LJ",
      title: "Health & Safety Risk Assessment",
      details: ["Created this task"]
    },
    {
      initials: "LJ",
      title: "Health & Safety Risk Assessment",
      details: ["Team → ASAP Comply Ltd"]
    },
    {
      initials: "SJ",
      title: "Quarterly Communal Fire Door Inspections",
      details: ["Created this task"]
    },
    {
      initials: "SJ",
      title: "Quarterly Communal Fire Door Inspections",
      details: ["Team → ASAP Comply Ltd", "Assignee → John Wade - ASAP"]
    },
    {
      initials: "LJ",
      title: "Quarterly Communal Fire Door Inspections",
      details: ["Created this task"]
    },
    {
      initials: "LJ",
      title: "Quarterly Communal Fire Door Inspections",
      details: ["Team → ASAP Comply Ltd", "Assignee → John Wade - ASAP"]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Compliance metrics at the top */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Statutory Doc Compliance</h3>
          <div className="text-3xl font-bold text-gray-800 mb-2">0%</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#F30] h-2 rounded-full" style={{ width: "0%" }}></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Remedial Task Compliance</h3>
          <div className="text-3xl font-bold text-gray-800 mb-2">{buildingData.statistics.compliancePercent}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${buildingData.statistics.compliancePercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* Main content grid with 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left sidebar with section links */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border lg:sticky lg:top-4">
            <h3 className="text-md font-medium p-4 bg-gray-50 border-b">Details</h3>
            <div className="p-2 hidden lg:block">
              <button
                onClick={() => document.getElementById("general-data")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 flex items-center space-x-2 mb-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>General Data</span>
              </button>
              <button
                onClick={() => document.getElementById("position")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 flex items-center space-x-2 mb-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Position</span>
              </button>
              <button
                onClick={() => document.getElementById("maintenance-data")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 flex items-center space-x-2 mb-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Maintenance Data</span>
              </button>
              <button
                onClick={() => document.getElementById("dimensional-data")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 flex items-center space-x-2 mb-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
                <span>Dimensional Data</span>
              </button>
              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 flex items-center space-x-2 mb-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Contact</span>
              </button>
              <button
                onClick={() => document.getElementById("statistics")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 flex items-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Statistics</span>
              </button>
            </div>
          </div>
        </div>

        {/* Middle content area */}
        <div className="lg:col-span-6 order-first lg:order-none">
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
              <h3 className="text-md font-medium">Details</h3>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-3 py-1 bg-[#F30] text-white text-sm font-medium rounded hover:bg-[#E20] transition-colors"
              >
                Edit Building
              </button>
            </div>

            {/* General Data section */}
            <div id="general-data" className="p-4 border-b">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gray-500 text-white text-xs font-medium rounded px-2 py-1">1</div>
                <h4 className="font-medium text-gray-700">General Data</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Name:</div>
                  <div className="font-medium">{buildingData.generalData.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Description:</div>
                  <div className="font-medium">{buildingData.generalData.description}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Division:</div>
                    <div className="font-medium">{buildingData.generalData.division}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Billing Account:</div>
                    <div className="font-medium">{buildingData.generalData.billingAccount}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Availability:</div>
                    <div className="font-medium">{buildingData.generalData.availability}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Opening Hours:</div>
                    <div className="font-medium">{buildingData.generalData.openingHours}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Archived:</div>
                    <div className="font-medium">{buildingData.generalData.archived}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Site Access:</div>
                    <div className="font-medium">{buildingData.generalData.siteAccess}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Position section */}
            <div id="position" className="p-4 border-b">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-700">Position</h4>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Complex:</div>
                    <div className="font-medium">{buildingData.position.complex}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Complex:</div>
                    <div className="font-medium">{buildingData.position.complex}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Address:</div>
                  <div className="font-medium">{buildingData.position.address}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Postcode:</div>
                    <div className="font-medium">{buildingData.position.postcode}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">City / Town:</div>
                    <div className="font-medium">{buildingData.position.cityTown}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Country:</div>
                  <div className="font-medium">{buildingData.position.country}</div>
                </div>
              </div>
            </div>

            {/* Maintenance Data section */}
            <div id="maintenance-data" className="p-4 border-b">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-700">Maintenance Data</h4>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Condition:</div>
                    <div className="font-medium">{buildingData.maintenanceData.condition}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Criticality:</div>
                    <div className="font-medium">{buildingData.maintenanceData.criticality}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Fire Risk Rating:</div>
                    <div className="font-medium">{buildingData.maintenanceData.fireRiskRating}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Last Check Date:</div>
                    <div className="font-medium">{buildingData.maintenanceData.lastCheckDate}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dimensional Data section */}
            <div id="dimensional-data" className="p-4 border-b">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-700">Dimensional Data</h4>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Total Gross Area [sqft]:</div>
                    <div className="font-medium">{buildingData.dimensionalData.totalGrossArea}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total Net Area [sqft]:</div>
                    <div className="font-medium">{buildingData.dimensionalData.totalNetArea}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Covered Area [sqft]:</div>
                    <div className="font-medium">{buildingData.dimensionalData.coveredArea}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Glazed Area [sqft]:</div>
                    <div className="font-medium">{buildingData.dimensionalData.glazedArea}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Cleanable Area [sqft]:</div>
                    <div className="font-medium">{buildingData.dimensionalData.cleanableArea}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total Volume [ft3]:</div>
                    <div className="font-medium">{buildingData.dimensionalData.totalVolume}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Heated Volume [ft3]:</div>
                    <div className="font-medium">{buildingData.dimensionalData.heatedVolume}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Number of Floors:</div>
                    <div className="font-medium">{buildingData.dimensionalData.numberOfFloors}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Number of Rooms:</div>
                    <div className="font-medium">{buildingData.dimensionalData.numberOfRooms}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Number of Units:</div>
                    <div className="font-medium">{buildingData.dimensionalData.numberOfUnits}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact section */}
            <div id="contact" className="p-4 border-b">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-700">Contact</h4>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Out of hour contact number:</div>
                    <div className="font-medium">{buildingData.contact.outOfHourContact}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Telephone:</div>
                    <div className="font-medium">{buildingData.contact.telephone}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics section */}
            <div id="statistics" className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-700">Statistics</h4>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Compliance %:</div>
                    <div className="font-medium">{buildingData.statistics.compliancePercent}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Statutory Document Compliance %:</div>
                    <div className="font-medium">{buildingData.statistics.statutoryDocCompliance}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Number of Low Priority Tasks:</div>
                    <div className="font-medium">{buildingData.statistics.lowPriorityTasks}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Number of Medium Priority tasks:</div>
                    <div className="font-medium">{buildingData.statistics.mediumPriorityTasks}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Number of High Priority Tasks:</div>
                    <div className="font-medium">{buildingData.statistics.highPriorityTasks}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Number of Low Risk Level Tasks:</div>
                    <div className="font-medium">{buildingData.statistics.lowRiskLevelTasks}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Recent Activities */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg border overflow-hidden lg:sticky lg:top-4">
            <h3 className="text-md font-medium p-4 bg-gray-50 border-b">Recent Activities</h3>
            <div className="p-4 space-y-4 lg:max-h-[70vh] overflow-y-auto">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-blue-100 text-blue-800 uppercase rounded-full size-8 flex items-center justify-center font-bold text-xs">
                    {activity.initials}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{activity.title}</div>
                    <div className="text-sm text-gray-500">
                      {activity.details.map((detail, idx) => (
                        <div key={idx}>{detail}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Building Modal */}
      <EditBuildingModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        building={building}
        divisions={divisions}
      />
    </div>
  );
}