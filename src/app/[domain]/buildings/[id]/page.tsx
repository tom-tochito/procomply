"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/common/components/Header";
import { getBuildingById } from "@/data/buildings";
import { Task, getTasksByBuildingId } from "@/data/tasks";

export default function BuildingDetailsPage() {
  const params = useParams();
  const buildingId = params.id as string;
  const building = getBuildingById(buildingId);
  const initialTasks = getTasksByBuildingId(buildingId);

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTab, setActiveTab] = useState("details");
  const [filterByTeam, setFilterByTeam] = useState("");
  const [filterByAssignee, setFilterByAssignee] = useState("");
  const [taskSearchTerm, setTaskSearchTerm] = useState("");

  // Task filtering states
  const [inProgressFilter, setInProgressFilter] = useState(true);
  const [inboxFilter, setInboxFilter] = useState(true);
  const [futureFilter, setFutureFilter] = useState(true);
  const [completedFilter, setCompletedFilter] = useState(true);
  const [onHoldFilter, setOnHoldFilter] = useState(true);

  const addNewTask = () => {
    const newTask: Task = {
      id: `${tasks.length + 1}`,
      description: "New Task",
      riskArea: "General",
      priority: "M",
      riskLevel: "M",
      dueDate: new Date().toLocaleDateString("en-GB"),
      team: "ASAP Comply Ltd",
      buildingId: buildingId,
      progress: "Not Started",
    };

    setTasks([...tasks, newTask]);
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    // Search term filter
    if (
      taskSearchTerm &&
      !task.description.toLowerCase().includes(taskSearchTerm.toLowerCase())
    ) {
      return false;
    }

    // Team filter
    if (filterByTeam && task.team !== filterByTeam) {
      return false;
    }

    // Assignee filter
    if (filterByAssignee && task.assignee !== filterByAssignee) {
      return false;
    }

    // Status filters
    if (task.completed && !completedFilter) return false;
    if (task.progress === "In Progress" && !inProgressFilter) return false;

    return true;
  });

  if (!building) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Building Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The building with ID {buildingId} could not be found.
          </p>
          <Link
            href="/buildings"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Buildings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6 space-y-6 md:space-y-8 bg-gray-50 min-h-screen">
      {/* Top header with logo and user info */}
      <Header />
      {/* Building header with image */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Building image */}
        <div className="relative h-48 w-full md:w-64 rounded-lg overflow-hidden md:flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent z-10" />
          <img
            src={building.image}
            alt={building.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-between py-2 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              {building.id} - {building.name}
            </h1>
            <div className="flex flex-wrap items-center text-sm text-gray-600 mt-1">
              <Link href="/dashboard" className="hover:text-blue-600">
                <span>Home</span>
              </Link>
              <span className="mx-2">/</span>
              <Link href="/buildings" className="hover:text-blue-600">
                <span>Buildings</span>
              </Link>
              <span className="mx-2">/</span>
              <span>{building.division}</span>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600">Rem. compliance:</div>
            <div className="text-xl font-bold text-blue-600">
              {building.compliance}%
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto -mx-3 px-3">
        <div className="flex border-b space-x-2 md:space-x-4 min-w-max pb-1">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "details"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("details")}
          >
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
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
              Details
            </span>
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "contacts"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("contacts")}
          >
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Contacts
            </span>
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "map"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("map")}
          >
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              Map
            </span>
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "gallery"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("gallery")}
          >
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Gallery
            </span>
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "documents"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("documents")}
          >
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                />
              </svg>
              Documents
            </span>
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "tasks"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("tasks")}
          >
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Tasks
            </span>
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "planner"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("planner")}
          >
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Year Planner
            </span>
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === "tasks" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <h2 className="text-xl font-bold text-gray-800">Tasks</h2>
            <div className="flex w-full sm:w-auto space-x-2">
              <button
                onClick={addNewTask}
                className="flex-1 sm:flex-initial px-3 md:px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add task
              </button>
              <button className="flex-1 sm:flex-initial px-3 md:px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                CSV
              </button>
            </div>
          </div>

          {/* Search and filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="search tasks"
                className="border rounded-md pl-3 pr-10 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={taskSearchTerm}
                onChange={(e) => setTaskSearchTerm(e.target.value)}
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

            <div className="relative flex-1 min-w-[10rem] sm:min-w-0 sm:w-auto">
              <select
                className="appearance-none border rounded-md px-3 py-2 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={filterByTeam}
                onChange={(e) => setFilterByTeam(e.target.value)}
              >
                <option value="">Filter by team</option>
                <option>ASAP Comply Ltd</option>
                <option>Internal Team</option>
                <option>Contractors</option>
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

            <div className="relative flex-1 min-w-[10rem] sm:min-w-0 sm:w-auto">
              <select
                className="appearance-none border rounded-md px-3 py-2 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={filterByAssignee}
                onChange={(e) => setFilterByAssignee(e.target.value)}
              >
                <option value="">Filter by assignee</option>
                <option>Mark Burchall (ASAP)</option>
                <option>John Smith</option>
                <option>Jane Doe</option>
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

          {/* Status filters */}
          <div className="overflow-x-auto -mx-3 px-3">
            <div className="flex space-x-2 md:space-x-4 min-w-max pb-1">
              <button
                className={`px-2 md:px-4 py-2 rounded-md ${
                  inProgressFilter
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => setInProgressFilter(!inProgressFilter)}
              >
                <span className="inline-flex items-center">
                  <span className="size-2 bg-blue-500 rounded-full mr-1 md:mr-2"></span>
                  <span className="md:block">In Progress</span>
                  <span className="ml-1 text-xs bg-gray-200 px-1.5 rounded-full">
                    2
                  </span>
                </span>
              </button>
              <button
                className={`px-2 md:px-4 py-2 rounded-md ${
                  inboxFilter
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => setInboxFilter(!inboxFilter)}
              >
                <span className="inline-flex items-center">
                  <span className="size-2 bg-red-500 rounded-full mr-1 md:mr-2"></span>
                  <span className="md:block">Inbox</span>
                  <span className="ml-1 text-xs bg-gray-200 px-1.5 rounded-full">
                    1
                  </span>
                </span>
              </button>
              <button
                className={`px-2 md:px-4 py-2 rounded-md ${
                  futureFilter
                    ? "bg-gray-100 text-gray-600"
                    : "bg-gray-100 text-gray-400"
                }`}
                onClick={() => setFutureFilter(!futureFilter)}
              >
                <span className="inline-flex items-center">
                  <span className="size-2 bg-gray-500 rounded-full mr-1 md:mr-2"></span>
                  <span className="md:block">Future</span>
                  <span className="ml-1 text-xs bg-gray-200 px-1.5 rounded-full">
                    3
                  </span>
                </span>
              </button>
              <button
                className={`px-2 md:px-4 py-2 rounded-md ${
                  completedFilter
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => setCompletedFilter(!completedFilter)}
              >
                <span className="inline-flex items-center">
                  <span className="size-2 bg-green-500 rounded-full mr-1 md:mr-2"></span>
                  <span className="md:block">Completed</span>
                  <span className="ml-1 text-xs bg-gray-200 px-1.5 rounded-full">
                    102
                  </span>
                </span>
              </button>
              <button
                className={`px-2 md:px-4 py-2 rounded-md ${
                  onHoldFilter
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => setOnHoldFilter(!onHoldFilter)}
              >
                <span className="inline-flex items-center">
                  <span className="size-2 bg-purple-500 rounded-full mr-1 md:mr-2"></span>
                  <span className="md:block">On Hold</span>
                  <span className="ml-1 text-xs bg-gray-200 px-1.5 rounded-full">
                    0
                  </span>
                </span>
              </button>
            </div>
          </div>

          {/* Tasks table */}
          <div className="bg-white rounded-lg border overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Description
                  </th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Risk Area
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    PR
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    RL
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Due Date
                  </th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Team
                  </th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Assignee
                  </th>
                  <th className="hidden sm:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Progress
                  </th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Latest Note
                  </th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Groups
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center space-x-1">
                        {task.completed ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-500"
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
                            className="h-5 w-5 text-gray-300"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        <span>{task.description}</span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 text-sm">
                      {task.riskArea}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center justify-center size-6 rounded-full ${
                          task.priority === "H"
                            ? "bg-red-100 text-red-600"
                            : task.priority === "M"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center justify-center size-6 rounded-full ${
                          task.riskLevel === "H"
                            ? "bg-red-100 text-red-600"
                            : task.riskLevel === "M"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {task.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{task.dueDate}</td>
                    <td className="hidden md:table-cell px-4 py-3 text-sm">
                      {task.team}
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 text-sm">
                      {task.assignee || "—"}
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3 text-sm">
                      {task.progress || "—"}
                    </td>
                    <td className="hidden lg:table-cell px-4 py-3 text-sm">
                      {task.latestNote || "—"}
                    </td>
                    <td className="hidden lg:table-cell px-4 py-3 text-sm">
                      {task.groups?.join(", ") || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab !== "tasks" && (
        <div className="p-10 text-center bg-white rounded-lg border">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-300 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M8 9l4-4 4 4m0 6l-4 4-4-4"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-500">
            Tab content for &quot;{activeTab}&quot; is not implemented yet
          </h3>
          <p className="text-gray-400 mt-2">
            Please select the &quot;Tasks&quot; tab to view the implementation
          </p>
        </div>
      )}
    </div>
  );
}
