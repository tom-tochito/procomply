import Link from "next/link";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import PersonManagement from "@/features/data-mgmt/components/PersonManagement";
import { findUsersWithProfilesByTenant } from "@/features/user/repository/user.repository";
import { requireAuth } from "@/features/auth";
import { findTenantBySlug } from "@/features/tenant/repository/tenant.repository";
import { getCompaniesByTenant } from "@/features/companies/repository/companies.repository";

interface PersonPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { tenant } = await params;

  // Get tenant data
  const tenantData = await findTenantBySlug(tenant);
  if (!tenantData) {
    throw new Error("Tenant not found");
  }

  // Require authentication
  await requireAuth(tenantData);

  // Fetch persons (users with profiles) and companies from InstantDB
  const [personsFromDB, companies] = await Promise.all([
    findUsersWithProfilesByTenant(tenantData.id),
    getCompaniesByTenant(tenantData),
  ]);

  // Transform to match component expectations
  const persons = personsFromDB.map((user) => ({
    id: user.id,
    name: user.profile?.name || user.email,
    company: '', // Company relation will be added later
    role: user.profile?.position || '',
    email: user.email,
    phone: user.profile?.phone || '',
    mobile: user.profile?.phoneMobile || '',
    category: 'internal' as const, // Default category
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Person
          </h1>
          <div className="flex items-center text-sm text-gray-600 mt-2">
            <Link
              href={generateTenantRedirectUrl(tenant, "/data-mgmt")}
              className="hover:text-blue-600"
            >
              <span>Data Mgmt</span>
            </Link>
            <span className="mx-2">/</span>
            <span>Person</span>
          </div>
        </div>

        <PersonManagement initialPersons={persons} tenant={tenantData} companies={companies} />
      </div>
    </div>
  );
}