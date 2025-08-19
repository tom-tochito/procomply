import { findTenantBySlug } from "@/features/tenant/repository/tenant.repository";
import TaskManagement from "@/features/tasks/components/TaskManagement";

export default async function TaskPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: tenantSlug } = await params;
  
  const tenant = await findTenantBySlug(tenantSlug);
  if (!tenant) {
    throw new Error("Tenant not found");
  }

  return (
    <div className="p-6">
      <TaskManagement tenant={tenant} />
    </div>
  );
}