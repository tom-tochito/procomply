import { Doc, Id } from "../../../../convex/_generated/dataModel";

export type ComplianceCheck = Doc<"complianceChecks">;
export type ComplianceCheckId = Id<"complianceChecks">;
export type ComplianceCheckWithBuilding = ComplianceCheck & { building?: Doc<"buildings"> };
export type ComplianceCheckWithRelations = ComplianceCheck & { 
  building?: Doc<"buildings">;
  tenant?: Doc<"tenants">;
};

export type Building = Doc<"buildings">;
export type BuildingId = Id<"buildings">;
export type BuildingWithComplianceChecks = Building & { complianceChecks?: ComplianceCheck[] };
export type BuildingWithFullRelations = Building & { 
  complianceChecks?: ComplianceCheck[];
  tenant?: Doc<"tenants">;
};

export const COMPLIANCE_CHECK_TYPES = {
  ANNUAL_FLAT_DOOR: "annualFlatDoor",
  ASBESTOS_REINSPECTIONS: "asbestosReinspections",
  ASBESTOS_SURVEYS: "asbestosSurveys",
  FIRE_ALARM_TESTING: "fireAlarmTesting",
  FIRE_RISK_ASSESSMENT: "fireRiskAssessment",
  HS_MONTHLY_VISIT: "hsMonthlyVisit",
  HS_RISK_ASSESSMENT: "hsRiskAssessment",
  LEGIONELLA_RISK: "legionellaRisk",
} as const;

export const COMPLIANCE_STATUS = {
  SUCCESS: "success",
  WARNING: "warning",
  OVERDUE: "overdue",
  PENDING: "pending",
} as const;

export type ComplianceCheckType = typeof COMPLIANCE_CHECK_TYPES[keyof typeof COMPLIANCE_CHECK_TYPES];
export type ComplianceStatus = typeof COMPLIANCE_STATUS[keyof typeof COMPLIANCE_STATUS];

export interface ComplianceOverviewBuilding extends Building {
  compliance?: number;
  complianceChecksByType?: Record<ComplianceCheckType, ComplianceCheck | undefined>;
}