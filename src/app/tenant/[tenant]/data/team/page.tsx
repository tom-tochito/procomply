import Link from "next/link";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import TeamManagement from "@/features/teams/components/TeamManagement";
import { getTenantBySlug } from "~/src/features/tenant/utils/get-tenant";

export default async function TeamPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: tenantSlug } = await params;
  const tenant = await getTenantBySlug(tenantSlug);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Navigation */}
        <div className="mb-8">
          <nav className="text-sm mb-4">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                <Link
                  href={generateTenantRedirectUrl(tenantSlug, "/")}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Home
                </Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="flex items-center">
                <Link
                  href={generateTenantRedirectUrl(tenantSlug, "/data-mgmt")}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Data Management
                </Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700">Team</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
        </div>

        {/* Team Management Component */}
        <TeamManagement tenant={tenant} />
      </div>
    </div>
  );
}