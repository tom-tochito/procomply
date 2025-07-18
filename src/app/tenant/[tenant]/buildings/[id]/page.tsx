import BuildingDetails from "@/features/buildings/components/BuildingDetails";
import Link from "next/link";
import Image from "next/image";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import { getBuildingById } from "@/features/buildings/repository/buildings.repository";
import { requireAuth } from "@/features/auth/repository/auth.repository";
import { getFileUrl } from "@/common/utils/file";
import { dbAdmin } from "~/lib/db-admin";

interface BuildingDetailsPageProps {
  params: Promise<{
    tenant: string;
    id: string;
  }>;
}

export default async function BuildingDetailsPage({
  params,
}: BuildingDetailsPageProps) {
  const { tenant, id } = await params;

  // Require authentication
  await requireAuth(tenant);

  // Fetch building from InstantDB
  const building = await getBuildingById(id);

  if (!building) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Building not found
            </h1>
            <Link
              href={generateTenantRedirectUrl(tenant, "/buildings")}
              className="mt-4 inline-block text-blue-600 hover:text-blue-800"
            >
              Back to Buildings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fetch users for assignee dropdown
  let users: Array<{ id: string; email: string }> = [];
  if (building.tenant?.id) {
    const result = await dbAdmin.query({
      $users: {
        $: {
          where: { "tenant.id": building.tenant.id },
        },
      },
    });
    users = result.$users || [];
  }

  // Transform building image URL to use file service
  const buildingWithImageUrl = {
    ...building,
    image: building.image ? getFileUrl(tenant, building.image) : undefined,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-3 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">
        {/* Building header with image */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Building image */}
            {buildingWithImageUrl.image && (
              <div className="relative h-48 w-full md:w-64 rounded-lg overflow-hidden md:flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent z-10" />
                <Image
                  src={buildingWithImageUrl.image}
                  alt={buildingWithImageUrl.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}

            <div className="flex flex-col justify-between py-2 space-y-4 md:space-y-0">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                  {buildingWithImageUrl.name}
                </h1>
                <div className="flex flex-wrap items-center text-sm text-gray-600 mt-1">
                  <Link
                    href={generateTenantRedirectUrl(tenant, "/dashboard")}
                    className="hover:text-blue-600"
                  >
                    <span>Home</span>
                  </Link>
                  <span className="mx-2">/</span>
                  <Link
                    href={generateTenantRedirectUrl(tenant, "/buildings")}
                    className="hover:text-blue-600"
                  >
                    <span>Buildings</span>
                  </Link>
                  <span className="mx-2">/</span>
                  <span>{buildingWithImageUrl.city}</span>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {buildingWithImageUrl.address}, {buildingWithImageUrl.city},{" "}
                  {buildingWithImageUrl.state} {buildingWithImageUrl.zipCode}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600">Rem. compliance:</div>
                <div className="text-xl font-bold text-[#F30]">100%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Building details component */}
        <div className="max-w-7xl mx-auto">
          <BuildingDetails
            building={buildingWithImageUrl}
            tenant={tenant}
            users={users}
          />
        </div>
      </div>
    </div>
  );
}
