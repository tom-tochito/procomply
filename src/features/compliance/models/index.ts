import { InstaQLEntity } from "@instantdb/react";
import { AppSchema } from "~/instant.schema";

export type ComplianceCheck = InstaQLEntity<AppSchema, "complianceChecks">;
export type ComplianceCheckWithBuilding = InstaQLEntity<AppSchema, "complianceChecks", { building: object }>;
export type ComplianceCheckWithRelations = InstaQLEntity<AppSchema, "complianceChecks", { building: object; tenant: object }>;

export type Building = InstaQLEntity<AppSchema, "buildings">;
export type BuildingWithComplianceChecks = InstaQLEntity<AppSchema, "buildings", { complianceChecks: object }>;
export type BuildingWithFullRelations = InstaQLEntity<AppSchema, "buildings", { complianceChecks: object; tenant: object }>;

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