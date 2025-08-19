import { findTenantBySlug } from "@/features/tenant/repository/tenant.repository";
import UnifiedTemplateManagement from "@/features/templates/components/UnifiedTemplateManagement";

interface TaskTemplatePageProps {
  params: Promise<{ tenant: string }>;
}

export default async function TaskTemplatePage({ params }: TaskTemplatePageProps) {
  const { tenant: tenantSlug } = await params;

  const tenant = await findTenantBySlug(tenantSlug);
  if (!tenant) {
    throw new Error("Tenant not found");
  }

  return (
    <div className="p-6">
      <UnifiedTemplateManagement tenantId={tenant._id} entityType="task" />
    </div>
  );
}