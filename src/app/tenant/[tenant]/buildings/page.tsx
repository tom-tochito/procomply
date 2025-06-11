import Link from "next/link";
import Header from "@/common/components/Header";
import { buildings as initialBuildings, divisions } from "@/data/buildings";
import { generateTenantRedirectUrl } from "@/utils/tenant";
import BuildingsList from "@/features/buildings/components/BuildingsList";

interface BuildingsPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function BuildingsPage({ params }: BuildingsPageProps) {
  const { tenant } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top header with logo and user info */}
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title and breadcrumbs */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Buildings
          </h1>
          <div className="flex items-center text-sm text-gray-600 mt-2">
            <Link
              href={generateTenantRedirectUrl(tenant, "dashboard")}
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
          initialBuildings={initialBuildings}
          divisions={divisions}
          tenant={tenant}
        />
      </div>
    </div>
  );
}
