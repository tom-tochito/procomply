import LegislationManagement from "@/features/template-mgmt/components/LegislationManagement";
import { initialLegislation } from "@/data/template-mgmt/legislation";

interface LegislationPageProps {
  params: Promise<{ tenant: string }>;
}

export default async function LegislationPage({ params }: LegislationPageProps) {
  await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LegislationManagement initialLegislation={initialLegislation} />
      </div>
    </div>
  );
}