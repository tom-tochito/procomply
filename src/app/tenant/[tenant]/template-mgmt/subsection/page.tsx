import { requireAuth } from "@/features/auth";
import { findTenantBySlug } from "@/features/tenant/repository/tenant.repository";
import GenericTemplateManagement from "@/features/template-mgmt/components/GenericTemplateManagement";

interface SubsectionPageProps {
  params: Promise<{ tenant: string }>;
}

export default async function SubsectionPage({ params }: SubsectionPageProps) {
  const { tenant: tenantSlug } = await params;

  const tenant = await findTenantBySlug(tenantSlug);
  if (!tenant) {
    throw new Error("Tenant not found");
  }

  await requireAuth(tenant);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GenericTemplateManagement
          tenant={tenant}
          entityName="Subsection"
          entityNamePlural="Subsections"
          entityType="subsections"
        />
      </div>
    </div>
  );
}