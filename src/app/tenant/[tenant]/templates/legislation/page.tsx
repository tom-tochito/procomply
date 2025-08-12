import { findTenantBySlug } from "@/features/tenant/repository/tenant.repository";
import LegislationManagementDB from "@/features/templates/components/LegislationManagementDB";

interface LegislationPageProps {
  params: Promise<{ tenant: string }>;
}

export default async function LegislationPage({ params }: LegislationPageProps) {
  const { tenant: tenantSlug } = await params;

  const tenant = await findTenantBySlug(tenantSlug);
  if (!tenant) {
    throw new Error("Tenant not found");
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LegislationManagementDB tenant={tenant} />
      </div>
    </div>
  );
}