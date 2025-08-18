import Link from "next/link";
import { notFound } from "next/navigation";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import PersonManagement from "@/features/users/components/PersonManagement";
import { findTenantBySlug } from "@/features/tenant/repository";

interface PageProps {
  params: Promise<{ tenant: string }>;
}

export default async function PersonPage({ params }: PageProps) {
  const { tenant: slug } = await params;
  
  const tenant = await findTenantBySlug(slug);
  if (!tenant) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Navigation */}
        <div className="mb-8">
          <nav className="text-sm mb-4">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                <Link
                  href={generateTenantRedirectUrl(slug, "/")}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Home
                </Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="flex items-center">
                <Link
                  href={generateTenantRedirectUrl(slug, "/data-mgmt")}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Data Management
                </Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700">Person</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Person Management</h1>
        </div>

        {/* Person Management Component */}
        <PersonManagement tenant={tenant} />
      </div>
    </div>
  );
}