import Link from "next/link";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import TeamManagement from "@/features/data-mgmt/components/TeamManagement";

const mockTeams = [
  {
    id: 1,
    code: "",
    description: "Akelius Residential Ltd",
    company: "Akelius",
    supervisor: "",
  },
  {
    id: 2,
    code: "",
    description: "ASAP Comply Ltd",
    company: "ASAP Comply",
    supervisor: "",
  },
];

interface TeamPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { tenant } = await params;

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

        <TeamManagement initialTeams={mockTeams} tenant={tenant} />
      </div>
    </div>
  );
}
