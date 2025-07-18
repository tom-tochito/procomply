"use client";

import React, { useState } from "react";
import { Task } from "@/data/tasks";
import { Building } from "@/features/buildings/models";
import { TaskModal } from "./TaskModal";
import { TaskWithRelations } from "@/features/tasks/models";
import TaskDetailsDialog from "@/features/data-mgmt/components/TaskDetailsDialog";
import TaskSidebar from "@/features/data-mgmt/components/TaskSidebar";
import TaskFilters from "@/features/data-mgmt/components/TaskFilters";
import TaskTable from "@/features/data-mgmt/components/TaskTable";
import TaskStatusFilters from "@/features/data-mgmt/components/TaskStatusFilters";
import { db } from "~/lib/db";

interface TaskManagementNewProps {
  tenant?: string;
  tenantId: string;
  buildings?: Building[];
  users?: Array<{ id: string; email: string }>;
  buildingId?: string; // For building details page
}

export default function TaskManagementNew({ 
  tenantId,
  buildings = [],
  users: initialUsers = [],
  buildingId 
}: TaskManagementNewProps) {
  
  // Fetch tasks from InstantDB client-side
  const { data: instantData } = db.useQuery({
    tasks: {
      $: {
        where: { "tenant.id": tenantId },
        order: { dueDate: "asc" }
      },
      building: {},
      assignee: {},
      creator: {},
      tenant: {},
    },
  });

  // Fetch divisions for filters
  const { data: divisionsData } = db.useQuery({
    divisions: {
      $: {
        where: { "tenant.id": tenantId },
        order: { name: "asc" }
      },
    },
  });

  // Create a mapping of task IDs to building data
  const taskBuildingMap = new Map<string, { name: string; image?: string }>();
  instantData?.tasks?.forEach((task) => {
    if (task.building) {
      taskBuildingMap.set(task.id, {
        name: task.building.name,
        image: task.building.image,
      });
    }
  });

  // Transform InstantDB tasks to match Task interface
  const tasks: Task[] = (instantData?.tasks || []).map((task) => ({
    id: task.id,
    description: task.title,
    risk_area: "Fire", // Default as no risk area in schema
    priority: (task.priority === "high" ? "H" : task.priority === "low" ? "L" : "M") as "H" | "M" | "L",
    risk_level: "M" as "H" | "M" | "L", // Default as no risk level in schema
    due_date: task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB') : '',
    team: '', // No team association in current schema
    assignee: task.assignee?.email || '',
    progress: task.status,
    notes: [],
    completed: task.status === 'completed',
    groups: [],
    building_id: task.building?.id || '',
  }));
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<TaskWithRelations | undefined>(undefined);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("All Divisions");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [buildingUse, setBuildingUse] = useState("");
  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);
  const [labels] = useState<{ name: string; color: string }[]>([]);
  const [labelModalOpen, setLabelModalOpen] = useState(false);
  const [users] = useState<Array<{ id: string; email: string }>>(initialUsers);
  const [statusFilters, setStatusFilters] = useState({
    inProgress: true,
    inbox: true,
    future: false,
    completed: false,
    onHold: false
  });

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredTasks = tasks.filter((task) => {
    // Search filter
    if (
      searchTerm &&
      !task.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !task.id.includes(searchTerm)
    ) {
      return false;
    }

    // Status filters
    const statusMap: { [key: string]: boolean } = {
      'pending': statusFilters.inbox,
      'in_progress': statusFilters.inProgress,
      'completed': statusFilters.completed,
      'on_hold': statusFilters.onHold,
      'future': statusFilters.future
    };
    
    if (!statusMap[task.progress] && task.progress in statusMap) {
      return false;
    }

    // Division filter
    if (selectedDivision !== "All Divisions") {
      // Find the building for this task
      const taskBuilding = instantData?.tasks?.find(t => t.id === task.id)?.building;
      if (!taskBuilding || taskBuilding.division !== selectedDivision) {
        return false;
      }
    }

    if (selectedTeam && task.team !== selectedTeam) {
      return false;
    }

    if (selectedAssignee && task.assignee !== selectedAssignee) {
      return false;
    }

    if (
      activeTab === "survey" &&
      !task.description.toLowerCase().includes("survey")
    ) {
      return false;
    }

    return true;
  });

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleAddTask = () => {
    setEditTask(undefined);
    setModalMode("create");
    setTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    // Convert Task to TaskWithRelations format for the modal
    const taskWithRelations: TaskWithRelations = {
      id: task.id,
      title: task.description,
      description: task.notes?.join("\n") || "",
      status: task.progress,
      priority: task.priority === "H" ? "high" : task.priority === "L" ? "low" : "medium",
      dueDate: task.due_date ? new Date(task.due_date.split('/').reverse().join('-')).getTime() : Date.now(),
      completedDate: task.completed ? Date.now() : undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      building: task.building_id ? { 
        id: task.building_id,
        name: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        floors: 0,
        archived: false,
        createdAt: Date.now(),
        updatedAt: Date.now()
      } : undefined,
      assignee: undefined, // We don't have assignee ID from the Task type
      creator: {
        id: "",
        email: ""
      },
      tenant: { 
        id: tenantId,
        name: "",
        slug: "",
        description: "",
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
    };
    
    setEditTask(taskWithRelations);
    setModalMode("edit");
    setTaskModalOpen(true);
  };

  const handleTaskSuccess = () => {
    // No need to refresh - InstantDB will automatically update the data
  };

  const handleStatusFilterChange = (filter: keyof typeof statusFilters, value: boolean) => {
    setStatusFilters(prev => ({ ...prev, [filter]: value }));
  };

  // Calculate task counts for status filters
  const taskCounts = {
    inProgress: tasks.filter(t => t.progress === 'in_progress').length,
    inbox: tasks.filter(t => t.progress === 'pending').length,
    future: tasks.filter(t => t.progress === 'future').length,
    completed: tasks.filter(t => t.progress === 'completed').length,
    onHold: tasks.filter(t => t.progress === 'on_hold').length,
  };

  return (
    <>
      {selectedTask && (
        <TaskDetailsDialog
          isOpen={dialogOpen}
          onClose={handleDialogClose}
          task={selectedTask}
          building={taskBuildingMap.get(selectedTask.id) || { name: `Building ${selectedTask.building_id}` }}
          onTaskUpdate={handleTaskSuccess}
        />
      )}

      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSuccess={handleTaskSuccess}
        tenantId={tenantId}
        buildings={buildings}
        users={users}
        buildingId={buildingId}
        task={editTask}
        mode={modalMode}
      />

      <div className="flex items-center justify-between mb-6">
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
        {sidebarOpen && (
          <TaskSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            labels={labels}
            onLabelModalOpen={() => setLabelModalOpen(!labelModalOpen)}
          />
        )}

        <div className="flex-1 order-1 lg:order-2">
          <div className="relative">
            <TaskFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedDivision={selectedDivision}
              setSelectedDivision={setSelectedDivision}
              selectedTeam={selectedTeam}
              setSelectedTeam={setSelectedTeam}
              selectedAssignee={selectedAssignee}
              setSelectedAssignee={setSelectedAssignee}
              buildingUse={buildingUse}
              setBuildingUse={setBuildingUse}
              onAddTaskClick={handleAddTask}
              onColumnsMenuToggle={() => setColumnsMenuOpen(!columnsMenuOpen)}
              divisions={(divisionsData?.divisions || []).map(d => d.name)}
            />
          </div>

          <TaskStatusFilters 
            filters={statusFilters}
            onChange={handleStatusFilterChange}
            counts={taskCounts}
          />

          <TaskTable
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
            onTaskEdit={handleEditTask}
            columnsMenuOpen={columnsMenuOpen}
            setColumnsMenuOpen={setColumnsMenuOpen}
          />
        </div>
      </div>
    </>
  );
}