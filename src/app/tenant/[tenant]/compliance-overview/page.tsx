"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/common/components/Header";
import { generateTenantRedirectUrl } from "@/utils/tenant";

// Mock data for buildings and compliance status
const mockBuildings = [
  {
    id: "40003",
    name: "Westcott Park (LEASEHOLD)",
    location: "Acton",
    compliance: "38%",
    pm: "MM",
    annualFlatDoor: { date: "30/04/2024", status: "warning" },
    asbestosReinspections: { date: "", status: "" },
    asbestosSurveys: { date: "20/03/2018", status: "success" },
    fireAlarmTesting: { date: "20/03/2018", status: "success" },
    fireRiskAssessment: { date: "", status: "" },
    hsMonthlyVisit: { date: "", status: "" },
    hsRiskAssessment: { date: "20/03/2018", status: "success" },
    legionellaRisk: { date: "24/07/2019", status: "success" },
  },
  {
    id: "40004",
    name: "Meredith Mews (LEASEHOLD)",
    location: "Brockley",
    compliance: "75%",
    pm: "SW",
    annualFlatDoor: { date: "", status: "" },
    asbestosReinspections: { date: "", status: "" },
    asbestosSurveys: { date: "", status: "" },
    fireAlarmTesting: { date: "", status: "" },
    fireRiskAssessment: { date: "03/07/2022", status: "success" },
    hsMonthlyVisit: { date: "", status: "" },
    hsRiskAssessment: { date: "", status: "" },
    legionellaRisk: { date: "", status: "" },
  },
  {
    id: "40005",
    name: "Lambert Court",
    location: "Bushey",
    compliance: "70%",
    pm: "AM",
    annualFlatDoor: { date: "", status: "" },
    asbestosReinspections: { date: "", status: "" },
    asbestosSurveys: { date: "06/03/2018", status: "success" },
    fireAlarmTesting: { date: "", status: "" },
    fireRiskAssessment: { date: "18/03/2022", status: "success" },
    hsMonthlyVisit: { date: "", status: "" },
    hsRiskAssessment: { date: "02/11/2022", status: "success" },
    legionellaRisk: { date: "26/03/2021", status: "success" },
  },
  {
    id: "40006",
    name: "Hillgate Place (LEASEHOLD)",
    location: "Clapham",
    compliance: "100%",
    pm: "LV",
    annualFlatDoor: { date: "", status: "" },
    asbestosReinspections: { date: "", status: "" },
    asbestosSurveys: { date: "", status: "" },
    fireAlarmTesting: { date: "", status: "" },
    fireRiskAssessment: { date: "04/07/2022", status: "success" },
    hsMonthlyVisit: { date: "", status: "" },
    hsRiskAssessment: { date: "", status: "" },
    legionellaRisk: { date: "", status: "" },
  },
  {
    id: "40007",
    name: "Camfrey Court",
    location: "Crouch End",
    compliance: "76%",
    pm: "AS",
    annualFlatDoor: { date: "28/03/2024", status: "warning" },
    asbestosReinspections: { date: "", status: "" },
    asbestosSurveys: { date: "27/02/2018", status: "success" },
    fireAlarmTesting: { date: "", status: "" },
    fireRiskAssessment: { date: "10/04/2018", status: "success" },
    hsMonthlyVisit: { date: "", status: "" },
    hsRiskAssessment: { date: "26/01/2022", status: "success" },
    legionellaRisk: { date: "27/08/2020", status: "success" },
  },
];

