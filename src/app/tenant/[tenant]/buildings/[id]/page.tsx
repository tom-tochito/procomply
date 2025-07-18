import BuildingDetails from "@/features/buildings/components/BuildingDetails";
import { requireAuth } from "@/features/auth";
import { findTenantBySlug } from "@/features/tenant/repository/tenant.repository";

interface BuildingDetailsPageProps {
  params: Promise<{
    tenant: string;
    id: string;
  }>;
}

export default async function BuildingDetailsPage({
  params,
}: BuildingDetailsPageProps) {
  const { tenant: tenantSlug, id } = await params;

  // Get tenant data
  const tenant = await findTenantBySlug(tenantSlug);
  if (!tenant) {
    throw new Error("Tenant not found");
  }

  // Require authentication
  await requireAuth(tenant);

  return (
    <BuildingDetails
      buildingId={id}
      tenant={tenant}
      tenantSlug={tenantSlug}
    />
  );
}
