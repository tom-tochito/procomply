import Link from "next/link";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import DivisionManagement from "@/features/data-mgmt/components/DivisionManagement";

// Temporary divisions data - should be fetched from database
const divisions = [
  "Active Divisions",
  "Hampstead",
  "Ealing",
  "Camden",
  "Leased",
  "Archived",
];

interface DivisionPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function DivisionPage({ params }: DivisionPageProps) {
  const { tenant } = await params;

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

        <DivisionManagement initialDivisions={divisions} tenant={tenant} />
      </div>
    </div>
  );
}
