"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import React, { useState } from "react";
import Link from "next/link";
import Header from "@/common/components/Header";
import { useParams } from "next/navigation";
import { generateTenantRedirectUrl } from "@/utils/tenant";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const params = useParams();
  const subdomain = typeof params.tenant === 'string' ? params.tenant : (Array.isArray(params.tenant) ? params.tenant[0] : '');
  // Filter state variables
  const [dateRange, setDateRange] = useState("21-04-2024 - 21-04-2025");
  const [selectedTeam, setSelectedTeam] = useState("Team");
  const [selectedTaskType, setSelectedTaskType] = useState("Survey tasks");
  const [selectedBuildingUse, setSelectedBuildingUse] =
    useState("Building Use");
  const [activeActivityTab, setActiveActivityTab] = useState("Task Activity");

  // Sample activities data
  const taskActivities = [
    {
      title: "Monthly H&S Visit (Includes Temp & Lights)",
      location: "40050 Sidcup House",
      status: "Created this task",
    },
    {
      title: "Monthly H&S Visit (Includes Temp & Lights)",
      location: "40050 Sidcup House",
      team: "ASAP Comply Ltd",
      assignee: "Mark Burchall (ASAP)",
    },
    {
      title: "Quarterly Communal Fire Door Inspections",
      location: "40126 Orion House",
      status: "Visited awaiting report",
    },
    {
      title: "Quarterly Communal Fire Door Inspections",
      location: "40008 Stirling Court",
      status: "Put on hold by Marta",
    },
    {
      title: "Quarterly Communal Fire Door Inspections",
      location: "40071 Gloucester Place",
      status: "Removed from scope by Marta",
    },
  ];

  const jobActivities = [
    {
      title: "Fire Risk Assessment",
      location: "40126 Orion House",
      status: "Job assigned to London Fire Division",
    },
    {
      title: "Asbestos Surveys",
      location: "40008 Stirling Court",
      status: "Survey completed, awaiting report",
    },
    {
      title: "Fire Alarm Testing",
      location: "40071 Gloucester Place",
      status: "Job scheduled for next week",
    },
  ];

  const docActivities = [
    {
      title: "Fire Risk Assessment Report",
      location: "40126 Orion House",
      status: "Document uploaded by John Smith",
    },
    {
      title: "Asbestos Survey Report",
      location: "40008 Stirling Court",
      status: "Document pending approval",
    },
    {
      title: "Health & Safety Policy",
      location: "Company-wide",
      status: "Document updated by Admin",
    },
  ];

  // Filter options
  const teamOptions = [
    "Team",
    "ASAP Comply Ltd",
    "Property Fire Protection",
    "UK Fire Protection",
    "All Teams",
  ];
  const taskTypeOptions = [
    "Survey tasks",
    "Fire Risk Assessment",
    "Asbestos Survey",
    "Legionella Risk Assessment",
    "All Tasks",
  ];
  const buildingUseOptions = [
    "Building Use",
    "Residential",
    "Commercial",
    "Mixed Use",
    "All Buildings",
  ];
  const dateRangeOptions = [
    "21-04-2024 - 21-04-2025",
    "Last 30 days",
    "Last 90 days",
    "Last 6 months",
    "Last 12 months",
  ];

  const data = {
    labels: ["Camden", "Hampstead", "Ealing", "Leased"],
    datasets: [
      {
        label: "Completed - 891 tasks",
        data: [312, 355, 217, 7],
        backgroundColor: "#4caf50", // green
        stack: "stack1",
        borderRadius: 4,
      },
      {
        label: "Outstanding (In Progress) - 36 tasks",
        data: [12, 10, 8, 6],
        backgroundColor: "#f44336", // red
        stack: "stack1",
        borderRadius: 4,
      },
      {
        label: "Outstanding (Not Started) - 68 tasks",
        data: [25, 20, 18, 5],
        backgroundColor: "#ff7575", // pinkish
        stack: "stack1",
        borderRadius: 4,
      },
      {
        label: "Outstanding (On Hold) - NaN tasks",
        data: [0, 0, 0, 0],
        backgroundColor: "#9999ff", // purple
        stack: "stack1",
        borderRadius: 4,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const, // This makes the bars horizontal
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          padding: 20,
          font: {
            size: 12,
          },
        },
        display: window.innerWidth > 768, // Only show legend on desktop
      },
      title: {
        display: false,
        text: "Survey Tasks Summary",
        font: {
          size: 16,
          weight: "bold" as const,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        cornerRadius: 6,
        displayColors: true,
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 13,
            weight: "bold" as const,
          },
        },
      },
    },
    barThickness: 30,
    maxBarThickness: 35,
  };

  return (
    <div className="p-3 md:p-6 space-y-6 md:space-y-8 bg-gray-50 min-h-screen">
      {/* Top header with logo and user info */}
      <Header />

      {/* Summary cards */}
      <div className="responsive-grid">
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm">Total Tasks</h3>
          <p className="text-2xl font-bold">995</p>
          <p className="text-xs text-gray-500 mt-1">Across all properties</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm">Completed</h3>
          <p className="text-2xl font-bold">891</p>
          <p className="text-xs text-gray-500 mt-1">89.5% completion rate</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
          <h3 className="text-gray-500 text-sm">Outstanding</h3>
          <p className="text-2xl font-bold">104</p>
          <p className="text-xs text-gray-500 mt-1">Requires attention</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-sm">Properties</h3>
          <p className="text-2xl font-bold">4</p>
          <p className="text-xs text-gray-500 mt-1">Under management</p>
        </div>
      </div>

      {/* Main content container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Column 1 & 2: Chart */}
        <div className="col-span-3 lg:col-span-2 rounded-lg border p-4 md:p-5 bg-white shadow-sm">
          <h2 className="text-xl font-bold mb-4">Survey Tasks Summary</h2>

          {/* Filter row - scrollable on mobile */}
          <div className="flex overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 py-1 md:flex-wrap gap-3 hide-scrollbar mb-4">
            <div className="relative flex-shrink-0">
              <select
                className="appearance-none border rounded-md px-3 py-2 pr-8 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 whitespace-nowrap"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                {dateRangeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            <div className="relative flex-shrink-0">
              <select
                className="appearance-none border rounded-md px-3 py-2 pr-8 bg-white text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 whitespace-nowrap"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
              >
                {teamOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            <div className="relative flex-shrink-0">
              <select
                className="appearance-none border rounded-md px-3 py-2 pr-8 bg-white text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 whitespace-nowrap"
                value={selectedTaskType}
                onChange={(e) => setSelectedTaskType(e.target.value)}
              >
                {taskTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            <div className="relative flex-shrink-0">
              <select
                className="appearance-none border rounded-md px-3 py-2 pr-8 bg-white text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 whitespace-nowrap"
                value={selectedBuildingUse}
                onChange={(e) => setSelectedBuildingUse(e.target.value)}
              >
                {buildingUseOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Chart container with responsive height */}
          <div className="h-[300px] md:h-[400px]">
            <Bar data={data} options={options} />
          </div>
          <div className="text-right text-sm text-gray-600 mt-3 font-medium">
            995 tasks &nbsp; | &nbsp; 1 of 1
          </div>
        </div>

        {/* Column 3: Activities */}
        <div className="col-span-3 lg:col-span-1 rounded-lg border p-4 md:p-5 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-800">Activities</h3>
            <div className="flex items-center">
              <button className="p-1 text-gray-500 hover:text-gray-700 mr-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
              <span className="text-base font-medium px-2">Apr 2025</span>
              <button className="p-1 text-gray-500 hover:text-gray-700 ml-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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

          <div className="border-b pb-4 mb-4">
            <div className="flex overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 py-1 hide-scrollbar">
              <button
                onClick={() => setActiveActivityTab("Task Activity")}
                className={`px-2.5 py-1 text-xs rounded-md mr-1.5 whitespace-nowrap ${
                  activeActivityTab === "Task Activity"
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                Task Activity
              </button>
              <button
                onClick={() => setActiveActivityTab("Job Activity")}
                className={`px-2.5 py-1 text-xs rounded-md mr-1.5 whitespace-nowrap ${
                  activeActivityTab === "Job Activity"
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                Job Activity
              </button>
              <button
                onClick={() => setActiveActivityTab("Doc Activity")}
                className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
                  activeActivityTab === "Doc Activity"
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                Doc Activity
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-blue-600 font-medium flex items-center">
              Newest Activities
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
            </span>
          </div>

          <div className="space-y-4 text-sm max-h-[250px] md:max-h-[350px] overflow-y-auto pr-2">
            {activeActivityTab === "Task Activity" && (
              <>
                {taskActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <strong className="text-blue-600">{activity.title}</strong>{" "}
                    <br />
                    <span className="text-gray-700">
                      {activity.location}
                    </span>{" "}
                    <br />
                    {activity.status && (
                      <span className="italic text-gray-500 text-xs mt-1 block">
                        {activity.status}
                      </span>
                    )}
                    {activity.team && (
                      <span className="flex items-center text-gray-500 text-xs mt-1">
                        <span className="mr-1">Team</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 inline-block mx-1"
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
                        <span className="text-gray-700">{activity.team}</span>
                      </span>
                    )}
                    {activity.assignee && (
                      <span className="flex items-center text-gray-500 text-xs mt-1">
                        <span className="mr-1">Assignee</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 inline-block mx-1"
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
                        <span className="text-gray-700">
                          {activity.assignee}
                        </span>
                      </span>
                    )}
                  </div>
                ))}
              </>
            )}

            {activeActivityTab === "Job Activity" && (
              <>
                {jobActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <strong className="text-blue-600">{activity.title}</strong>{" "}
                    <br />
                    <span className="text-gray-700">
                      {activity.location}
                    </span>{" "}
                    <br />
                    <span className="italic text-gray-500 text-xs mt-1 block">
                      {activity.status}
                    </span>
                  </div>
                ))}
              </>
            )}

            {activeActivityTab === "Doc Activity" && (
              <>
                {docActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <strong className="text-blue-600">{activity.title}</strong>{" "}
                    <br />
                    <span className="text-gray-700">
                      {activity.location}
                    </span>{" "}
                    <br />
                    <span className="italic text-gray-500 text-xs mt-1 block">
                      {activity.status}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="responsive-grid">
        {/* Company Documents */}
        <div className="rounded-lg border p-4 md:p-5 bg-white shadow-sm">
          <h3 className="font-bold text-lg mb-3 text-gray-800 border-b pb-2">
            Company Documents
          </h3>
          <div className="p-4 bg-gray-50 rounded-md text-center">
            <p className="text-sm italic text-gray-500">
              No company documents available
            </p>
            <button className="mt-3 text-blue-600 border border-blue-600 px-4 py-2 rounded-md text-sm hover:bg-blue-50 transition-colors">
              Upload Document
            </button>
          </div>
        </div>

        {/* Legislation */}
        <div className="rounded-lg border p-4 md:p-5 bg-white shadow-sm">
          <h3 className="font-bold text-lg mb-3 text-gray-800 border-b pb-2">
            Legislation
          </h3>
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-blue-600 hover:underline cursor-pointer flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
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
              HSG264 - Asbestos The Survey Guide
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border p-4 md:p-5 bg-white shadow-sm">
          <h3 className="font-bold text-lg mb-3 text-gray-800 border-b pb-2">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium">
              Add New Task
            </button>
            <button className="p-3 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors text-sm font-medium">
              Generate Report
            </button>
            <Link
              href="/buildings"
              className="p-3 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors text-sm font-medium text-center"
            >
              Add Property
            </Link>
            <button className="p-3 bg-orange-50 text-orange-700 rounded-md hover:bg-orange-100 transition-colors text-sm font-medium">
              View Calendar
            </button>
          </div>
        </div>

        {/* Fourth card for balance on mobile */}
        <div className="mobile-only rounded-lg border p-4 bg-white shadow-sm">
          <h3 className="font-bold text-lg mb-3 text-gray-800 border-b pb-2">
            Recent Updates
          </h3>
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              Check back later for recent system updates
            </p>
          </div>
        </div>
      </div>

      {/* "Compliance Overview" Table */}
      <div className="rounded-lg border p-4 md:p-5 bg-white shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">
          Compliance Overview
        </h3>
        <div className="responsive-table-container">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-left font-semibold rounded-tl-md">
                  Building
                </th>
                <th className="p-3 text-left font-semibold">Cpl %</th>
                <th className="p-3 text-left font-semibold">PM</th>
                <th className="p-3 text-left font-semibold">
                  Annual Flat Door Inspection
                </th>
                <th className="p-3 text-left font-semibold">
                  Asbestos Reinspections
                </th>
                <th className="p-3 text-left font-semibold">
                  Asbestos Surveys
                </th>
                <th className="p-3 text-left font-semibold">
                  Fire Alarm Testing
                </th>
                <th className="p-3 text-left font-semibold">
                  Fire Risk Assessment
                </th>
                <th className="p-3 text-left font-semibold">
                  H&S Monthly Visit Report
                </th>
                <th className="p-3 text-left font-semibold">
                  H&S Risk Assessment
                </th>
                <th className="p-3 text-left font-semibold rounded-tr-md">
                  Legionella Risk Assessment
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">
                  <Link
                    href={generateTenantRedirectUrl(subdomain, "buildings/40001")}
                    className="text-blue-600 hover:underline"
                  >
                    40001 Viney Court
                  </Link>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    72%
                  </span>
                </td>
                <td className="p-3">SW</td>
                <td className="p-3 text-green-600">30/04/2024</td>
                <td className="p-3 text-red-600">21/02/2018</td>
                <td className="p-3 text-red-600">14/06/2019</td>
                <td className="p-3 text-green-600">06/09/2024</td>
                <td className="p-3 text-red-600">01/06/2019</td>
                <td className="p-3 text-gray-400">--</td>
                <td className="p-3 text-gray-400">--</td>
                <td className="p-3 text-gray-400">--</td>
              </tr>
              <tr className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">
                  <Link
                    href={generateTenantRedirectUrl(subdomain, "buildings/40002")}
                    className="text-blue-600 hover:underline"
                  >
                    40002 Maple House
                  </Link>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    89%
                  </span>
                </td>
                <td className="p-3">JD</td>
                <td className="p-3 text-green-600">15/05/2024</td>
                <td className="p-3 text-green-600">03/01/2024</td>
                <td className="p-3 text-green-600">22/03/2024</td>
                <td className="p-3 text-green-600">12/08/2024</td>
                <td className="p-3 text-green-600">18/04/2024</td>
                <td className="p-3 text-green-600">01/09/2024</td>
                <td className="p-3 text-gray-400">--</td>
                <td className="p-3 text-green-600">10/02/2024</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 text-sm gap-3">
          <div className="text-gray-500">Showing 2 of 4 properties</div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded-md bg-gray-100">
              Previous
            </button>
            <button className="px-3 py-1 border rounded-md bg-blue-600 text-white">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
