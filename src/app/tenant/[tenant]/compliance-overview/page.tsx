import Link from "next/link";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import ComplianceOverview from "@/features/compliance/components/ComplianceOverview";
import { findTenantBySlug } from "@/features/tenant/repository/tenant.repository";
import { getBuildingsWithComplianceData } from "@/features/compliance/repository/compliance.repository";
import { COMPLIANCE_CHECK_TYPES } from "@/features/compliance/models";
import type { ComplianceCheck } from "@/features/compliance/models";
import { dbAdmin } from "~/lib/db-admin";

interface ComplianceOverviewPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function ComplianceOverviewPage({
  params,
}: ComplianceOverviewPageProps) {
  const { tenant } = await params;
  
  // Fetch tenant and buildings with compliance data
  const tenantEntity = await findTenantBySlug(tenant);
  if (!tenantEntity) {
    return <div>Tenant not found</div>;
  }

  const buildings = await getBuildingsWithComplianceData(tenantEntity.id);
  
  // Fetch divisions for filters
  const divisionsQuery = await dbAdmin.query({
    divisions: {
      $: {
        where: {
          "tenant.id": tenantEntity.id
        }
      }
    }
  });
  const divisions = divisionsQuery.divisions || [];
  
  // Transform buildings to match the component's expected format
  const formattedBuildings = buildings.map(building => {
    const complianceChecksByType = building.complianceChecksByType || {} as Record<string, ComplianceCheck | undefined>;
    
    return {
      id: building.id,
      name: building.name,
      location: building.city || "",
      compliance: `${building.compliance || 0}%`,
      pm: "", // Property Manager - not in schema yet
      annualFlatDoor: formatComplianceCheck(complianceChecksByType[COMPLIANCE_CHECK_TYPES.ANNUAL_FLAT_DOOR]),
      asbestosReinspections: formatComplianceCheck(complianceChecksByType[COMPLIANCE_CHECK_TYPES.ASBESTOS_REINSPECTIONS]),
      asbestosSurveys: formatComplianceCheck(complianceChecksByType[COMPLIANCE_CHECK_TYPES.ASBESTOS_SURVEYS]),
      fireAlarmTesting: formatComplianceCheck(complianceChecksByType[COMPLIANCE_CHECK_TYPES.FIRE_ALARM_TESTING]),
      fireRiskAssessment: formatComplianceCheck(complianceChecksByType[COMPLIANCE_CHECK_TYPES.FIRE_RISK_ASSESSMENT]),
      hsMonthlyVisit: formatComplianceCheck(complianceChecksByType[COMPLIANCE_CHECK_TYPES.HS_MONTHLY_VISIT]),
      hsRiskAssessment: formatComplianceCheck(complianceChecksByType[COMPLIANCE_CHECK_TYPES.HS_RISK_ASSESSMENT]),
      legionellaRisk: formatComplianceCheck(complianceChecksByType[COMPLIANCE_CHECK_TYPES.LEGIONELLA_RISK]),
    };
  });

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

        <ComplianceOverview 
          initialBuildings={formattedBuildings} 
          tenant={tenantEntity}
          divisions={divisions}
        />
      </div>
    </div>
  );
}

function formatComplianceCheck(check: ComplianceCheck | undefined): { date: string; status: string } {
  if (!check) {
    return { date: "", status: "" };
  }
  
  const date = check.completedDate || check.dueDate;
  return {
    date: date ? new Date(date).toLocaleDateString("en-GB") : "",
    status: check.status || ""
  };
}
