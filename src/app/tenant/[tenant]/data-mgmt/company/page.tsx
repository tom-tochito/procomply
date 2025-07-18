import Link from "next/link";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import CompanyManagement from "@/features/data-mgmt/components/CompanyManagement";
import { getCompaniesByTenant } from "@/features/companies/repository/companies.repository";
import { requireAuth } from "@/features/auth";
import { findTenantBySlug } from "@/features/tenant/repository/tenant.repository";

interface CompanyPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { tenant } = await params;

  // Get tenant data
  const tenantData = await findTenantBySlug(tenant);
  if (!tenantData) {
    throw new Error("Tenant not found");
  }

  // Require authentication
  await requireAuth(tenantData);

  // Fetch companies from InstantDB
  const companiesFromDB = await getCompaniesByTenant(tenantData);
  
  // Transform to match component expectations
  const companies = companiesFromDB.map((company) => ({
    id: company.id,
    name: company.name,
    referral: company.referral,
    category: company.category || '',
    email: company.email || null,
    phone: company.phone || null,
    postcode: company.postcode || null,
    number_of_employees: company.numberOfEmployees || null,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Company
          </h1>
          <div className="flex items-center text-sm text-gray-600 mt-2">
            <Link
              href={generateTenantRedirectUrl(tenant, "/dashboard")}
              className="hover:text-blue-600"
            >
              <span>Data Mgmt</span>
            </Link>
            <span className="mx-2">/</span>
            <span>Company</span>
          </div>
        </div>

        <CompanyManagement initialCompanies={companies} tenant={tenantData} />
      </div>
    </div>
  );
}
