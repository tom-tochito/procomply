import Link from "next/link";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import BuildingsList from "@/features/buildings/components/BuildingsList";
import { getBuildingsWithComplianceStats } from "@/features/buildings/repository/buildings.repository";
import { getDivisionsByTenant } from "@/features/divisions/repository/divisions.repository";
import { requireAuth } from "@/features/auth/repository/auth.repository";
import { findTenantBySlug } from "@/features/tenant/repository/tenant.repository";
import { BuildingWithStats } from "@/features/buildings/models";
import { getFileUrl } from "@/common/utils/file";

interface BuildingsPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function BuildingsPage({ params }: BuildingsPageProps) {
  const { tenant } = await params;

  // Require authentication
  await requireAuth(tenant);

  // Get tenant data
  const tenantData = await findTenantBySlug(tenant);
  if (!tenantData) {
    throw new Error("Tenant not found");
  }

  // Fetch buildings from InstantDB
  const buildings = await getBuildingsWithComplianceStats(tenantData);

  // Fetch divisions from InstantDB
  const divisionsData = await getDivisionsByTenant(tenantData);

  // Transform buildings to match expected format
  const transformedBuildings: BuildingWithStats[] = buildings.map(
    (building) => ({
      ...building,
      image: building.image ? getFileUrl(tenant, building.image) : undefined,
      division:
        building.divisionEntity?.name || building.division || "Unassigned",
      status: "Active",
      compliance:
        building.taskStats.total > 0
          ? Math.round(
              (building.taskStats.completed / building.taskStats.total) * 100
            )
          : 100,
      inbox: { urgent: 0, warning: 0, email: false }, // Default values for now
    })
  );

  // Get unique divisions from database
  const divisionNames = [
    "Active Divisions",
    ...divisionsData.map((d) => d.name),
    "Archived",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title and breadcrumbs */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Buildings
          </h1>
          <div className="flex items-center text-sm text-gray-600 mt-2">
            <Link
              href={generateTenantRedirectUrl(tenant, "/dashboard")}
              className="hover:text-blue-600"
            >
              <span>Data Management</span>
            </Link>
            <span className="mx-2">/</span>
            <span>Buildings</span>
          </div>
        </div>

        {/* Buildings list component */}
        <BuildingsList
          initialBuildings={transformedBuildings}
          divisions={divisionNames}
          divisionsData={divisionsData}
          tenant={tenantData}
        />
      </div>
    </div>
  );
}
