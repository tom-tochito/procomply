import { requireAuth } from "@/features/auth";
import { findTenantBySlug } from "@/features/tenant/repository/tenant.repository";
import TaskTemplateManagement from "@/features/templates/components/TaskTemplateManagement";

interface TaskTemplatePageProps {
  params: Promise<{ tenant: string }>;
}

export default async function TaskTemplatePage({ params }: TaskTemplatePageProps) {
  const { tenant: tenantSlug } = await params;

  const tenant = await findTenantBySlug(tenantSlug);
  if (!tenant) {
    throw new Error("Tenant not found");
  }

  await requireAuth(tenant);

  return <TaskTemplateManagement tenant={tenant} />;
}