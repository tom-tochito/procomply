"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Tenant } from "@/features/tenant/models";
import SummaryCard from "./SummaryCard";
import QuickActions from "./QuickActions";

interface DashboardClientProps {
  tenant: Tenant;
}

export default function DashboardClient({ tenant }: DashboardClientProps) {
  const tenantId = tenant._id as Id<"tenants">;

  // Fetch dashboard data from Convex
  const buildings = useQuery(api.buildings.getBuildings, { tenantId }) || [];
  const tasks = useQuery(api.tasks.getTasks, { tenantId }) || [];
  const documents = useQuery(api.documents.getDocuments, { tenantId }) || [];

  // Calculate statistics
  const totalBuildings = buildings.length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;
  const totalDocuments = documents.length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Buildings"
          value={totalBuildings}
          subtitle="Total buildings"
          accentColor="border-blue-500"
        />
        <SummaryCard
          title="Pending Tasks"
          value={pendingTasks}
          subtitle="Tasks to complete"
          accentColor="border-yellow-500"
        />
        <SummaryCard
          title="Completed Tasks"
          value={completedTasks}
          subtitle="Tasks done"
          accentColor="border-green-500"
        />
        <SummaryCard
          title="Documents"
          value={totalDocuments}
          subtitle="Total documents"
          accentColor="border-purple-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <QuickActions tenant={tenant.slug} />
      </div>
    </div>
  );
}