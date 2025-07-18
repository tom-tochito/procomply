"use client";

import React, { useState } from "react";
import { BuildingWithRelations } from "@/features/buildings/models";
import { DocumentWithRelations } from "@/features/documents/models";
import { Task } from "@/data/tasks";
import TaskDetailsDialog from "@/features/data-mgmt/components/TaskDetailsDialog";
import { TaskModal } from "@/features/tasks/components/TaskModal";
import { db } from "~/lib/db";
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
  tenant: string;
  users?: Array<{ id: string; email: string }>;
}

export default function BuildingDetails({ building, tenant, users: initialUsers = [] }: BuildingDetailsProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [filterByTeam, setFilterByTeam] = useState("");
  const [filterByAssignee, setFilterByAssignee] = useState("");
  const [taskSearchTerm, setTaskSearchTerm] = useState("");

  // Fetch tasks from InstantDB client-side
  const { data: instantData } = db.useQuery({
    tasks: {
      $: {
        where: { "building.id": building.id },
        order: { dueDate: "asc" }
      },
      building: {},
      assignee: {},
      creator: {},
      tenant: {},
    },
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
    building_id: building.id,
  }));

  // State for Task Details Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // State for Task Modal
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>(undefined);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [users] = useState<Array<{ id: string; email: string }>>(initialUsers);

  const addNewTask = () => {
    setEditTask(undefined);
    setModalMode("create");
    setIsAddTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setModalMode("edit");
    setIsAddTaskModalOpen(true);
  };

  const handleTaskSuccess = () => {
    // No need to refresh - InstantDB will automatically update the data
  };

  // Filter by team, assignee, and search term
  const filteredTasks = tasks.filter(task => {
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

  // No longer needed - removed progress filters

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
            />
            <TaskTable
              tasks={filteredTasks}
              onTaskClick={openTaskDetails}
              onTaskEdit={handleEditTask}
              onTaskUpdate={handleTaskSuccess}
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
        return <ContactsTab building={building} />;
      
      case "notes":
        return <NotesTab building={building} />;
      
      case "yearplanner":
        return <YearPlannerTab building={building} />;
      
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

      {/* Task Modal */}
      <TaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSuccess={handleTaskSuccess}
        tenantId={building.tenant?.id || ""}
        buildings={[building]}
        users={users}
        buildingId={building.id}
        task={editTask ? {
          id: editTask.id,
          title: editTask.description,
          description: editTask.notes?.join("\n") || "",
          status: editTask.progress,
          priority: editTask.priority === "H" ? "high" : editTask.priority === "L" ? "low" : "medium",
          dueDate: editTask.due_date ? new Date(editTask.due_date.split('/').reverse().join('-')).getTime() : Date.now(),
          completedDate: editTask.completed ? Date.now() : undefined,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          building: { 
            id: building.id,
            name: building.name,
            address: building.address,
            city: building.city,
            state: building.state,
            zipCode: building.zipCode,
            floors: building.floors,
            archived: building.archived,
            createdAt: building.createdAt,
            updatedAt: building.updatedAt
          },
          assignee: undefined,
          creator: {
            id: "",
            email: ""
          },
          tenant: building.tenant ? building.tenant : { 
            id: "",
            name: "",
            slug: "",
            description: "",
            createdAt: Date.now(),
            updatedAt: Date.now()
          },
        } : undefined}
        mode={modalMode}
      />
    </>
  );
}