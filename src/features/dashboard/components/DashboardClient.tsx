"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Tenant } from "@/features/tenant/models";
import SummaryCard from "./SummaryCard";
import TaskChart from "./TaskChart";
import ActivityFeed from "./ActivityFeed";
import UpcomingInspections from "./UpcomingInspections";
import ComplianceStatus from "./ComplianceStatus";
import QuickActions from "./QuickActions";

interface DashboardClientProps {
  tenant: Tenant;
}

export default function DashboardClient({ tenant }: DashboardClientProps) {
  const tenantId = tenant._id as Id<"tenants">;

  // Fetch dashboard data from Convex
  const buildings = useQuery(api.buildings.getBuildings, {}) || [];
  const tasks = useQuery(api.tasks.getTasks, {}) || [];
  const divisions = useQuery(api.divisions.getDivisions, {}) || [];
  const inspections = useQuery(api.inspections.getInspections, {}) || [];
  const documents = useQuery(api.documents.getDocuments, {}) || [];
  const complianceChecks = useQuery(api.complianceChecks.getComplianceChecks, {}) || [];

  // Calculate statistics
  const totalBuildings = buildings.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const outstandingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Group tasks by division
  const tasksByDivision: Record<string, { total: number; completed: number; inProgress: number; notStarted: number; onHold: number }> = {};
  
  divisions.forEach((division) => {
    // Get buildings that belong to this division
    const divisionBuildings = buildings.filter(b => b.divisionId === division._id);
    const divisionBuildingIds = divisionBuildings.map(b => b._id);
    
    const divisionTasks = tasks.filter(
      (task) => task.buildingId && divisionBuildingIds.includes(task.buildingId)
    );

    tasksByDivision[division.name] = {
      total: divisionTasks.length,
      completed: divisionTasks.filter((t) => t.status === "completed").length,
      inProgress: divisionTasks.filter((t) => t.status === "in_progress").length,
      notStarted: divisionTasks.filter((t) => t.status === "pending").length,
      onHold: divisionTasks.filter((t) => t.status === "on_hold").length,
    };
  });

  // Activity feed data
  const docActivities = documents.slice(0, 3).map((doc) => ({
    id: doc._id,
    type: "document" as const,
    title: doc.name,
    message: `${doc.uploaderId ? "User" : "Someone"} uploaded ${doc.name}`,
    time: new Date(doc.uploadedAt).toLocaleString(),
    location: doc.buildingId ? buildings.find(b => b._id === doc.buildingId)?.name || "Unknown building" : "No building",
    building: doc.buildingId ? buildings.find(b => b._id === doc.buildingId)?.name : undefined,
  }));
  
  const taskActivities = tasks.slice(0, 3).map((task) => ({
    id: task._id,
    type: "task" as const,
    title: task.title,
    message: `Task "${task.title}" was ${task.status}`,
    time: new Date(task.updatedAt).toLocaleString(),
    location: task.buildingId ? buildings.find(b => b._id === task.buildingId)?.name || "Unknown building" : "No building",
    building: task.buildingId ? buildings.find(b => b._id === task.buildingId)?.name : undefined,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Buildings"
          value={totalBuildings}
          subtitle="Active buildings"
          accentColor="border-blue-500"
        />
        <SummaryCard
          title="Outstanding Tasks"
          value={outstandingTasks}
          subtitle="Tasks pending completion"
          accentColor="border-yellow-500"
        />
        <SummaryCard
          title="Completed Tasks"
          value={completedTasks}
          subtitle="Tasks completed"
          accentColor="border-green-500"
        />
        <SummaryCard
          title="Completion Rate"
          value={`${completionRate.toFixed(0)}%`}
          subtitle="Overall task completion"
          accentColor="border-purple-500"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - 8 cols */}
        <div className="lg:col-span-8 space-y-6">
          <TaskChart 
            data={{
              labels: Object.keys(tasksByDivision),
              datasets: [
                {
                  label: 'Completed',
                  data: Object.values(tasksByDivision).map(d => d.completed),
                  backgroundColor: 'rgba(34, 197, 94, 0.8)',
                },
                {
                  label: 'In Progress',
                  data: Object.values(tasksByDivision).map(d => d.inProgress),
                  backgroundColor: 'rgba(59, 130, 246, 0.8)',
                },
                {
                  label: 'Not Started',
                  data: Object.values(tasksByDivision).map(d => d.notStarted),
                  backgroundColor: 'rgba(156, 163, 175, 0.8)',
                },
                {
                  label: 'On Hold',
                  data: Object.values(tasksByDivision).map(d => d.onHold),
                  backgroundColor: 'rgba(251, 146, 60, 0.8)',
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: true,
                  text: 'Tasks by Division',
                },
              },
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true,
                },
              },
            }}
          />
          <UpcomingInspections inspections={inspections as any} tenant={tenant.slug} />
        </div>

        {/* Right Column - 4 cols */}
        <div className="lg:col-span-4 space-y-6">
          <QuickActions tenant={tenant.slug} />
          <ComplianceStatus complianceChecks={complianceChecks as any} tenant={tenant.slug} />
          <ActivityFeed jobActivities={[]} taskActivities={taskActivities} docActivities={docActivities} />
        </div>
      </div>
    </div>
  );
}