export default function ComplianceOverviewPage() {
  const params = useParams();
  const subdomain = typeof params.tenant === 'string' ? params.tenant : (Array.isArray(params.tenant) ? params.tenant[0] : '');
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    activeOnly: true,
    hampstead: true,
    ealing: true,
    camden: true,
    leased: true,
    archived: false,
    complex: false,
  });

  // Filter buildings based on search
  const filteredBuildings = mockBuildings.filter((building) => {
    if (
      searchTerm &&
      !building.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !building.location.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-3 md:p-6 space-y-6 md:space-y-8 bg-gray-50 min-h-screen">
      {/* Top header with logo and user info */}
      <Header />

      {/* Page title and breadcrumbs */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Compliance Overview
        </h1>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <Link href={generateTenantRedirectUrl(subdomain, "dashboard")} className="hover:text-blue-600">
            <span>Home</span>
          </Link>
          <span className="mx-2">/</span>
          <span>Compliance Overview</span>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="search buildings"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className={`text-sm px-3 py-1.5 rounded-md ${
              activeFilters.activeOnly
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() =>
              setActiveFilters((prev) => ({
                ...prev,
                activeOnly: !prev.activeOnly,
              }))
            }
          >
            Active Divisions
          </button>
          <button
            className={`text-sm px-3 py-1.5 rounded-md ${
              activeFilters.hampstead
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() =>
              setActiveFilters((prev) => ({
                ...prev,
                hampstead: !prev.hampstead,
              }))
            }
          >
            Hampstead
          </button>
          <button
            className={`text-sm px-3 py-1.5 rounded-md ${
              activeFilters.ealing
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() =>
              setActiveFilters((prev) => ({ ...prev, ealing: !prev.ealing }))
            }
          >
            Ealing
          </button>
          <button
            className={`text-sm px-3 py-1.5 rounded-md ${
              activeFilters.camden
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() =>
              setActiveFilters((prev) => ({ ...prev, camden: !prev.camden }))
            }
          >
            Camden
          </button>
          <button
            className={`text-sm px-3 py-1.5 rounded-md ${
              activeFilters.leased
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() =>
              setActiveFilters((prev) => ({ ...prev, leased: !prev.leased }))
            }
          >
            Leased
          </button>
          <button
            className={`text-sm px-3 py-1.5 rounded-md ${
              activeFilters.archived
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() =>
              setActiveFilters((prev) => ({
                ...prev,
                archived: !prev.archived,
              }))
            }
          >
            Archived
          </button>
        </div>

        <div className="flex gap-2 ml-auto">
          <select className="text-sm px-3 py-2 border border-gray-300 rounded-md bg-white appearance-none pr-8 w-36">
            <option>Building Use</option>
            <option>Residential</option>
            <option>Commercial</option>
            <option>Mixed</option>
          </select>

          <select className="text-sm px-3 py-2 border border-gray-300 rounded-md bg-white appearance-none pr-8 w-36">
            <option>Room Use</option>
            <option>Office</option>
            <option>Apartment</option>
            <option>Common Area</option>
          </select>

          <select className="text-sm px-3 py-2 border border-gray-300 rounded-md bg-white appearance-none pr-8 w-40">
            <option>Building Managers</option>
            <option>All Managers</option>
            <option>Active Managers</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-3 text-left font-medium text-gray-700 border-b border-r">
                Building
              </th>
              <th className="py-2 px-3 text-center font-medium text-gray-700 border-b border-r">
                Cpl %
              </th>
              <th className="py-2 px-3 text-center font-medium text-gray-700 border-b border-r">
                PM
              </th>
              <th className="py-2 px-3 text-center font-medium text-gray-700 border-b border-r whitespace-normal">
                <div>Annual Flat</div>
                <div>Door Inspection</div>
              </th>
              <th className="py-2 px-3 text-center font-medium text-gray-700 border-b border-r whitespace-normal">
                Asbestos
                <br />
                Reinspections
              </th>
              <th className="py-2 px-3 text-center font-medium text-gray-700 border-b border-r">
                Asbestos
                <br />
                Surveys
              </th>
              <th className="py-2 px-3 text-center font-medium text-gray-700 border-b border-r">
                Fire Alarm
                <br />
                Testing
              </th>
              <th className="py-2 px-3 text-center font-medium text-gray-700 border-b border-r">
                Fire Risk
                <br />
                Assessment
              </th>
              <th className="py-2 px-3 text-center font-medium text-gray-700 border-b border-r">
                H&S Monthly
                <br />
                Visit Report
              </th>
              <th className="py-2 px-3 text-center font-medium text-gray-700 border-b border-r">
                H&S Risk
                <br />
                Assessment
              </th>
              <th className="py-2 px-3 text-center font-medium text-gray-700 border-b border-r">
                Legionella
                <br />
                Risk Assessment
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBuildings.map((building, index) => (
              <tr
                key={building.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="py-3 px-3 border-b border-r">
                  <div className="font-medium text-blue-600">
                    {building.name}
                  </div>
                  <div className="text-gray-600">{building.location}</div>
                </td>
                <td className="py-3 px-3 text-center border-b border-r">
                  {building.compliance}
                </td>
                <td className="py-3 px-3 text-center border-b border-r">
                  <div className="w-10 h-10 mx-auto bg-blue-200 text-blue-700 rounded-full flex items-center justify-center font-medium">
                    {building.pm}
                  </div>
                </td>
                <td className="py-3 px-3 text-center border-b border-r">
                  {building.annualFlatDoor.date && (
                    <div
                      className={`inline-block px-2 py-1 rounded-md ${
                        building.annualFlatDoor.status === "success"
                          ? "bg-emerald-500 text-white"
                          : building.annualFlatDoor.status === "warning"
                          ? "bg-red-500 text-white"
                          : ""
                      }`}
                    >
                      {building.annualFlatDoor.date}
                    </div>
                  )}
                </td>
                <td className="py-3 px-3 text-center border-b border-r">
                  {building.asbestosReinspections.date && (
                    <div
                      className={`inline-block px-2 py-1 rounded-md ${
                        building.asbestosReinspections.status === "success"
                          ? "bg-emerald-500 text-white"
                          : building.asbestosReinspections.status === "warning"
                          ? "bg-red-500 text-white"
                          : ""
                      }`}
                    >
                      {building.asbestosReinspections.date}
                    </div>
                  )}
                </td>
                <td className="py-3 px-3 text-center border-b border-r">
                  {building.asbestosSurveys.date && (
                    <div
                      className={`inline-block px-2 py-1 rounded-md ${
                        building.asbestosSurveys.status === "success"
                          ? "bg-emerald-500 text-white"
                          : building.asbestosSurveys.status === "warning"
                          ? "bg-red-500 text-white"
                          : ""
                      }`}
                    >
                      {building.asbestosSurveys.date}
                    </div>
                  )}
                </td>
                <td className="py-3 px-3 text-center border-b border-r">
                  {building.fireAlarmTesting.date && (
                    <div
                      className={`inline-block px-2 py-1 rounded-md ${
                        building.fireAlarmTesting.status === "success"
                          ? "bg-emerald-500 text-white"
                          : building.fireAlarmTesting.status === "warning"
                          ? "bg-red-500 text-white"
                          : ""
                      }`}
                    >
                      {building.fireAlarmTesting.date}
                    </div>
                  )}
                </td>
                <td className="py-3 px-3 text-center border-b border-r">
                  {building.fireRiskAssessment.date && (
                    <div
                      className={`inline-block px-2 py-1 rounded-md ${
                        building.fireRiskAssessment.status === "success"
                          ? "bg-emerald-500 text-white"
                          : building.fireRiskAssessment.status === "warning"
                          ? "bg-red-500 text-white"
                          : ""
                      }`}
                    >
                      {building.fireRiskAssessment.date}
                    </div>
                  )}
                </td>
                <td className="py-3 px-3 text-center border-b border-r">
                  {building.hsMonthlyVisit.date && (
                    <div
                      className={`inline-block px-2 py-1 rounded-md ${
                        building.hsMonthlyVisit.status === "success"
                          ? "bg-emerald-500 text-white"
                          : building.hsMonthlyVisit.status === "warning"
                          ? "bg-red-500 text-white"
                          : ""
                      }`}
                    >
                      {building.hsMonthlyVisit.date}
                    </div>
                  )}
                </td>
                <td className="py-3 px-3 text-center border-b border-r">
                  {building.hsRiskAssessment.date && (
                    <div
                      className={`inline-block px-2 py-1 rounded-md ${
                        building.hsRiskAssessment.status === "success"
                          ? "bg-emerald-500 text-white"
                          : building.hsRiskAssessment.status === "warning"
                          ? "bg-red-500 text-white"
                          : ""
                      }`}
                    >
                      {building.hsRiskAssessment.date}
                    </div>
                  )}
                </td>
                <td className="py-3 px-3 text-center border-b border-r">
                  {building.legionellaRisk.date && (
                    <div
                      className={`inline-block px-2 py-1 rounded-md ${
                        building.legionellaRisk.status === "success"
                          ? "bg-emerald-500 text-white"
                          : building.legionellaRisk.status === "warning"
                          ? "bg-red-500 text-white"
                          : ""
                      }`}
                    >
                      {building.legionellaRisk.date}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">961 tasks</div>
        <div className="flex items-center gap-2">
          <button className="p-2 border rounded hover:bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="text-gray-700 font-medium">1</div>
          <button className="p-2 border rounded hover:bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
