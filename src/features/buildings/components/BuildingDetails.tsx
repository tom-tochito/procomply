"use client";

import React, { useState } from "react";
import { BuildingWithRelations } from "@/features/buildings/models";
import { DocumentWithRelations } from "@/features/documents/models";
import { Task } from "@/data/tasks";
import TaskDetailsDialog from "@/features/data-mgmt/components/TaskDetailsDialog";
import { AddTaskModal } from "@/features/tasks/components/AddTaskModal";
import { useRouter } from "next/navigation";
import TabNavigation from "./TabNavigation";
import BuildingInfo from "./BuildingInfo";
import TaskFilters from "./TaskFilters";
import TaskTable from "./TaskTable";
import DocumentsTab from "./DocumentsTab";
import ContactsTab from "./ContactsTab";
import NotesTab from "./NotesTab";
import YearPlannerTab from "./YearPlannerTab";

interface BuildingDetailsProps {
  building: BuildingWithRelations;
  initialTasks: Task[];
  tenant: string;
  users?: Array<{ id: string; email: string }>;
}

export default function BuildingDetails({ building, initialTasks, tenant, users: initialUsers = [] }: BuildingDetailsProps) {
  const router = useRouter();
  const [tasks] = useState<Task[]>(initialTasks);
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

  // State for Add Task Modal
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [users] = useState<Array<{ id: string; email: string }>>(initialUsers);

  const addNewTask = () => {
    setIsAddTaskModalOpen(true);
  };

  const handleTaskSuccess = () => {
    // Page will be revalidated server-side via revalidatePath
    // Force a hard refresh to ensure the page gets fresh data
    router.refresh();
  };

  // Filter tasks based on progress status
  const getFilteredTasksByProgress = () => {
    return tasks.filter(task => {
      if (!inProgressFilter && ["Job Started", "In Progress", "Scheduled"].includes(task.progress)) return false;
      if (!inboxFilter && task.progress === "Inbox") return false;
      if (!futureFilter && task.progress === "Future") return false;
      if (!completedFilter && task.completed) return false;
      if (!onHoldFilter && task.progress === "On Hold") return false;
      return true;
    });
  };

  // Further filter by team, assignee, and search term
  const filteredTasks = getFilteredTasksByProgress().filter(task => {
    const matchesTeam = !filterByTeam || task.team === filterByTeam;
    const matchesAssignee = !filterByAssignee || task.assignee === filterByAssignee;
    const matchesSearch = !taskSearchTerm || 
      task.description.toLowerCase().includes(taskSearchTerm.toLowerCase()) ||
      task.risk_area.toLowerCase().includes(taskSearchTerm.toLowerCase());
    return matchesTeam && matchesAssignee && matchesSearch;
  });

  const uniqueTeams = Array.from(new Set(tasks.map(task => task.team))).filter(Boolean);
  const uniqueAssignees = Array.from(new Set(tasks.map(task => task.assignee))).filter(Boolean);

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const progressFilters = {
    inProgressFilter,
    setInProgressFilter,
    inboxFilter,
    setInboxFilter,
    futureFilter,
    setFutureFilter,
    completedFilter,
    setCompletedFilter,
    onHoldFilter,
    setOnHoldFilter,
  };

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "details":
        return <BuildingInfo building={building} />;
      
      case "tasks":
        return (
          <div>
            <TaskFilters
              taskSearchTerm={taskSearchTerm}
              setTaskSearchTerm={setTaskSearchTerm}
              filterByTeam={filterByTeam}
              setFilterByTeam={setFilterByTeam}
              filterByAssignee={filterByAssignee}
              setFilterByAssignee={setFilterByAssignee}
              uniqueTeams={uniqueTeams}
              uniqueAssignees={uniqueAssignees}
              onAddNewTask={addNewTask}
              progressFilters={progressFilters}
            />
            <TaskTable
              tasks={filteredTasks}
              onTaskClick={openTaskDetails}
            />
          </div>
        );
      
      case "documents":
        return <DocumentsTab 
          buildingId={building.id} 
          tenantId={building.tenant?.id || ""} 
          tenant={tenant}
          documents={(building.documents || []) as DocumentWithRelations[]}
        />;
      
      case "contacts":
        return <ContactsTab buildingId={building.id} />;
      
      case "notes":
        return <NotesTab buildingId={building.id} />;
      
      case "yearplanner":
        return <YearPlannerTab buildingId={building.id} />;
      
      default:
        return null;
    }
  };

  return (
    <>
      {/* Tab navigation */}
      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        taskCount={tasks.length}
      />

      {/* Content based on active tab */}
      {renderTabContent()}

      {/* Task Details Dialog */}
      {selectedTask && (
        <TaskDetailsDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          task={selectedTask}
          building={building}
        />
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSuccess={handleTaskSuccess}
        tenantId={building.tenant?.id || ""}
        buildings={[building]}
        users={users}
        buildingId={building.id}
      />
    </>
  );
}