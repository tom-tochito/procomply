"use client";

import Link from "next/link";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import CompanyManagement from "@/features/companies/components/CompanyManagement";
import { useParams } from "next/navigation";

export default function CompanyPage() {
  const params = useParams();
  const tenant = params.tenant as string;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Navigation */}
        <div className="mb-8">
          <nav className="text-sm mb-4">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                <Link
                  href={generateTenantRedirectUrl(tenant, "/")}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Home
                </Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="flex items-center">
                <Link
                  href={generateTenantRedirectUrl(tenant, "/data-mgmt")}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Data Management
                </Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700">Company</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Company Management</h1>
        </div>

        {/* Company Management Component */}
        <CompanyManagement />
      </div>
    </div>
  );
}