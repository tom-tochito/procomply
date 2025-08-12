import { findTenantBySlug } from "@/features/tenant/repository/tenant.repository";
// TODO: Migrate TaskTemplateManagement from InstantDB to Convex
// import TaskTemplateManagement from "@/features/templates/components/TaskTemplateManagement";

interface TaskTemplatePageProps {
  params: Promise<{ tenant: string }>;
}

export default async function TaskTemplatePage({ params }: TaskTemplatePageProps) {
  const { tenant: tenantSlug } = await params;

  const tenant = await findTenantBySlug(tenantSlug);
  if (!tenant) {
    throw new Error("Tenant not found");
  }


  // TODO: Migrate TaskTemplateManagement from InstantDB to Convex
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Task Templates</h1>
      <p className="text-gray-600">Task template management is currently being migrated to the new system.</p>
    </div>
  );
}