"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import { getFileUrl } from "@/common/utils/file";
import TaskModal from "@/features/tasks/components/TaskModal";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";
import { Tenant } from "@/features/tenant/models";
import { TaskUI } from "@/features/tasks/models";
import { BuildingWithRelations } from "@/features/buildings/models";
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
  const [filterByAssignee, setFilterByAssignee] = useState("");
  const [taskSearchTerm, setTaskSearchTerm] = useState("");
  
  // State for Task Details Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskUI | null>(null);

  // State for Task Modal
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | undefined>(undefined);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  // Fetch building data using Convex
  const building = useQuery(api.buildings.getBuilding, { 
    buildingId: buildingId as Id<"buildings">,
    tenantId: tenant._id 
  });
  const divisions = useQuery(api.divisions.getDivisions, { tenantId: tenant._id }) || [];
  const tasks = useQuery(api.tasks.getTasks, { tenantId: tenant._id, buildingId: buildingId as Id<"buildings"> }) || [];
  const teams = useQuery(api.teams.getTeams, { tenantId: tenant._id }) || [];
  const users = useQuery(api.users.getUsers, { tenantId: tenant._id }) || [];

  // Calculate compliance
  const complianceChecks = useQuery(api.complianceChecks.getComplianceChecks, { 
    tenantId: tenant._id,
    buildingId: buildingId as Id<"buildings"> 
  }) || [];
  
  const totalChecks = Object.keys(COMPLIANCE_CHECK_TYPES).length;
  const completedChecks = complianceChecks.filter(check => check.status === 'compliant' || check.status === 'success').length;
  const compliancePercentage = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;

  if (!building) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F30]"></div>
      </div>
    );
  }

  // Transform building to ensure compatibility with BuildingWithRelations type
  const buildingWithRelations: BuildingWithRelations = {
    ...building,
    divisionEntity: building.divisionEntity === null ? undefined : building.divisionEntity,
    template: building.template === null ? undefined : building.template,
  };

  // Transform tasks to TaskUI format
  const tasksUI: TaskUI[] = tasks.map(task => ({
    id: task._id,
    description: task.description || task.title,
    risk_area: '',
    priority: task.priority === 'high' ? 'H' : task.priority === 'medium' ? 'M' : 'L',
    risk_level: 'L',
    due_date: new Date(task.dueDate).toISOString(),
    team: '',
    assignee: task.assignee?.email || '',
    assigneeId: task.assigneeId,  // Add assigneeId for filtering
    progress: task.status,
    notes: [],
    completed: task.status === 'completed',
    groups: [],
    building_id: buildingId,
  }));

  // Filter tasks
  const filteredTasks = tasksUI.filter(task => {
    const matchesAssignee = !filterByAssignee || task.assigneeId === filterByAssignee;
    const matchesSearch = !taskSearchTerm || 
      task.description.toLowerCase().includes(taskSearchTerm.toLowerCase());
    
    return matchesAssignee && matchesSearch;
  });

  const openTaskDialog = (task: TaskUI) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleAddTask = () => {
    setEditTaskId(undefined);
    setModalMode("create");
    setIsAddTaskModalOpen(true);
  };

  const handleEditTask = (task: TaskUI) => {
    setEditTaskId(task.id);
    setModalMode("edit");
    setIsAddTaskModalOpen(true);
  };
  
  // Find the actual task for editing
  const editTask = editTaskId ? tasks.find(t => t._id === editTaskId) : undefined;

  const getBreadcrumbs = () => (
    <nav className="text-sm mb-4">
      <ol className="list-none p-0 inline-flex">
        <li className="flex items-center">
          <Link
            href={generateTenantRedirectUrl(tenantSlug, "/")}
            className="text-gray-500 hover:text-gray-700"
          >
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
        </li>
        <li className="flex items-center">
          <Link
            href={generateTenantRedirectUrl(tenantSlug, "/buildings")}
            className="text-gray-500 hover:text-gray-700"
          >
            Buildings
          </Link>
          <span className="mx-2 text-gray-400">/</span>
        </li>
        <li className="text-gray-700">{buildingWithRelations.name}</li>
      </ol>
    </nav>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "tasks":
        return (
          <div className="mt-6">
            <TaskFilters
              taskSearchTerm={taskSearchTerm}
              setTaskSearchTerm={setTaskSearchTerm}
              filterByTeam=""
              setFilterByTeam={() => {}}
              filterByAssignee={filterByAssignee}
              setFilterByAssignee={setFilterByAssignee}
              uniqueTeams={[]}
              uniqueAssignees={users.map((u: any) => u?._id || '')}
              onAddNewTask={handleAddTask}
            />
            <TaskTable
              tasks={filteredTasks}
              onTaskClick={openTaskDialog}
              onTaskEdit={handleEditTask}
            />
          </div>
        );
      case "documents":
        return (
          <div className="mt-6">
            <DocumentsTab building={buildingWithRelations} tenant={tenant} />
          </div>
        );
      case "contacts":
        return (
          <div className="mt-6">
            <ContactsTab building={buildingWithRelations} />
          </div>
        );
      case "notes":
        return (
          <div className="mt-6">
            <NotesTab building={buildingWithRelations} />
          </div>
        );
      case "year-planner":
        return (
          <div className="mt-6">
            <YearPlannerTab building={buildingWithRelations} />
          </div>
        );
      default:
        return (
          <div className="mt-6">
            <BuildingInfo
              building={buildingWithRelations}
              divisions={divisions}
              tenantSlug={tenantSlug}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {getBreadcrumbs()}
        
        {/* Building Header */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex items-start p-6">
            <div className="relative w-32 h-32 mr-6 bg-gray-100 rounded-lg overflow-hidden">
              {buildingWithRelations.image ? (
                <Image
                  src={getFileUrl(tenant.slug, buildingWithRelations.image)}
                  alt={buildingWithRelations.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{buildingWithRelations.name}</h1>
              {buildingWithRelations.divisionEntity && (
                <p className="text-gray-600 mt-1">Division: {buildingWithRelations.divisionEntity.name}</p>
              )}
              <div className="flex items-center mt-4 space-x-6">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Compliance:</span>
                  <span className={`text-lg font-semibold ${
                    compliancePercentage >= 75 ? 'text-green-600' : 
                    compliancePercentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {compliancePercentage}%
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Active Tasks:</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {tasks.filter(t => t.status !== 'completed').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          taskCount={tasks.filter(t => t.status !== 'completed').length} 
        />

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {renderTabContent()}
        </div>
      </div>


      {/* Task Modal */}
      <TaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => {
          setIsAddTaskModalOpen(false);
          setEditTaskId(undefined);
        }}
        onSave={(taskData) => {
          // TODO: Implement save functionality
          console.log('Save task:', taskData);
          setIsAddTaskModalOpen(false);
        }}
        templateData={editTask ? {
          description: editTask.description,
          dueDate: editTask.dueDate.toString(),
          priority: editTask.priority,
          building: buildingWithRelations._id,
        } : {
          building: buildingWithRelations._id,
        }}
      />
    </div>
  );
}