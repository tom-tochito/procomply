import { findTenantBySlug } from "@/features/tenant/repository/tenant.repository";
import BuildingTemplateManagement from "@/features/templates/components/BuildingTemplateManagement";

export default async function BuildingTemplatesPage({
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

  return (
    <div className="p-6">
      <BuildingTemplateManagement tenantId={tenant._id} />
    </div>
  );
}