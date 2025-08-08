"use client";

import React, { useState } from "react";
import { TaskModal } from "./TaskModal";
import { TaskWithRelations, TaskUI } from "@/features/tasks/models";
import TaskDetailsDialog from "@/features/data-mgmt/components/TaskDetailsDialog";
import TaskSidebar from "@/features/data-mgmt/components/TaskSidebar";
import TaskFilters from "@/features/data-mgmt/components/TaskFilters";
import TaskTable from "@/features/data-mgmt/components/TaskTable";
import TaskStatusFilters from "@/features/data-mgmt/components/TaskStatusFilters";
import { db } from "~/lib/db";
import { getDateStatus } from "@/common/utils/date";
import { Tenant } from "@/features/tenant/models";
import { Building } from "@/features/buildings/models";

interface TaskManagementProps {
  tenant: Tenant;
  building?: Building; // For building details page
}

export default function TaskManagement({ 
  tenant,
  building 
}: TaskManagementProps) {
  
  // Fetch tasks from InstantDB client-side
  const { data: instantData } = db.useQuery({
    tasks: {
      $: {
        where: { "tenant.id": tenant.id },
        order: { dueDate: "asc" }
      },
      building: {
        divisionEntity: {}
      },
      assignee: {},
      creator: {},
      tenant: {},
    },
  });

  // Fetch divisions for filters
  const { data: divisionsData } = db.useQuery({
    divisions: {
      $: {
        where: { "tenant.id": tenant.id },
        order: { name: "asc" }
      },
    },
  });

  // Create a mapping of task IDs to building data
  const taskBuildingMap = new Map<string, { name: string; image?: string }>();
  // Create a mapping of building IDs to names
  const buildingIdToNameMap = new Map<string, string>();
  
  instantData?.tasks?.forEach((task) => {
    if (task.building) {
      taskBuildingMap.set(task.id, {
        name: task.building.name,
        image: task.building.image,
      });
      buildingIdToNameMap.set(task.building.id, task.building.name);
    }
  });

  // Transform InstantDB tasks to match TaskUI interface
  const tasks: TaskUI[] = (instantData?.tasks || []).map((task) => {
    const dueDateStr = task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB') : '';
    
    // Determine the progress status
    let progress = task.status;
    
    // If task is not started and not completed, check if it should be categorized by date
    if (task.status === 'pending' && dueDateStr) {
      const dateStatus = getDateStatus(dueDateStr);
      if (dateStatus === 'future') {
        progress = 'future';
      }
      // For overdue and due_imminent, keep as 'pending' (inbox)
    }
    
    return {
      id: task.id,
      description: task.title,
      risk_area: "Fire", // Default as no risk area in schema
      priority: (task.priority === "high" ? "H" : task.priority === "low" ? "L" : "M") as "H" | "M" | "L",
      risk_level: "M" as "H" | "M" | "L", // Default as no risk level in schema
      due_date: dueDateStr,
      team: '', // No team association in current schema
      assignee: task.assignee?.email || '',
      progress: progress,
      notes: [],
      completed: task.status === 'completed',
      groups: [],
      building_id: task.building?.id || '',
    };
  });
  const [selectedTask, setSelectedTask] = useState<TaskUI | null>(null);
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

    // Team filter - tasks don't have teams in current schema, so skip for now
    if (selectedTeam) {
      // TODO: Implement team filtering when tasks are linked to teams
      return false;
    }

    // Assignee filter - match by user ID
    if (selectedAssignee) {
      const taskAssignee = instantData?.tasks?.find(t => t.id === task.id)?.assignee;
      if (!taskAssignee || taskAssignee.id !== selectedAssignee) {
        return false;
      }
    }

    if (
      activeTab === "survey" &&
      !task.description.toLowerCase().includes("survey")
    ) {
      return false;
    }

    return true;
  });

  const handleTaskClick = (task: TaskUI) => {
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

  const handleEditTask = (task: TaskUI) => {
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
        createdAt: Date.now(),
        updatedAt: Date.now()
      } : undefined,
      assignee: undefined, // We don't have assignee ID from the Task type
      creator: {
        id: "",
        email: ""
      },
      tenant: tenant,
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
        tenant={tenant}
        building={building}
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
              tasks={filteredTasks}
              tenant={tenant}
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
            buildingNames={buildingIdToNameMap}
          />
        </div>
      </div>
    </>
  );
}