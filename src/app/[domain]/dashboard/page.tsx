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
import React from "react";
import Link from "next/link";
import Header from "@/common/components/Header";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const data = {
    labels: ["Camden", "Hampstead", "Ealing", "Leased"],
    datasets: [
      {
        label: "Completed - 812 tasks",
        data: [292, 355, 340, 7],
        backgroundColor: "#4caf50", // green
        stack: "stack1",
        borderRadius: 4,
      },
      {
        label: "Outstanding (In Progress) - 103 tasks",
        data: [30, 25, 35, 13],
        backgroundColor: "#f44336", // red
        stack: "stack1",
        borderRadius: 4,
      },
      {
        label: "Outstanding (Not Started) - 79 tasks",
        data: [10, 15, 20, 5],
        backgroundColor: "#ff7575", // pinkish
        stack: "stack1",
        borderRadius: 4,
      },
      {
        label: "Outstanding (On Hold) - 17 tasks",
        data: [5, 8, 4, 0],
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
      },
      title: {
        display: true,
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
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Top header with logo and user info */}
      <Header />

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm">Total Tasks</h3>
          <p className="text-2xl font-bold">994</p>
          <p className="text-xs text-gray-500 mt-1">Across all properties</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm">Completed</h3>
          <p className="text-2xl font-bold">812</p>
          <p className="text-xs text-gray-500 mt-1">81.7% completion rate</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
          <h3 className="text-gray-500 text-sm">Outstanding</h3>
          <p className="text-2xl font-bold">182</p>
          <p className="text-xs text-gray-500 mt-1">Requires attention</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-sm">Properties</h3>
          <p className="text-2xl font-bold">4</p>
          <p className="text-xs text-gray-500 mt-1">Under management</p>
        </div>
      </div>

      {/* Main content container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 & 2: Chart */}
        <div className="col-span-2 rounded-lg border p-5 bg-white shadow-sm">
          <div className="h-[400px]">
            <Bar data={data} options={options} />
          </div>
          <div className="text-right text-sm text-gray-600 mt-3 font-medium">
            994 tasks &nbsp; | &nbsp; 1 of 1
          </div>
        </div>

        {/* Column 3: Activities */}
        <div className="rounded-lg border p-5 bg-white shadow-sm">
          <h3 className="font-bold mb-4 text-lg text-gray-800 border-b pb-2">
            Recent Activities
          </h3>
          <div className="space-y-4 text-sm max-h-[350px] overflow-y-auto pr-2">
            <div className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
              <strong className="text-blue-600">Monthly PPM Visit</strong>{" "}
              <br />
              <span className="text-gray-700">40056 Delta Court</span> <br />
              <span className="italic text-gray-500 text-xs mt-1 block">
                Removed from scope as not deemed as a tall building
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
              <strong className="text-blue-600">
                Quarterly Communal Fire Door Inspections
              </strong>{" "}
              <br />
              <span className="text-gray-700">40126 Orion House</span> <br />
              <span className="italic text-gray-500 text-xs mt-1 block">
                Visited awaiting report
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
              <strong className="text-blue-600">
                Quarterly Communal Fire Door Inspections
              </strong>{" "}
              <br />
              <span className="text-gray-700">40008 Stirling Court</span> <br />
              <span className="italic text-gray-500 text-xs mt-1 block">
                Put on hold by Marta
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
              <strong className="text-blue-600">
                Quarterly Communal Fire Door Inspections
              </strong>{" "}
              <br />
              <span className="text-gray-700">40071 Gloucester Place</span>{" "}
              <br />
              <span className="italic text-gray-500 text-xs mt-1 block">
                Removed from scope by Marta
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
              <strong className="text-blue-600">
                Monthly H&S Visit (Includes Temp &amp; Lights)
              </strong>{" "}
              <br />
              <span className="text-gray-700">40093 Cedar Road</span> <br />
              <span className="italic text-gray-500 text-xs mt-1 block">
                Scheduled Date → 2025-01-21
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Documents */}
        <div className="rounded-lg border p-5 bg-white shadow-sm">
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
        <div className="rounded-lg border p-5 bg-white shadow-sm">
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
        <div className="rounded-lg border p-5 bg-white shadow-sm">
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
      </div>

      {/* "Compliance Overview" Table */}
      <div className="rounded-lg border p-5 bg-white shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">
          Compliance Overview
        </h3>
        <div className="overflow-auto">
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
                    href="/buildings/40001"
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
                    href="/buildings/40002"
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
        <div className="flex justify-between items-center mt-4 text-sm">
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
