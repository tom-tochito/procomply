import RiskAreaManagement from "@/features/template-mgmt/components/RiskAreaManagement";
import { initialRiskAreas } from "@/data/template-mgmt/riskAreas";

interface RiskAreaPageProps {
  params: Promise<{ tenant: string }>;
}

export default async function RiskAreaPage({ params }: RiskAreaPageProps) {
  await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RiskAreaManagement initialRiskAreas={initialRiskAreas} />
      </div>
    </div>
  );
}