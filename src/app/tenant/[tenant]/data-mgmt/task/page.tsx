import Link from "next/link";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import TaskManagementNew from "@/features/tasks/components/TaskManagementNew";
import { requireAuth } from "@/features/auth/repository/auth.repository";
import { findTenantBySlug } from "@/features/tenant/repository/tenant.repository";
import { getBuildingsByTenant } from "@/features/buildings/repository/buildings.repository";
import { dbAdmin } from "~/lib/db-admin";

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
  
  // Fetch buildings for the dropdown
  const buildings = await getBuildingsByTenant(tenantData);
  
  // Fetch users for assignee dropdown
  const result = await dbAdmin.query({
    "$users": {
      $: {
        where: { "tenant.id": tenantData.id }
      }
    }
  });
  const users = result.$users || [];
  

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

        <TaskManagementNew 
          tenant={tenant} 
          tenantId={tenantData.id}
          buildings={buildings}
          users={users}
        />
      </div>
    </div>
  );
}
