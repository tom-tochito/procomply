import Link from "next/link";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import TeamManagement from "@/features/data-mgmt/components/TeamManagement";
import { getTeamsByTenant } from "@/features/teams/repository/teams.repository";
import { requireAuth } from "@/features/auth";
import { findTenantBySlug } from "@/features/tenant/repository/tenant.repository";
import { getCompaniesByTenant } from "@/features/companies/repository/companies.repository";
import { findUsersByTenant } from "@/features/user/repository/user.repository";

interface TeamPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { tenant } = await params;

  // Get tenant data
  const tenantData = await findTenantBySlug(tenant);
  if (!tenantData) {
    throw new Error("Tenant not found");
  }

  // Require authentication
  await requireAuth(tenantData);

  // Fetch teams, companies and supervisors from InstantDB
  const [teamsFromDB, companies, supervisors] = await Promise.all([
    getTeamsByTenant(tenantData),
    getCompaniesByTenant(tenantData),
    findUsersByTenant(tenantData.id),
  ]);
  
  // Transform to match component expectations
  const teams = teamsFromDB.map((team, index) => ({
    id: index + 1, // Component expects number id
    code: team.code || '',
    description: team.description,
    company: team.company?.name || '',
    supervisor: team.supervisor?.name || '',
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Team</h1>
          <div className="flex items-center text-sm text-gray-600 mt-2">
            <Link
              href={generateTenantRedirectUrl(tenant, "/data-mgmt")}
              className="hover:text-blue-600"
            >
              <span>Data Mgmt</span>
            </Link>
            <span className="mx-2">/</span>
            <span>Team</span>
          </div>
        </div>

        <TeamManagement 
          initialTeams={teams} 
          tenant={tenantData} 
          companies={companies}
          supervisors={supervisors}
        />
      </div>
    </div>
  );
}
