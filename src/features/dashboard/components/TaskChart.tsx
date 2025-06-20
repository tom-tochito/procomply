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
  ChartData,
  ChartOptions,
} from "chart.js";
import { useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TaskChartProps {
  data: ChartData<"bar">;
  options: ChartOptions<"bar">;
}

export default function TaskChart({ data, options }: TaskChartProps) {
  const [dateRange, setDateRange] = useState("21-04-2024 - 21-04-2025");
  const [selectedTeam, setSelectedTeam] = useState("Team");
  const [selectedTaskType, setSelectedTaskType] = useState("Survey tasks");
  const [selectedBuildingUse, setSelectedBuildingUse] = useState("Building Use");

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

  return (
    <div className="col-span-3 lg:col-span-2 rounded-lg border p-4 md:p-5 bg-white shadow-sm">
      <h2 className="text-xl font-bold mb-4">Survey Tasks Summary</h2>

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

      <div className="h-[300px] md:h-[400px]">
        <Bar data={data} options={options} />
      </div>
      <div className="text-right text-sm text-gray-600 mt-3 font-medium">
        995 tasks &nbsp; | &nbsp; 1 of 1
      </div>
    </div>
  );
}