"use client";

import React, { useState } from "react";
import { Task } from "@/data/tasks";
import { Building } from "@/features/buildings/models";
import { AddTaskModal } from "./AddTaskModal";
import TaskDetailsDialog from "@/features/data-mgmt/components/TaskDetailsDialog";
import TaskSidebar from "@/features/data-mgmt/components/TaskSidebar";
import TaskFilters from "@/features/data-mgmt/components/TaskFilters";
import TaskTable from "@/features/data-mgmt/components/TaskTable";
import TaskStatusFilters from "@/features/data-mgmt/components/TaskStatusFilters";
import { useRouter } from "next/navigation";

interface TaskManagementNewProps {
  initialTasks: Task[];
  tenant?: string;
  tenantId: string;
  buildings?: Building[];
  users?: Array<{ id: string; email: string }>;
  buildingId?: string; // For building details page
}

export default function TaskManagementNew({ 
  initialTasks, 
  tenantId,
  buildings = [],
  users: initialUsers = [],
  buildingId 
}: TaskManagementNewProps) {
  const router = useRouter();
  const [tasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("Active Divisions");
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

    if (selectedDivision !== "Active Divisions") {
      return true;
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

  // const handleSaveLabel = (labelData: { name: string; color: string }) => {
  //   setLabels([...labels, labelData]);
  // };

  const handleTaskSuccess = () => {
    // Page will be revalidated server-side via revalidatePath
    // Force a hard refresh to ensure the page gets fresh data
    router.refresh();
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
          building={{ name: `Building ${selectedTask.building_id}` }}
        />
      )}

      <AddTaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSuccess={handleTaskSuccess}
        tenantId={tenantId}
        buildings={buildings}
        users={users}
        buildingId={buildingId}
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
              onAddTaskClick={() => setTaskModalOpen(true)}
              onColumnsMenuToggle={() => setColumnsMenuOpen(!columnsMenuOpen)}
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
            columnsMenuOpen={columnsMenuOpen}
            setColumnsMenuOpen={setColumnsMenuOpen}
          />
        </div>
      </div>
    </>
  );
}