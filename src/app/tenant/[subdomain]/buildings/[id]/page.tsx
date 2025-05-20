"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // Import next/image
import Header from "@/common/components/Header";
import { getBuildingById } from "@/data/buildings";
import { Task, getTasksByBuildingId } from "@/data/tasks";
import TaskDetailsDialog from "@/components/TaskDetailsDialog";

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

  // State for Task Details Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const addNewTask = () => {
    const newTask: Task = {
      id: `${tasks.length + 1}`,
      description: "New Task",
      risk_area: "General",
      priority: "M",
      risk_level: "M",
      due_date: new Date().toLocaleDateString("en-GB"),
      team: "ASAP Comply Ltd",
      building_id: buildingId,
      progress: "Not Started",
      assignee: "",
      notes: [],
      groups: [],
      completed: false,
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

  // --- Dialog Handlers ---
  const handleOpenDialog = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTask(null); // Clear selected task when closing
  };
  // --- End Dialog Handlers ---

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
          <Image
            src={building.image} // Assuming building.image is a valid path or URL
            alt={building.name}
            layout="fill"
            objectFit="cover"
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
                  <tr
                    key={task.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleOpenDialog(task)}
                  >
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
                      {task.risk_area}
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
                          task.risk_level === "H"
                            ? "bg-red-100 text-red-600"
                            : task.risk_level === "M"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {task.risk_level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{task.due_date}</td>
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
                      {task.notes.at(-1) || "—"}
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

      {activeTab === "details" && (
        <div className="space-y-6">
          {/* Compliance metrics at the top */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Statutory Doc Compliance */}
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Statutory Doc Compliance
              </h3>
              <div className="text-3xl font-bold text-gray-800 mb-2">0%</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
            {/* Remedial Task Compliance */}
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Remedial Task Compliance
              </h3>
              <div className="text-3xl font-bold text-gray-800 mb-2">72%</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "72%" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Main content grid with 3 columns on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left sidebar with section links */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border sticky top-4">
                <h3 className="text-md font-medium p-4 bg-gray-50 border-b">
                  Details
                </h3>
                <div className="p-2">
                  <button
                    onClick={() =>
                      document
                        .getElementById("general-data")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 flex items-center space-x-2 mb-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>General Data</span>
                  </button>
                  <button
                    onClick={() =>
                      document
                        .getElementById("position")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 flex items-center space-x-2 mb-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Position</span>
                  </button>
                  <button
                    onClick={() =>
                      document
                        .getElementById("maintenance-data")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 flex items-center space-x-2 mb-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Maintenance Data</span>
                  </button>
                  <button
                    onClick={() =>
                      document
                        .getElementById("dimensional-data")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 flex items-center space-x-2 mb-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                      />
                    </svg>
                    <span>Dimensional Data</span>
                  </button>
                  <button
                    onClick={() =>
                      document
                        .getElementById("contact")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 flex items-center space-x-2 mb-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Contact</span>
                  </button>
                  <button
                    onClick={() =>
                      document
                        .getElementById("statistics")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <span>Statistics</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Middle content area */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-lg border overflow-hidden">
                <h3 className="text-md font-medium p-4 bg-gray-50 border-b">
                  Details
                </h3>

                {/* General Data section */}
                <div id="general-data" className="p-4 border-b">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="bg-gray-500 text-white text-xs font-medium rounded px-2 py-1">
                      1
                    </div>
                    <h4 className="font-medium text-gray-700">General Data</h4>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Ref:</div>
                        <div className="font-medium">40001</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Name:</div>
                        <div className="font-medium">Viney Court</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">Description:</div>
                      <div className="font-medium">40001 Viney Court</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Division:</div>
                        <div className="font-medium">Camden</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          Billing Account:
                        </div>
                        <div className="font-medium">UK Two Ltd</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">
                          Availability:
                        </div>
                        <div className="font-medium">Open - Rented</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          Opening Hours:
                        </div>
                        <div className="font-medium">
                          Communal refurb in April 21
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Archived:</div>
                        <div className="font-medium">—</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          Site Access:
                        </div>
                        <div className="font-medium">
                          Keys are in the safe - Parking outside
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Position section */}
                <div id="position" className="p-4 border-b">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full">
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
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-700">Position</h4>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Complex:</div>
                        <div className="font-medium">—</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Complex:</div>
                        <div className="font-medium">—</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">Address:</div>
                      <div className="font-medium">78 Kings Avenue</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Postcode:</div>
                        <div className="font-medium">SW4 8BH</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          City / Town:
                        </div>
                        <div className="font-medium">Clapham</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">Country:</div>
                      <div className="font-medium">United Kingdom</div>
                    </div>
                  </div>
                </div>

                {/* Maintenance Data section */}
                <div id="maintenance-data" className="p-4 border-b">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full">
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
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-700">
                      Maintenance Data
                    </h4>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Condition:</div>
                        <div className="font-medium">—</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          Criticality:
                        </div>
                        <div className="font-medium">—</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">
                          Fire Risk Rating:
                        </div>
                        <div className="font-medium">—</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          Last Check Date:
                        </div>
                        <div className="font-medium">—</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dimensional Data section */}
                <div id="dimensional-data" className="p-4 border-b">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full">
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
                          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                        />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-700">
                      Dimensional Data
                    </h4>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">
                          Total Gross Area [sqft]:
                        </div>
                        <div className="font-medium">9848</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          Total Net Area [sqft]:
                        </div>
                        <div className="font-medium">—</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">
                          Covered Area [sqft]:
                        </div>
                        <div className="font-medium">—</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          Glazed Area [sqft]:
                        </div>
                        <div className="font-medium">—</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">
                          Cleanable Area [sqft]:
                        </div>
                        <div className="font-medium">—</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          Total Volume [ft3]:
                        </div>
                        <div className="font-medium">—</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">
                          Heated Volume [ft3]:
                        </div>
                        <div className="font-medium">—</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          Number of Floors:
                        </div>
                        <div className="font-medium">—</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">
                          Number of Rooms:
                        </div>
                        <div className="font-medium">—</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          Number of Units:
                        </div>
                        <div className="font-medium">16</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact section */}
                <div id="contact" className="p-4 border-b">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full">
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-700">Contact</h4>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">
                          Out of hour contact number:
                        </div>
                        <div className="font-medium">—</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Telephone:</div>
                        <div className="font-medium">—</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics section */}
                <div id="statistics" className="p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full">
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
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-700">Statistics</h4>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">
                          Compliance %:
                        </div>
                        <div className="font-medium">72</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          Statutory Document Compliance %:
                        </div>
                        <div className="font-medium">—</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">
                          Number of Low Priority Tasks:
                        </div>
                        <div className="font-medium">0</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          Number of Medium Priority tasks:
                        </div>
                        <div className="font-medium">0</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">
                          Number of High Priority Tasks:
                        </div>
                        <div className="font-medium">2</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          Number of Low Risk Level Tasks:
                        </div>
                        <div className="font-medium">0</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Recent Activities */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-lg border overflow-hidden sticky top-4">
                <h3 className="text-md font-medium p-4 bg-gray-50 border-b">
                  Recent Activities
                </h3>
                <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                  {/* Fire Risk Assessment */}
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-800 uppercase rounded-full size-8 flex items-center justify-center font-bold text-xs">
                      EH
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        Fire Risk Assessment - Common Areas
                      </div>
                      <div className="text-sm text-gray-500">
                        <div>Scheduled Date → 2025-03-28</div>
                        <div>Assignee → Wayne Ross - ASAP</div>
                        <div>Team → ASAP Comply Ltd</div>
                      </div>
                    </div>
                  </div>

                  {/* Quarterly Communal Fire Door Inspections */}
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-800 uppercase rounded-full size-8 flex items-center justify-center font-bold text-xs">
                      AD
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        Quarterly Communal Fire Door Inspections
                      </div>
                      <div className="text-sm text-gray-500">
                        Created this task
                      </div>
                    </div>
                  </div>

                  {/* Quarterly Communal Fire Door Inspections with team */}
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-800 uppercase rounded-full size-8 flex items-center justify-center font-bold text-xs">
                      AK
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        Quarterly Communal Fire Door Inspections
                      </div>
                      <div className="text-sm text-gray-500">
                        <div>Team → ASAP Comply Ltd</div>
                        <div>Assignee → Mark Burchall (ASAP)</div>
                      </div>
                    </div>
                  </div>

                  {/* Health & Safety Risk Assessment */}
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-800 uppercase rounded-full size-8 flex items-center justify-center font-bold text-xs">
                      LJ
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        Health & Safety Risk Assessment
                      </div>
                      <div className="text-sm text-gray-500">
                        Created this task
                      </div>
                    </div>
                  </div>

                  {/* Health & Safety Risk Assessment with team */}
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-800 uppercase rounded-full size-8 flex items-center justify-center font-bold text-xs">
                      LJ
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        Health & Safety Risk Assessment
                      </div>
                      <div className="text-sm text-gray-500">
                        <div>Team → ASAP Comply Ltd</div>
                      </div>
                    </div>
                  </div>

                  {/* More Fire Door Inspections */}
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-800 uppercase rounded-full size-8 flex items-center justify-center font-bold text-xs">
                      SJ
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        Quarterly Communal Fire Door Inspections
                      </div>
                      <div className="text-sm text-gray-500">
                        Created this task
                      </div>
                    </div>
                  </div>

                  {/* Fire Door Inspections with John Wade */}
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-800 uppercase rounded-full size-8 flex items-center justify-center font-bold text-xs">
                      SJ
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        Quarterly Communal Fire Door Inspections
                      </div>
                      <div className="text-sm text-gray-500">
                        <div>Team → ASAP Comply Ltd</div>
                        <div>Assignee → John Wade - ASAP</div>
                      </div>
                    </div>
                  </div>

                  {/* Last two Fire Door Inspections */}
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-800 uppercase rounded-full size-8 flex items-center justify-center font-bold text-xs">
                      LJ
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        Quarterly Communal Fire Door Inspections
                      </div>
                      <div className="text-sm text-gray-500">
                        Created this task
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-800 uppercase rounded-full size-8 flex items-center justify-center font-bold text-xs">
                      LJ
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        Quarterly Communal Fire Door Inspections
                      </div>
                      <div className="text-sm text-gray-500">
                        <div>Team → ASAP Comply Ltd</div>
                        <div>Assignee → John Wade - ASAP</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "contacts" && (
        <div className="space-y-4">
          {/* Search and filter toolbar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-2">
            {/* Search bar */}
            <div className="relative w-full md:w-auto md:flex-1 max-w-md">
              <input
                type="text"
                placeholder="search contacts"
                className="border rounded-md pl-3 pr-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            {/* Filter dropdown */}
            <div className="relative w-full md:w-auto">
              <button className="flex items-center space-x-1 border rounded-md px-4 py-2 bg-white hover:bg-gray-50 w-full md:w-auto">
                <span>Filter by company</span>
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Contacts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Contact Card 1 */}
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="p-4 space-y-4">
                {/* Role badge */}
                <div className="inline-block bg-gray-100 text-gray-800 rounded-md px-2 py-1 text-xs font-medium">
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Asset Manager
                  </span>
                </div>

                {/* Person info with avatar */}
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium">Sam Carrodus-Hill</div>
                    <div className="text-sm text-gray-500">
                      Branch Manager - Camden
                    </div>
                  </div>
                </div>

                {/* Contact details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400"
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
                    <span>Akelius</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>sam.hill</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400"
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
                    <span>samuel.carrodus-hill@akelius.co.uk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>020 3846 1782 X1031</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <span>07827 441 105</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card 2 */}
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="p-4 space-y-4">
                {/* Role badge */}
                <div className="inline-block bg-gray-100 text-gray-800 rounded-md px-2 py-1 text-xs font-medium">
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5 mr-1"
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
                    Property Manager
                  </span>
                </div>

                {/* Person info with avatar */}
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium">Sian Williams</div>
                    <div className="text-sm text-gray-500">
                      Property Manager (Camden)
                    </div>
                  </div>
                </div>

                {/* Contact details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400"
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
                    <span>Akelius</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>sian.williams</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400"
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
                    <span>Sian.Williams@akelius.co.uk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>0788 469 4993</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "documents" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left sidebar with filters */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg border overflow-hidden">
                <h3 className="text-lg font-medium p-4 border-b">Documents</h3>

                <div className="p-4 border-b">
                  <h4 className="text-sm text-gray-600 font-medium mb-2">
                    FILTERS:
                  </h4>
                  <div className="space-y-1">
                    <div className="bg-blue-50 text-blue-700 py-1 px-2 font-medium text-sm rounded">
                      All documents
                    </div>

                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700 hover:text-blue-600 cursor-pointer text-sm">
                        Doc Categories
                      </span>
                    </div>

                    <div className="ml-4 space-y-1">
                      <div className="text-gray-700 hover:text-blue-600 cursor-pointer text-sm">
                        Asbestos
                      </div>
                      <div className="text-gray-700 hover:text-blue-600 cursor-pointer text-sm">
                        Electrical
                      </div>
                      <div className="text-gray-700 hover:text-blue-600 cursor-pointer text-sm">
                        Energy
                      </div>
                      <div className="text-gray-700 hover:text-blue-600 cursor-pointer text-sm">
                        Environmental
                      </div>
                      <div className="text-gray-700 hover:text-blue-600 cursor-pointer text-sm">
                        Equality / Disability
                      </div>
                      <div className="text-gray-700 hover:text-blue-600 cursor-pointer text-sm">
                        Fire
                      </div>
                      <div className="text-gray-700 hover:text-blue-600 cursor-pointer text-sm">
                        Gas
                      </div>
                      <div className="text-gray-700 hover:text-blue-600 cursor-pointer text-sm">
                        Health and Safety
                      </div>
                      <div className="text-gray-700 hover:text-blue-600 cursor-pointer text-sm">
                        Legionella
                      </div>
                      <div className="text-gray-700 hover:text-blue-600 cursor-pointer text-sm">
                        Lift
                      </div>
                      <div className="text-gray-700 hover:text-blue-600 cursor-pointer text-sm">
                        Miscellaneous
                      </div>
                      <div className="text-gray-700 hover:text-blue-600 cursor-pointer text-sm">
                        Operation
                      </div>
                      <div className="text-gray-700 hover:text-blue-600 cursor-pointer text-sm">
                        Third Party
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="lg:col-span-9">
              {/* Search and controls */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                <div className="relative w-full md:w-80">
                  <input
                    type="text"
                    placeholder="search documents"
                    className="border rounded-md pl-3 pr-10 py-2 w-full"
                  />
                  <button className="absolute right-0 top-0 h-full px-3 text-gray-500">
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <button className="p-2 border rounded-md">
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
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                  </button>
                  <button className="p-2 border rounded-md">
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                  <button className="bg-teal-600 text-white px-4 py-2 rounded-md font-medium ml-auto">
                    Add document
                  </button>
                </div>
              </div>

              {/* Active/Archived tabs */}
              <div className="flex mb-4">
                <button className="flex items-center gap-2 bg-white rounded-tl-md rounded-tr-md border border-b-0 px-4 py-2 text-sm font-medium">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Active
                  <span className="bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                    15
                  </span>
                </button>
                <button className="flex items-center gap-2 bg-gray-100 rounded-tl-md rounded-tr-md border border-b-0 px-4 py-2 text-sm font-medium text-gray-600 ml-1">
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
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                  Archived
                  <span className="bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                    80
                  </span>
                </button>
              </div>

              {/* Documents table */}
              <div className="bg-white rounded-lg border overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Ref
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Sub Category
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Valid From
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Expiry
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Uploaded Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Document row 1 */}
                    <tr className="border-b hover:bg-gray-50 cursor-pointer">
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          <div className="h-10 w-10 mr-3 border bg-gray-100 flex-shrink-0 overflow-hidden">
                            <Image
                              src="/doc-thumbnail.png"
                              alt=""
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                          <span>Fire Risk Assessment</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">51346G</td>
                      <td className="px-4 py-3 text-sm">Fire</td>
                      <td className="px-4 py-3 text-sm">Risk Assessment</td>
                      <td className="px-4 py-3 text-sm">30/04/2024</td>
                      <td className="px-4 py-3 text-sm">30/04/2025</td>
                      <td className="px-4 py-3 text-sm">
                        <div>13/05/2024 15:46:22</div>
                        <div className="text-gray-500">lauren.johnson</div>
                      </td>
                    </tr>
                    {/* Document row 2 */}
                    <tr className="border-b hover:bg-gray-50 cursor-pointer">
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          <div className="h-10 w-10 mr-3 border bg-gray-100 flex-shrink-0 overflow-hidden">
                            <Image
                              src="/doc-thumbnail.png"
                              alt=""
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                          <span>Fire Risk Assessment</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">51346H</td>
                      <td className="px-4 py-3 text-sm">Fire</td>
                      <td className="px-4 py-3 text-sm">Risk Assessment</td>
                      <td className="px-4 py-3 text-sm">25/03/2025</td>
                      <td className="px-4 py-3 text-sm">25/03/2026</td>
                      <td className="px-4 py-3 text-sm">
                        <div>19/04/2025 22:33:49</div>
                        <div className="text-gray-500">admin</div>
                      </td>
                    </tr>
                    {/* Document row 3 */}
                    <tr className="border-b hover:bg-gray-50 cursor-pointer">
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          <div className="h-10 w-10 mr-3 border bg-gray-100 flex-shrink-0 overflow-hidden">
                            <Image
                              src="/doc-thumbnail.png"
                              alt=""
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                          <span>Fire Strategy Document</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">55041</td>
                      <td className="px-4 py-3 text-sm">Fire</td>
                      <td className="px-4 py-3 text-sm">Survey</td>
                      <td className="px-4 py-3 text-sm">20/10/2022</td>
                      <td className="px-4 py-3 text-sm">—</td>
                      <td className="px-4 py-3 text-sm">
                        <div>10/01/2023 11:46:30</div>
                        <div className="text-gray-500">abi.kelly</div>
                      </td>
                    </tr>
                    {/* Document row 4 */}
                    <tr className="border-b hover:bg-gray-50 cursor-pointer">
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          <div className="h-10 w-10 mr-3 border bg-gray-100 flex-shrink-0 overflow-hidden">
                            <Image
                              src="/doc-thumbnail.png"
                              alt=""
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                          <span>Health & Safety Risk Assessment</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">31215G</td>
                      <td className="px-4 py-3 text-sm">Health and Safety</td>
                      <td className="px-4 py-3 text-sm">Risk Assessment</td>
                      <td className="px-4 py-3 text-sm">13/08/2024</td>
                      <td className="px-4 py-3 text-sm">13/08/2025</td>
                      <td className="px-4 py-3 text-sm">
                        <div>23/08/2024 08:39:48</div>
                        <div className="text-gray-500">lauren.johnson</div>
                      </td>
                    </tr>
                    {/* Document row 5 */}
                    <tr className="border-b hover:bg-gray-50 cursor-pointer">
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          <div className="h-10 w-10 mr-3 border bg-gray-100 flex-shrink-0 overflow-hidden">
                            <Image
                              src="/doc-thumbnail.png"
                              alt=""
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                          <span>Inspection Log/Report</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">—</td>
                      <td className="px-4 py-3 text-sm">Miscellaneous</td>
                      <td className="px-4 py-3 text-sm">Record</td>
                      <td className="px-4 py-3 text-sm">—</td>
                      <td className="px-4 py-3 text-sm">—</td>
                      <td className="px-4 py-3 text-sm">
                        <div>28/11/2018 17:02:03</div>
                        <div className="text-gray-500">reva.bernardez</div>
                      </td>
                    </tr>
                    {/* Document row 6 */}
                    <tr className="border-b hover:bg-gray-50 cursor-pointer">
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          <div className="h-10 w-10 mr-3 border bg-gray-100 flex-shrink-0 overflow-hidden">
                            <Image
                              src="/doc-thumbnail.png"
                              alt=""
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                          <span>Legionella Risk Assessment</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">90310F</td>
                      <td className="px-4 py-3 text-sm">Legionella</td>
                      <td className="px-4 py-3 text-sm">Risk Assessment</td>
                      <td className="px-4 py-3 text-sm">10/02/2025</td>
                      <td className="px-4 py-3 text-sm">10/02/2026</td>
                      <td className="px-4 py-3 text-sm">
                        <div>23/02/2025 23:44:19</div>
                        <div className="text-gray-500">admin</div>
                      </td>
                    </tr>
                    {/* Document row 7 */}
                    <tr className="border-b hover:bg-gray-50 cursor-pointer">
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          <div className="h-10 w-10 mr-3 border bg-gray-100 flex-shrink-0 overflow-hidden">
                            <Image
                              src="/doc-thumbnail.png"
                              alt=""
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                          <span>Photograph</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">—</td>
                      <td className="px-4 py-3 text-sm">Miscellaneous</td>
                      <td className="px-4 py-3 text-sm">Photograph</td>
                      <td className="px-4 py-3 text-sm">28/11/2018</td>
                      <td className="px-4 py-3 text-sm">—</td>
                      <td className="px-4 py-3 text-sm">
                        <div>28/11/2018 16:59:24</div>
                        <div className="text-gray-500">lauren.johnson</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "planner" && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="search tasks"
                className="border rounded-md pl-3 pr-10 py-2 w-full"
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

            <div className="flex gap-3 w-full md:w-auto">
              <button className="px-4 py-2 border rounded-md bg-white hover:bg-gray-50">
                CSV
              </button>
              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-2 border rounded-md bg-white hover:bg-gray-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-teal-600"
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
                  <span>2025</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Year planner table with scrollable area */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-max w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">
                      #
                    </th>
                    <th className="sticky left-12 z-10 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700 border-r min-w-[200px]">
                      Task
                    </th>
                    <th className="sticky left-[calc(200px+48px)] z-10 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700 border-r w-[80px]">
                      Freq
                    </th>
                    <th className="sticky left-[calc(280px+48px)] z-10 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700 border-r min-w-[150px]">
                      Team
                    </th>
                    <th className="sticky left-[calc(430px+48px)] z-10 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700 border-r min-w-[150px]">
                      Assignee
                    </th>
                    <th className="sticky left-[calc(580px+48px)] z-10 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700 border-r min-w-[120px]">
                      Sched Date
                    </th>

                    {/* December */}
                    <th
                      className="px-1 py-2 text-center text-sm font-medium text-gray-700 border-r border-b"
                      colSpan={1}
                    >
                      <div>Dec</div>
                    </th>

                    {/* January */}
                    <th
                      className="px-1 py-2 text-center text-sm font-medium text-gray-700 border-r border-b"
                      colSpan={4}
                    >
                      <div>Jan</div>
                    </th>

                    {/* February */}
                    <th
                      className="px-1 py-2 text-center text-sm font-medium text-gray-700 border-r border-b"
                      colSpan={4}
                    >
                      <div>Feb</div>
                    </th>

                    {/* March */}
                    <th
                      className="px-1 py-2 text-center text-sm font-medium text-gray-700 border-r border-b"
                      colSpan={4}
                    >
                      <div>Mar</div>
                    </th>

                    {/* April */}
                    <th
                      className="px-1 py-2 text-center text-sm font-medium text-gray-700 border-r border-b"
                      colSpan={4}
                    >
                      <div>Apr</div>
                    </th>

                    {/* May */}
                    <th
                      className="px-1 py-2 text-center text-sm font-medium text-gray-700 border-b"
                      colSpan={4}
                    >
                      <div>May</div>
                    </th>
                  </tr>

                  <tr className="bg-gray-50 border-b">
                    <th className="sticky left-0 z-10 bg-gray-50 px-4 py-2 text-left text-sm font-medium text-gray-700 border-r"></th>
                    <th className="sticky left-12 z-10 bg-gray-50 px-4 py-2 text-left text-sm font-medium text-gray-700 border-r"></th>
                    <th className="sticky left-[calc(200px+48px)] z-10 bg-gray-50 px-4 py-2 text-left text-sm font-medium text-gray-700 border-r"></th>
                    <th className="sticky left-[calc(280px+48px)] z-10 bg-gray-50 px-4 py-2 text-left text-sm font-medium text-gray-700 border-r"></th>
                    <th className="sticky left-[calc(430px+48px)] z-10 bg-gray-50 px-4 py-2 text-left text-sm font-medium text-gray-700 border-r"></th>
                    <th className="sticky left-[calc(580px+48px)] z-10 bg-gray-50 px-4 py-2 text-left text-sm font-medium text-gray-700 border-r"></th>

                    {/* Dates for December */}
                    <th className="px-1 py-2 text-center text-xs font-medium text-gray-700 border-r w-[40px]">
                      29
                    </th>

                    {/* Dates for January */}
                    <th className="px-1 py-2 text-center text-xs font-medium text-gray-700 border-r w-[40px]">
                      05
                    </th>
                    <th className="px-1 py-2 text-center text-xs font-medium text-gray-700 border-r w-[40px]">
                      12
                    </th>
                    <th className="px-1 py-2 text-center text-xs font-medium text-gray-700 border-r w-[40px]">
                      19
                    </th>
                    <th className="px-1 py-2 text-center text-xs font-medium text-gray-700 border-r w-[40px]">
                      26
                    </th>

                    {/* Dates for February */}
                    <th className="px-1 py-2 text-center text-xs font-medium text-gray-700 border-r w-[40px]">
                      02
                    </th>
                    <th className="px-1 py-2 text-center text-xs font-medium text-gray-700 border-r w-[40px]">
                      09
                    </th>
                    <th className="px-1 py-2 text-center text-xs font-medium text-gray-700 border-r w-[40px]">
                      16
                    </th>
                    <th className="px-1 py-2 text-center text-xs font-medium text-gray-700 border-r w-[40px]">
                      23
                    </th>

                    {/* Dates for March */}
                    <th className="px-1 py-2 text-center text-xs font-medium text-gray-700 border-r w-[40px]">
                      02
                    </th>
                    <th className="px-1 py-2 text-center text-xs font-medium text-gray-700 border-r w-[40px]">
                      09
                    </th>
                    <th className="px-1 py-2 text-center text-xs font-medium text-gray-700 border-r w-[40px]">
                      16
                    </th>
                    <th className="px-1 py-2 text-center text-xs font-medium text-gray-700 border-r w-[40px]">
                      23
                    </th>

                    {/* Dates for April */}
                    <th className="px-1 py-2 text-center text-xs font-medium text-gray-700 border-r w-[40px]">
                      30
                    </th>
                    <th className="px-1 py-2 text-center text-xs font-medium text-gray-700 border-r w-[40px]">
                      06
                    </th>
                    <th className="px-1 py-2 text-center text-xs font-medium text-gray-700 border-r w-[40px]">
                      13
                    </th>
                    <th className="px-1 py-2 text-center text-xs font-medium text-gray-700 border-r w-[40px]">
                      20
                    </th>

                    {/* Dates for May */}
                    <th className="px-1 py-2 text-center text-xs font-medium text-gray-700 border-r w-[40px]">
                      27
                    </th>
                    <th className="px-1 py-2 text-center text-xs font-medium text-gray-700 border-r w-[40px]">
                      04
                    </th>
                    <th className="px-1 py-2 text-center text-xs font-medium text-gray-700 border-r w-[40px]">
                      11
                    </th>
                    <th className="px-1 py-2 text-center text-xs font-medium text-gray-700 w-[40px]">
                      18
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-b">
                    <td className="sticky left-0 z-10 bg-white px-4 py-3 text-sm border-r">
                      1
                    </td>
                    <td className="sticky left-12 z-10 bg-white px-4 py-3 text-sm border-r">
                      Fire Alarm Testing
                    </td>
                    <td className="sticky left-[calc(200px+48px)] z-10 bg-white px-4 py-3 text-sm border-r">
                      Monthly
                    </td>
                    <td className="sticky left-[calc(280px+48px)] z-10 bg-white px-4 py-3 text-sm border-r">
                      ASAP Comply Ltd
                    </td>
                    <td className="sticky left-[calc(430px+48px)] z-10 bg-white px-4 py-3 text-sm border-r">
                      Mark Burchall
                    </td>
                    <td className="sticky left-[calc(580px+48px)] z-10 bg-white px-4 py-3 text-sm border-r">
                      15/01/2025
                    </td>

                    {/* Calendar cells - Dec to May */}
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r bg-blue-100"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center"></td>
                  </tr>

                  <tr className="border-b">
                    <td className="sticky left-0 z-10 bg-white px-4 py-3 text-sm border-r">
                      2
                    </td>
                    <td className="sticky left-12 z-10 bg-white px-4 py-3 text-sm border-r">
                      Quarterly Fire Door Inspection
                    </td>
                    <td className="sticky left-[calc(200px+48px)] z-10 bg-white px-4 py-3 text-sm border-r">
                      Quarterly
                    </td>
                    <td className="sticky left-[calc(280px+48px)] z-10 bg-white px-4 py-3 text-sm border-r">
                      ASAP Comply Ltd
                    </td>
                    <td className="sticky left-[calc(430px+48px)] z-10 bg-white px-4 py-3 text-sm border-r">
                      John Wade
                    </td>
                    <td className="sticky left-[calc(580px+48px)] z-10 bg-white px-4 py-3 text-sm border-r">
                      28/02/2025
                    </td>

                    {/* Calendar cells - Dec to May */}
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r bg-blue-100"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center"></td>
                  </tr>

                  <tr className="border-b">
                    <td className="sticky left-0 z-10 bg-white px-4 py-3 text-sm border-r">
                      3
                    </td>
                    <td className="sticky left-12 z-10 bg-white px-4 py-3 text-sm border-r">
                      Annual Fire Risk Assessment
                    </td>
                    <td className="sticky left-[calc(200px+48px)] z-10 bg-white px-4 py-3 text-sm border-r">
                      Annual
                    </td>
                    <td className="sticky left-[calc(280px+48px)] z-10 bg-white px-4 py-3 text-sm border-r">
                      ASAP Comply Ltd
                    </td>
                    <td className="sticky left-[calc(430px+48px)] z-10 bg-white px-4 py-3 text-sm border-r">
                      Wayne Ross
                    </td>
                    <td className="sticky left-[calc(580px+48px)] z-10 bg-white px-4 py-3 text-sm border-r">
                      28/04/2025
                    </td>

                    {/* Calendar cells - Dec to May */}
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r bg-blue-100"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center border-r"></td>
                    <td className="px-0 py-3 text-center"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer - Task count */}
            <div className="py-3 px-4 border-t text-right text-sm text-gray-700">
              <strong>NO. OF TASKS: 0</strong>
            </div>
          </div>
        </div>
      )}

      {activeTab !== "tasks" &&
        activeTab !== "details" &&
        activeTab !== "contacts" &&
        activeTab !== "documents" &&
        activeTab !== "planner" && (
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
              Please select the &quot;Details&quot;, &quot;Contacts&quot; or
              &quot;Tasks&quot; tab to view the implementation
            </p>
          </div>
        )}

      {/* Task Details Dialog */}
      {selectedTask && (
        <TaskDetailsDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          task={selectedTask}
          building={building}
        />
      )}
    </div>
  );
}
