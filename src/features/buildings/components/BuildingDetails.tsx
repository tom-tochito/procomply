"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import { getFileUrl } from "@/common/utils/file";
import { Task } from "@/data/tasks";
import TaskDetailsDialog from "@/features/data-mgmt/components/TaskDetailsDialog";
import { TaskModal } from "@/features/tasks/components/TaskModal";
import { db } from "~/lib/db";
import { Tenant } from "@/features/tenant/models";
import TabNavigation from "./TabNavigation";
import BuildingInfo from "./BuildingInfo";
import TaskFilters from "./TaskFilters";
import TaskTable from "./TaskTable";
import DocumentsTab from "./DocumentsTab";
import ContactsTab from "./ContactsTab";
import NotesTab from "./NotesTab";
import YearPlannerTab from "./YearPlannerTab";
import { COMPLIANCE_CHECK_TYPES } from "@/features/compliance/models";

interface BuildingDetailsProps {
  buildingId: string;
  tenant: Tenant;
  tenantSlug: string;
}

export default function BuildingDetails({ buildingId, tenant, tenantSlug }: BuildingDetailsProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [filterByTeam, setFilterByTeam] = useState("");
  const [filterByAssignee, setFilterByAssignee] = useState("");
  const [taskSearchTerm, setTaskSearchTerm] = useState("");
  
  // State for Task Details Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // State for Task Modal
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>(undefined);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  // Fetch building data client-side
  const { data: buildingData, isLoading: buildingLoading, error: buildingError } = db.useQuery({
    buildings: {
      $: {
        where: { id: buildingId },
        limit: 1,
      },
      tenant: {},
      divisionEntity: {},
      tasks: {
        assignee: {},
        creator: {},
      },
      documents: { uploader: {} },
      inspections: {},
      complianceChecks: {},
      contacts: {},
      notes: {},
      yearPlannerEvents: {},
    },
  });

  // Fetch users for the tenant
  const { data: usersData } = db.useQuery({
    $users: {
      $: {
        where: { "tenant.id": tenant.id },
      },
    },
  });

  // Fetch divisions for the tenant
  const { data: divisionsData } = db.useQuery({
    divisions: {
      $: {
        where: { "tenant.id": tenant.id },
      },
      buildings: {},
    },
  });

  if (buildingLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading building details...</div>
      </div>
    );
  }

  if (buildingError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Error loading building
            </h1>
            <p className="text-red-600 mt-2">{buildingError.message}</p>
            <Link
              href={generateTenantRedirectUrl(tenantSlug, "/buildings")}
              className="mt-4 inline-block text-blue-600 hover:text-blue-800"
            >
              Back to Buildings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const building = buildingData?.buildings?.[0];

  if (!building) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Building not found
            </h1>
            <Link
              href={generateTenantRedirectUrl(tenantSlug, "/buildings")}
              className="mt-4 inline-block text-blue-600 hover:text-blue-800"
            >
              Back to Buildings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Transform building image URL to use file service
  const buildingWithImageUrl = {
    ...building,
    image: building.image ? getFileUrl(tenantSlug, building.image) : undefined,
  };

  // Calculate compliance
  // Task-based compliance
  const taskStats = {
    total: building.tasks?.length || 0,
    completed: building.tasks?.filter((task) => task.status === "completed").length || 0,
  };
  const taskCompliance = taskStats.total > 0
    ? Math.round((taskStats.completed / taskStats.total) * 100)
    : 100;

  // Compliance check-based compliance
  const checksByType: Record<string, { status?: string; completedDate?: number; dueDate?: number }> = {};
  (building.complianceChecks || []).forEach(check => {
    if (!checksByType[check.checkType] || 
        (check.completedDate || check.dueDate || 0) > 
        (checksByType[check.checkType].completedDate || 
         checksByType[check.checkType].dueDate || 0)) {
      checksByType[check.checkType] = check;
    }
  });

  const totalCheckTypes = Object.keys(COMPLIANCE_CHECK_TYPES).length;
  const completedChecks = Object.values(checksByType).filter(
    check => check.status === "success"
  ).length;
  const checkCompliance = totalCheckTypes > 0 
    ? Math.round((completedChecks / totalCheckTypes) * 100) 
    : 0;

  // Use check-based compliance if available, otherwise use task-based
  const compliance = building.complianceChecks?.length > 0 ? checkCompliance : taskCompliance;

  // Transform InstantDB tasks to match Task interface
  const tasks: Task[] = (building.tasks || []).map((task) => ({
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

  const users = usersData?.$users || [];
  const divisions = divisionsData?.divisions || [];

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
        return <BuildingInfo building={buildingWithImageUrl} divisions={divisions} />;
      
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
          tenant={tenantSlug}
          documents={building.documents || []}
        />;
      
      case "contacts":
        return <ContactsTab building={buildingWithImageUrl} />;
      
      case "notes":
        return <NotesTab building={buildingWithImageUrl} />;
      
      case "yearplanner":
        return <YearPlannerTab building={buildingWithImageUrl} />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-svh bg-gray-50">
      <div className="px-3 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">
        {/* Building header with image */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Building image */}
            {buildingWithImageUrl.image && (
              <div className="relative h-48 w-full md:w-64 rounded-lg overflow-hidden md:flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent z-10" />
                <Image
                  src={buildingWithImageUrl.image}
                  alt={buildingWithImageUrl.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}

            <div className="flex flex-col justify-between py-2 space-y-4 md:space-y-0">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                  {buildingWithImageUrl.name}
                </h1>
                <div className="flex flex-wrap items-center text-sm text-gray-600 mt-1">
                  <Link
                    href={generateTenantRedirectUrl(tenantSlug, "/dashboard")}
                    className="hover:text-blue-600"
                  >
                    <span>Home</span>
                  </Link>
                  <span className="mx-2">/</span>
                  <Link
                    href={generateTenantRedirectUrl(tenantSlug, "/buildings")}
                    className="hover:text-blue-600"
                  >
                    <span>Buildings</span>
                  </Link>
                  <span className="mx-2">/</span>
                  <span>{buildingWithImageUrl.city}</span>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {buildingWithImageUrl.address}, {buildingWithImageUrl.city},{" "}
                  {buildingWithImageUrl.state} {buildingWithImageUrl.zipCode}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600">Rem. compliance:</div>
                <div className="text-xl font-bold text-[#F30]">{compliance}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Building details component */}
        <div className="max-w-7xl mx-auto">
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
              building={buildingWithImageUrl}
              onTaskUpdate={handleTaskSuccess}
            />
          )}

          {/* Task Modal */}
          <TaskModal
            isOpen={isAddTaskModalOpen}
            onClose={() => setIsAddTaskModalOpen(false)}
            onSuccess={handleTaskSuccess}
            tenantId={building.tenant?.id || ""}
            buildings={[buildingWithImageUrl]}
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
        </div>
      </div>
    </div>
  );
}