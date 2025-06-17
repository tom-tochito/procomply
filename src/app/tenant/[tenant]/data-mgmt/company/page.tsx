import Link from "next/link";
import { companies } from "@/data/companies";
import { generateTenantRedirectUrl } from "@/utils/tenant";
import CompanyManagement from "@/features/data-mgmt/components/CompanyManagement";

interface CompanyPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { tenant } = await params;

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

        <CompanyManagement initialCompanies={companies} tenant={tenant} />
      </div>
    </div>
  );
}
