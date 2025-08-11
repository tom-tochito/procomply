import { requireAuth } from "@/features/auth";
import { getTenantBySlug } from "@/features/tenant/utils/get-tenant";
import DashboardClient from "@/features/dashboard/components/DashboardClient";

interface DashboardPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { tenant } = await params;
  
  // Get tenant data first
  const tenantData = await getTenantBySlug(tenant);
  
  await requireAuth(tenantData);

  return <DashboardClient tenant={tenantData} />;
}