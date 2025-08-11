import { requireAuth } from "@/features/auth";
import { findTenantBySlug } from "@/features/tenant/repository/tenant.repository";
// TODO: Migrate TemplateManagement from InstantDB to Convex
// import TemplateManagement from "@/features/templates/components/TemplateManagement";

export default async function TemplatesPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: tenantSlug } = await params;
  
  // Get tenant data
  const tenant = await findTenantBySlug(tenantSlug);
  if (!tenant) {
    throw new Error("Tenant not found");
  }

  await requireAuth(tenant);

  // TODO: Migrate TemplateManagement from InstantDB to Convex
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Templates</h1>
      <p className="text-gray-600">Template management is currently being migrated to the new system.</p>
    </div>
  );
}