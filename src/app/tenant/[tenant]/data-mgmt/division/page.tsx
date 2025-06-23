import Link from "next/link";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import DivisionManagement from "@/features/data-mgmt/components/DivisionManagement";
import { getDivisionsByTenant } from "@/features/divisions/repository/divisions.repository";
import { requireAuth } from "@/features/auth/repository/auth.repository";
import { findTenantBySlug } from "@/features/tenant/repository/tenant.repository";

interface DivisionPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function DivisionPage({ params }: DivisionPageProps) {
  const { tenant } = await params;

  // Require authentication
  await requireAuth(tenant);

  // Get tenant data
  const tenantData = await findTenantBySlug(tenant);
  if (!tenantData) {
    throw new Error("Tenant not found");
  }

  // Fetch divisions from InstantDB
  const divisions = await getDivisionsByTenant(tenantData);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Division
          </h1>
          <div className="flex items-center text-sm text-gray-600 mt-2">
            <Link
              href={generateTenantRedirectUrl(tenant, "/dashboard")}
              className="hover:text-blue-600"
            >
              <span>Data Mgmt</span>
            </Link>
            <span className="mx-2">/</span>
            <span>Division</span>
          </div>
        </div>

        <DivisionManagement initialDivisions={divisions} tenant={tenantData} />
      </div>
    </div>
  );
}
