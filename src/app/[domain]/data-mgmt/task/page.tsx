"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/common/components/Header";
import { tasks } from "@/data/tasks";
import { useParams, useRouter } from "next/navigation";
import TaskDetailsDialog from "@/components/TaskDetailsDialog";
import LabelModal from "@/components/LabelModal";
import TaskModal from "@/components/TaskModal";
import TaskTemplateModal from "@/components/TaskTemplateModal";

export default function TaskPage() {
  const params = useParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedDivision, setSelectedDivision] = useState("Active Divisions");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [buildingUse, setBuildingUse] = useState("Building Use");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [teamsDropdownOpen, setTeamsDropdownOpen] = useState(false);
  const [assigneeDropdownOpen, setAssigneeDropdownOpen] = useState(false);
  const [buildingUseDropdownOpen, setBuildingUseDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Label modal state
  const [labelModalOpen, setLabelModalOpen] = useState(false);
  const [labels, setLabels] = useState([
    { name: "Urgent", color: "#ED1C24" },
    { name: "Important", color: "#F7941D" },
    { name: "Statutory", color: "#39B54A" },
  ]);

  // Task modal state
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskTemplateModalOpen, setTaskTemplateModalOpen] = useState(false);
  const [addTaskDropdownOpen, setAddTaskDropdownOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Reference for the dropdown
  const addTaskButtonRef = React.useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        addTaskButtonRef.current &&
        !addTaskButtonRef.current.contains(event.target)
      ) {
        setAddTaskDropdownOpen(false);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add this new state for responsive table
  const [visibleColumns, setVisibleColumns] = useState({
    description: true,
    riskArea: true,
    priority: true,
    riskLevel: true,
    dueDate: true,
    team: true,
    assignee: true,
    progress: true,
    latestNote: !isMobile, // Hide on mobile by default
    groups: !isMobile, // Hide on mobile by default
    actions: true,
  });

  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Add responsive column handling
  useEffect(() => {
    const handleResponsiveColumns = () => {
      if (window.innerWidth < 640) {
        // sm breakpoint
        setVisibleColumns({
          description: true,
          riskArea: false,
          priority: true,
          riskLevel: false,
          dueDate: true,
          team: false,
          assignee: false,
          progress: true,
          latestNote: false,
          groups: false,
          actions: true,
        });
      } else if (window.innerWidth < 1024) {
        // lg breakpoint
        setVisibleColumns({
          description: true,
          riskArea: true,
          priority: true,
          riskLevel: true,
          dueDate: true,
          team: true,
          assignee: false,
          progress: true,
          latestNote: false,
          groups: false,
          actions: true,
        });
      } else {
        setVisibleColumns({
          description: true,
          riskArea: true,
          priority: true,
          riskLevel: true,
          dueDate: true,
          team: true,
          assignee: true,
          progress: true,
          latestNote: true,
          groups: true,
          actions: true,
        });
      }
    };

    handleResponsiveColumns();
    window.addEventListener("resize", handleResponsiveColumns);
    return () => window.removeEventListener("resize", handleResponsiveColumns);
  }, []);

  const toggleColumnVisibility = (column) => {
    setVisibleColumns({
      ...visibleColumns,
      [column]: !visibleColumns[column],
    });
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    // Search filter
    if (
      searchTerm &&
      !task.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !task.id.includes(searchTerm)
    ) {
      return false;
    }

    // Filter by selected division
    if (selectedDivision !== "Active Divisions") {
      // This is a mock example. In real app, you'd filter by the actual division property
      return true; // For demonstration
    }

    // Filter by team if selected
    if (selectedTeam && task.team !== selectedTeam) {
      return false;
    }

    // Filter by assignee if selected
    if (selectedAssignee && task.assignee !== selectedAssignee) {
      return false;
    }

    // Filter by active tab
    if (
      activeTab === "survey" &&
      !task.description.toLowerCase().includes("survey")
    ) {
      return false;
    }

    return true;
  });

  // Function to render priority and risk level badges
  const renderBadge = (level) => {
    const bgColor =
      level === "H"
        ? "bg-red-500"
        : level === "M"
        ? "bg-yellow-500"
        : "bg-blue-500";
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full ${bgColor} text-white w-6 h-6 text-xs font-medium`}
      >
        {level}
      </span>
    );
  };

  // Function to render date badges
  const renderDateBadge = (date) => {
    return (
      <span className="inline-block rounded-md bg-red-100 text-red-800 px-2 py-1 text-xs font-medium">
        {date}
      </span>
    );
  };

  // Toggle a task as complete/incomplete (mock functionality)
  const toggleTaskComplete = (taskId) => {
    // In a real app, this would update the task status in your data store
    console.log(`Toggling completion status of task ${taskId}`);
  };

  // Teams for dropdown
  const availableTeams = [
    "ASAP Comply Ltd",
    "Property Fire Protection",
    "UK Fire Protection",
    "All Teams",
  ];

  // Handle task click to open task details dialog
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  // Handle saving a new label
  const handleSaveLabel = (labelData) => {
    setLabels([...labels, labelData]);
  };

  // Handle saving a new task
  const handleSaveTask = (taskData) => {
    console.log("New task created:", taskData);
    // Here you would typically send the data to your API
    setTaskModalOpen(false);
  };

  // Handle add task dropdown options
  const handleAddTaskOption = (option) => {
    if (option === "blank") {
      setTaskModalOpen(true);
    } else if (option === "template") {
      setTaskTemplateModalOpen(true);
    }
    setAddTaskDropdownOpen(false);
  };

  // Handle template selection
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setTaskModalOpen(true);
  };

  return (
    <div className="p-3 md:p-6 space-y-6 md:space-y-8 bg-gray-50 min-h-screen">
      {/* Top header with logo and user info */}
      <Header />

      {/* Task details dialog */}
      {selectedTask && (
        <TaskDetailsDialog
          isOpen={dialogOpen}
          onClose={handleDialogClose}
          task={selectedTask}
          building={{ name: `Building ${selectedTask.buildingId}` }}
        />
      )}

      {/* Page title and breadcrumbs */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Tasks</h1>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Link
              href={`/${params.domain}/dashboard`}
              className="hover:text-blue-600"
            >
              <span>Data Mgmt</span>
            </Link>
            <span className="mx-2">/</span>
            <span>Task</span>
          </div>
        </div>

        {/* Mobile sidebar toggle */}
        <button
          className="block lg:hidden rounded-md border p-2 text-gray-600 hover:bg-gray-100"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left sidebar - hidden on mobile unless toggled */}
        {sidebarOpen && (
          <div className="w-full lg:w-60 bg-white rounded-md shadow-sm p-4 order-2 lg:order-1">
            <div className="mb-6">
              <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3">
                FILTERS:
              </h3>
              <div className="space-y-1">
                <div
                  className={`px-3 py-2 rounded-md text-sm ${
                    activeTab === "all"
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100"
                  } cursor-pointer`}
                  onClick={() => setActiveTab("all")}
                >
                  All tasks
                </div>
                <div
                  className={`px-3 py-2 rounded-md text-sm ${
                    activeTab === "survey"
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100"
                  } cursor-pointer flex items-center`}
                  onClick={() => setActiveTab("survey")}
                >
                  <span className="text-gray-700 mr-2">›</span> Selected Survey
                  Tasks
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3 flex items-center">
                LABELS:
                <button
                  className="ml-1 text-blue-500 hover:text-blue-600 focus:outline-none"
                  onClick={() => setLabelModalOpen(true)}
                >
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </h3>

              {/* Mock labels with click functionality */}
              <div className="space-y-1 mt-2">
                {labels.map((label) => (
                  <div key={label.name} className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: label.color }}
                    ></span>
                    <span
                      className="text-sm text-gray-700 cursor-pointer hover:text-blue-600"
                      onClick={() => alert(`Clicked on ${label.name} label`)}
                    >
                      {label.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 order-1 lg:order-2">
          {/* Filters and search */}
          <div className="bg-white rounded-md shadow-sm p-4 mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {/* Search */}
              <div className="relative w-full md:w-48">
                <input
                  type="text"
                  placeholder="search tasks"
                  className="border rounded-md pl-3 pr-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              {/* Division dropdown for mobile */}
              <div className="relative w-full md:hidden">
                <select
                  className="appearance-none w-full border rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                >
                  <option value="Active Divisions">Active Divisions</option>
                  <option value="Hampstead">Hampstead</option>
                  <option value="Ealing">Ealing</option>
                  <option value="Camden">Camden</option>
                  <option value="Leased">Leased</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              {/* Division buttons - only on medium+ screens */}
              <div className="hidden md:flex md:flex-wrap gap-2">
                <button
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    selectedDivision === "Active Divisions"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setSelectedDivision("Active Divisions")}
                >
                  Active Divisions
                </button>
                <button
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    selectedDivision === "Hampstead"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setSelectedDivision("Hampstead")}
                >
                  Hampstead
                </button>
                <button
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    selectedDivision === "Ealing"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setSelectedDivision("Ealing")}
                >
                  Ealing
                </button>
                <button
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    selectedDivision === "Camden"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setSelectedDivision("Camden")}
                >
                  Camden
                </button>
                <button
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    selectedDivision === "Leased"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setSelectedDivision("Leased")}
                >
                  Leased
                </button>
                <button
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    selectedDivision === "Archived"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setSelectedDivision("Archived")}
                >
                  Archived
                </button>
              </div>

              {/* Filter dropdowns - stacked on mobile */}
              <div className="flex flex-wrap w-full md:w-auto md:ml-auto gap-2 mt-3 md:mt-0">
                {/* Teams dropdown */}
                <div className="relative w-full md:w-auto">
                  <button
                    className="inline-flex w-full md:w-auto items-center justify-between border px-3 py-1.5 rounded-md text-sm"
                    onClick={() => setTeamsDropdownOpen(!teamsDropdownOpen)}
                  >
                    {selectedTeam || "Filter by team"}
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

                  {teamsDropdownOpen && (
                    <div className="absolute left-0 mt-1 w-full md:w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
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

                {/* Assignee dropdown */}
                <div className="relative w-full md:w-auto">
                  <button
                    className="inline-flex w-full md:w-auto items-center justify-between border px-3 py-1.5 rounded-md text-sm"
                    onClick={() =>
                      setAssigneeDropdownOpen(!assigneeDropdownOpen)
                    }
                  >
                    {selectedAssignee || "Filter by assignee"}
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

                  {assigneeDropdownOpen && (
                    <div className="absolute left-0 mt-1 w-full md:w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
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

                {/* Additional filter buttons - grouped on mobile */}
                <div className="flex w-full md:w-auto justify-between md:justify-start gap-2">
                  <div className="flex border rounded-md">
                    <button
                      className="p-1.5 border-r"
                      onClick={() => alert("Priority filter clicked")}
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
                      className="p-1.5"
                      onClick={() => alert("Completed filter clicked")}
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
                      className="p-1.5 border-r"
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
                      className="p-1.5"
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

                {/* Building Use dropdown */}
                <div className="relative w-full md:w-auto">
                  <button
                    className="inline-flex w-full md:w-auto items-center justify-between border px-3 py-1.5 rounded-md text-sm"
                    onClick={() =>
                      setBuildingUseDropdownOpen(!buildingUseDropdownOpen)
                    }
                  >
                    {buildingUse}
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

                  {buildingUseDropdownOpen && (
                    <div className="absolute right-0 md:right-0 mt-1 w-full md:w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
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
            </div>

            <div className="flex justify-end mt-2">
              {/* Column visibility toggle */}
              <div className="relative mr-2">
                <button
                  className="flex items-center border border-gray-300 px-3 py-1.5 rounded-md text-sm font-medium bg-white"
                  onClick={() => setColumnsMenuOpen(!columnsMenuOpen)}
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

                {columnsMenuOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-20 py-1 border border-gray-200">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
                      Toggle columns
                    </div>
                    <div className="p-2 max-h-60 overflow-y-auto">
                      <label className="flex items-center p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={visibleColumns.description}
                          onChange={() => toggleColumnVisibility("description")}
                          className="mr-2"
                          disabled // Description should always be visible
                        />
                        <span className="text-sm">Description</span>
                      </label>
                      <label className="flex items-center p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={visibleColumns.riskArea}
                          onChange={() => toggleColumnVisibility("riskArea")}
                          className="mr-2"
                        />
                        <span className="text-sm">Risk Area</span>
                      </label>
                      <label className="flex items-center p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={visibleColumns.priority}
                          onChange={() => toggleColumnVisibility("priority")}
                          className="mr-2"
                        />
                        <span className="text-sm">Priority</span>
                      </label>
                      <label className="flex items-center p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={visibleColumns.riskLevel}
                          onChange={() => toggleColumnVisibility("riskLevel")}
                          className="mr-2"
                        />
                        <span className="text-sm">Risk Level</span>
                      </label>
                      <label className="flex items-center p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={visibleColumns.dueDate}
                          onChange={() => toggleColumnVisibility("dueDate")}
                          className="mr-2"
                        />
                        <span className="text-sm">Due Date</span>
                      </label>
                      <label className="flex items-center p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={visibleColumns.team}
                          onChange={() => toggleColumnVisibility("team")}
                          className="mr-2"
                        />
                        <span className="text-sm">Team</span>
                      </label>
                      <label className="flex items-center p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={visibleColumns.assignee}
                          onChange={() => toggleColumnVisibility("assignee")}
                          className="mr-2"
                        />
                        <span className="text-sm">Assignee</span>
                      </label>
                      <label className="flex items-center p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={visibleColumns.progress}
                          onChange={() => toggleColumnVisibility("progress")}
                          className="mr-2"
                        />
                        <span className="text-sm">Progress</span>
                      </label>
                      <label className="flex items-center p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={visibleColumns.latestNote}
                          onChange={() => toggleColumnVisibility("latestNote")}
                          className="mr-2"
                        />
                        <span className="text-sm">Latest Note</span>
                      </label>
                      <label className="flex items-center p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={visibleColumns.groups}
                          onChange={() => toggleColumnVisibility("groups")}
                          className="mr-2"
                        />
                        <span className="text-sm">Groups</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <button
                className="bg-green-500 text-white px-3 py-1.5 rounded-md text-sm font-medium mr-2 flex items-center relative"
                onClick={() => setAddTaskDropdownOpen(!addTaskDropdownOpen)}
                ref={addTaskButtonRef}
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
                {/* Add task dropdown menu */}
                {addTaskDropdownOpen && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-30 py-1 border border-gray-200">
                    <div
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddTaskOption("template");
                      }}
                    >
                      Start from template
                    </div>
                    <div
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddTaskOption("blank");
                      }}
                    >
                      Start from blank task
                    </div>
                  </div>
                )}
              </button>
              <button
                className="bg-white border border-gray-300 px-3 py-1.5 rounded-md text-sm font-medium"
                onClick={() => alert("CSV export would start here")}
              >
                CSV
              </button>
            </div>
          </div>

          {/* Status tabs - converted to dropdown on small screens */}
          <div className="mb-6">
            {/* Mobile status dropdown */}
            <div className="block md:hidden">
              <select
                className="w-full border rounded-md px-3 py-2 bg-white"
                onChange={(e) => alert(`Selected tab: ${e.target.value}`)}
              >
                <option value="in-progress">In Progress (107)</option>
                <option value="inbox">Inbox (157 + 43)</option>
                <option value="future">Future (377)</option>
                <option value="completed">Completed (10238)</option>
                <option value="on-hold-requested">On Hold Requested</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>

            {/* Desktop status tabs */}
            <div className="hidden md:flex space-x-2">
              <div className="flex items-center px-3 py-2 bg-white rounded-md border border-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                In Progress
                <span className="ml-2 bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs">
                  107
                </span>
              </div>
              <div className="flex items-center px-3 py-2 bg-white rounded-md border border-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-gray-500"
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
                Inbox
                <span className="ml-2 bg-red-500 text-white px-1.5 py-0.5 rounded text-xs">
                  157
                </span>
                <span className="ml-1 bg-yellow-500 text-white px-1.5 py-0.5 rounded text-xs">
                  43
                </span>
              </div>
              <div className="flex items-center px-3 py-2 bg-white rounded-md border border-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-gray-500"
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
                Future
                <span className="ml-2 bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs">
                  377
                </span>
              </div>
              <div className="flex items-center px-3 py-2 bg-white rounded-md border border-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-gray-500"
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
                Completed
                <span className="ml-2 bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs">
                  10238
                </span>
              </div>
              <div className="flex items-center px-3 py-2 bg-white rounded-md border border-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                On Hold Requested
              </div>
              <div className="flex items-center px-3 py-2 bg-white rounded-md border border-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                On Hold
              </div>
            </div>
          </div>

          {/* Responsive tasks table */}
          <div className="bg-white rounded-md shadow-sm overflow-hidden">
            {/* Mobile card view */}
            <div className="block sm:hidden">
              {filteredTasks.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredTasks.map((task, index) => (
                    <div
                      key={task.id || index}
                      className="p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleTaskClick(task)}
                    >
                      <div className="font-medium text-gray-900 mb-1">
                        {task.description}
                      </div>
                      <div className="text-gray-500 text-sm mb-2">
                        Building: {task.buildingId}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        {visibleColumns.riskArea && (
                          <div>
                            <span className="text-gray-500">Risk Area:</span>{" "}
                            {task.riskArea}
                          </div>
                        )}
                        {visibleColumns.priority && (
                          <div>
                            <span className="text-gray-500">Priority:</span>{" "}
                            {renderBadge(task.priority)}
                          </div>
                        )}
                        {visibleColumns.riskLevel && (
                          <div>
                            <span className="text-gray-500">Risk Level:</span>{" "}
                            {renderBadge(task.riskLevel)}
                          </div>
                        )}
                        {visibleColumns.dueDate && (
                          <div>
                            <span className="text-gray-500">Due Date:</span>{" "}
                            {renderDateBadge(task.dueDate)}
                          </div>
                        )}
                        {visibleColumns.team && (
                          <div>
                            <span className="text-gray-500">Team:</span>{" "}
                            {task.team || "—"}
                          </div>
                        )}
                        {visibleColumns.assignee && (
                          <div>
                            <span className="text-gray-500">Assignee:</span>{" "}
                            {task.assignee || "—"}
                          </div>
                        )}
                        {visibleColumns.progress && (
                          <div>
                            <span className="text-gray-500">Progress:</span>{" "}
                            {task.progress ? (
                              <span className="inline-block rounded bg-gray-100 px-2 py-1 text-xs">
                                {task.progress}
                              </span>
                            ) : (
                              "—"
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end space-x-2 mt-2 border-t pt-2">
                        <button
                          className="text-blue-600 hover:text-blue-800 p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTaskClick(task);
                          }}
                          title="Edit"
                        >
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          className="text-green-600 hover:text-green-800 p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTaskComplete(task.id);
                          }}
                          title="Mark as complete"
                        >
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Delete task ${task.id}`);
                          }}
                          title="Delete"
                        >
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500 italic">
                  No tasks found matching your filters
                </div>
              )}
            </div>

            {/* Desktop table view */}
            <div className="hidden sm:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8"
                      ></th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Description
                      </th>
                      {visibleColumns.riskArea && (
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Risk Area
                        </th>
                      )}
                      {visibleColumns.priority && (
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
                        >
                          PR
                        </th>
                      )}
                      {visibleColumns.riskLevel && (
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
                        >
                          RL
                        </th>
                      )}
                      {visibleColumns.dueDate && (
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Due Date
                        </th>
                      )}
                      {visibleColumns.team && (
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Team
                        </th>
                      )}
                      {visibleColumns.assignee && (
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Assignee
                        </th>
                      )}
                      {visibleColumns.progress && (
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Progress
                        </th>
                      )}
                      {visibleColumns.latestNote && (
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Latest Note
                        </th>
                      )}
                      {visibleColumns.groups && (
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Groups
                        </th>
                      )}
                      {visibleColumns.actions && (
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20"
                        >
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task, index) => (
                        <tr
                          key={task.id || index}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => handleTaskClick(task)}
                        >
                          <td
                            className="px-4 py-4 whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button className="focus:outline-none">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-gray-400 hover:text-blue-500"
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
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-medium text-gray-900">
                              {task.description}
                            </div>
                            <div className="text-gray-500 text-sm">
                              Building: {task.buildingId}
                            </div>
                          </td>
                          {visibleColumns.riskArea && (
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              {task.riskArea}
                            </td>
                          )}
                          {visibleColumns.priority && (
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                              {renderBadge(task.priority)}
                            </td>
                          )}
                          {visibleColumns.riskLevel && (
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                              {renderBadge(task.riskLevel)}
                            </td>
                          )}
                          {visibleColumns.dueDate && (
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                              {renderDateBadge(task.dueDate)}
                            </td>
                          )}
                          {visibleColumns.team && (
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                              {task.team || "—"}
                            </td>
                          )}
                          {visibleColumns.assignee && (
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {task.assignee || "—"}
                            </td>
                          )}
                          {visibleColumns.progress && (
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                              {task.progress ? (
                                <div className="rounded bg-gray-100 px-2 py-1 text-xs">
                                  {task.progress}
                                </div>
                              ) : (
                                "—"
                              )}
                            </td>
                          )}
                          {visibleColumns.latestNote && (
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {task.latestNote || "—"}
                            </td>
                          )}
                          {visibleColumns.groups && (
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {task.groups ? task.groups.join(", ") : "—"}
                            </td>
                          )}
                          {visibleColumns.actions && (
                            <td
                              className="px-4 py-4 whitespace-nowrap text-sm text-gray-500"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex space-x-2">
                                <button
                                  className="text-blue-600 hover:text-blue-800"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTaskClick(task);
                                  }}
                                  title="Edit"
                                >
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
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                                <button
                                  className="text-green-600 hover:text-green-800"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleTaskComplete(task.id);
                                  }}
                                  title="Mark as complete"
                                >
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
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </button>
                                <button
                                  className="text-red-600 hover:text-red-800"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    alert(`Delete task ${task.id}`);
                                  }}
                                  title="Delete"
                                >
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
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={12}
                          className="px-6 py-10 text-center text-gray-500 italic"
                        >
                          No tasks found matching your filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pagination controls */}
          <div className="flex justify-between items-center mt-4 text-sm">
            <div className="text-gray-500">
              Showing {filteredTasks.length} tasks
            </div>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 focus:outline-none transition-colors"
                onClick={() => alert("Previous page")}
              >
                Previous
              </button>
              <button
                className="px-3 py-1 border rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none transition-colors"
                onClick={() => alert("Next page")}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Label modal */}
      <LabelModal
        isOpen={labelModalOpen}
        onClose={() => setLabelModalOpen(false)}
        onSave={handleSaveLabel}
      />

      {/* Task modal */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setSelectedTemplate(null);
        }}
        onSave={handleSaveTask}
        templateData={selectedTemplate}
      />

      {/* Task template modal */}
      <TaskTemplateModal
        isOpen={taskTemplateModalOpen}
        onClose={() => setTaskTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}
