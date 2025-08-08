import { requireAuth } from "@/features/auth";
import { findTenantBySlug } from "@/features/tenant/repository/tenant.repository";
import GenericTemplateManagement from "@/features/template-mgmt/components/GenericTemplateManagement";

interface RiskAreaPageProps {
  params: Promise<{ tenant: string }>;
}

export default async function RiskAreaPage({ params }: RiskAreaPageProps) {
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
          entityName="Risk Area"
          entityNamePlural="Risk Areas"
          entityType="riskAreas"
        />
      </div>
    </div>
  );
}