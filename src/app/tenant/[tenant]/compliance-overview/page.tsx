import Link from "next/link";
import { generateTenantRedirectUrl } from "@/utils/tenant";
import ComplianceOverview from "@/features/compliance/components/ComplianceOverview";

const mockBuildings = [
  {
    id: "40003",
    name: "Westcott Park (LEASEHOLD)",
    location: "Acton",
    compliance: "38%",
    pm: "MM",
    annualFlatDoor: { date: "30/04/2024", status: "warning" },
    asbestosReinspections: { date: "", status: "" },
    asbestosSurveys: { date: "20/03/2018", status: "success" },
    fireAlarmTesting: { date: "20/03/2018", status: "success" },
    fireRiskAssessment: { date: "", status: "" },
    hsMonthlyVisit: { date: "", status: "" },
    hsRiskAssessment: { date: "20/03/2018", status: "success" },
    legionellaRisk: { date: "24/07/2019", status: "success" },
  },
  {
    id: "40004",
    name: "Meredith Mews (LEASEHOLD)",
    location: "Brockley",
    compliance: "75%",
    pm: "SW",
    annualFlatDoor: { date: "", status: "" },
    asbestosReinspections: { date: "", status: "" },
    asbestosSurveys: { date: "", status: "" },
    fireAlarmTesting: { date: "", status: "" },
    fireRiskAssessment: { date: "03/07/2022", status: "success" },
    hsMonthlyVisit: { date: "", status: "" },
    hsRiskAssessment: { date: "", status: "" },
    legionellaRisk: { date: "", status: "" },
  },
  {
    id: "40005",
    name: "Lambert Court",
    location: "Bushey",
    compliance: "70%",
    pm: "AM",
    annualFlatDoor: { date: "", status: "" },
    asbestosReinspections: { date: "", status: "" },
    asbestosSurveys: { date: "06/03/2018", status: "success" },
    fireAlarmTesting: { date: "", status: "" },
    fireRiskAssessment: { date: "18/03/2022", status: "success" },
    hsMonthlyVisit: { date: "", status: "" },
    hsRiskAssessment: { date: "02/11/2022", status: "success" },
    legionellaRisk: { date: "26/03/2021", status: "success" },
  },
  {
    id: "40006",
    name: "Hillgate Place (LEASEHOLD)",
    location: "Clapham",
    compliance: "100%",
    pm: "LV",
    annualFlatDoor: { date: "", status: "" },
    asbestosReinspections: { date: "", status: "" },
    asbestosSurveys: { date: "", status: "" },
    fireAlarmTesting: { date: "", status: "" },
    fireRiskAssessment: { date: "04/07/2022", status: "success" },
    hsMonthlyVisit: { date: "", status: "" },
    hsRiskAssessment: { date: "", status: "" },
    legionellaRisk: { date: "", status: "" },
  },
  {
    id: "40007",
    name: "Camfrey Court",
    location: "Crouch End",
    compliance: "76%",
    pm: "AS",
    annualFlatDoor: { date: "28/03/2024", status: "warning" },
    asbestosReinspections: { date: "", status: "" },
    asbestosSurveys: { date: "27/02/2018", status: "success" },
    fireAlarmTesting: { date: "", status: "" },
    fireRiskAssessment: { date: "10/04/2018", status: "success" },
    hsMonthlyVisit: { date: "", status: "" },
    hsRiskAssessment: { date: "26/01/2022", status: "success" },
    legionellaRisk: { date: "27/08/2020", status: "success" },
  },
];

interface ComplianceOverviewPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function ComplianceOverviewPage({
  params,
}: ComplianceOverviewPageProps) {
  const { tenant } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Compliance Overview
          </h1>
          <div className="flex items-center text-sm text-gray-600 mt-2">
            <Link
              href={generateTenantRedirectUrl(tenant, "/dashboard")}
              className="hover:text-blue-600"
            >
              <span>Home</span>
            </Link>
            <span className="mx-2">/</span>
            <span>Compliance Overview</span>
          </div>
        </div>

        <ComplianceOverview initialBuildings={mockBuildings} tenant={tenant} />
      </div>
    </div>
  );
}
