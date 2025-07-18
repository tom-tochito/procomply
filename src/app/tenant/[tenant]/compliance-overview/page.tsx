import Link from "next/link";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import ComplianceOverviewClient from "@/features/compliance/components/ComplianceOverviewClient";
import { findTenantBySlug } from "@/features/tenant/repository/tenant.repository";

interface ComplianceOverviewPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function ComplianceOverviewPage({
  params,
}: ComplianceOverviewPageProps) {
  const { tenant } = await params;
  
  // Only fetch tenant on server (exception as per rule)
  const tenantEntity = await findTenantBySlug(tenant);
  if (!tenantEntity) {
    return <div>Tenant not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Compliance Overview
          </h1>
          <div className="flex items-center text-sm text-gray-600 mt-2">
            <Link
              href={generateTenantRedirectUrl(tenant, "/dashboard")}
              className="hover:text-blue-600"
            >
              <span>Home</span>
            </Link>
            <span className="mx-2">/</span>
            <span>Compliance Overview</span>
          </div>
        </div>

        <ComplianceOverviewClient 
          tenant={tenantEntity}
        />
      </div>
    </div>
  );
}
