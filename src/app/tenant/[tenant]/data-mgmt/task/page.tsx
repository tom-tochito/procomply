import Link from "next/link";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import TaskManagement from "@/features/data-mgmt/components/TaskManagement";
import { getTasksByTenant } from "@/features/tasks/repository/tasks.repository";
import { requireAuth } from "@/features/auth/repository/auth.repository";
import { findTenantBySlug } from "@/features/tenant/repository/tenant.repository";

interface TaskPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function TaskPage({ params }: TaskPageProps) {
  const { tenant } = await params;

  // Require authentication
  await requireAuth(tenant);

  // Get tenant data
  const tenantData = await findTenantBySlug(tenant);
  if (!tenantData) {
    throw new Error("Tenant not found");
  }

  // Fetch tasks from InstantDB
  const tasksFromDB = await getTasksByTenant(tenantData);
  
  // Transform to match component expectations
  const tasks = tasksFromDB.map((task) => ({
    id: task.id,
    description: task.title,
    risk_area: "Fire", // Default as no risk area in schema
    priority: (task.priority?.charAt(0) || "M") as "H" | "M" | "L",
    risk_level: "M" as "H" | "M" | "L", // Default as no risk level in schema
    due_date: new Date(task.dueDate).toLocaleDateString('en-GB'),
    team: '', // No team association in current schema
    assignee: task.assignee?.email || '',
    progress: task.status,
    notes: [],
    completed: task.status === 'completed',
    groups: [],
    building_id: task.building?.id || '',
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Tasks
          </h1>
          <div className="flex items-center text-sm text-gray-600 mt-2">
            <Link
              href={generateTenantRedirectUrl(tenant, "/dashboard")}
              className="hover:text-blue-600"
            >
              <span>Data Mgmt</span>
            </Link>
            <span className="mx-2">/</span>
            <span>Task</span>
          </div>
        </div>

        <TaskManagement initialTasks={tasks} tenant={tenant} />
      </div>
    </div>
  );
}
