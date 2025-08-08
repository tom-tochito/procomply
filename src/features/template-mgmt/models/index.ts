import { InstaQLEntity } from "@instantdb/react";
import { AppSchema } from "~/instant.schema";

// Type alias for tenant relation to avoid ESLint empty object warning
type TenantRelation = { tenant: object };

// Country type from InstantDB
export type Country = InstaQLEntity<AppSchema, "countries">;
export type CountryWithTenant = InstaQLEntity<AppSchema, "countries", TenantRelation>;

// Legislation type from InstantDB
export type Legislation = InstaQLEntity<AppSchema, "legislation">;
export type LegislationWithTenant = InstaQLEntity<AppSchema, "legislation", TenantRelation>;

// Risk Area type from InstantDB
export type RiskArea = InstaQLEntity<AppSchema, "riskAreas">;
export type RiskAreaWithTenant = InstaQLEntity<AppSchema, "riskAreas", TenantRelation>;

// Subsection type from InstantDB
export type Subsection = InstaQLEntity<AppSchema, "subsections">;
export type SubsectionWithTenant = InstaQLEntity<AppSchema, "subsections", TenantRelation>;

// Survey Type type from InstantDB
export type SurveyType = InstaQLEntity<AppSchema, "surveyTypes">;
export type SurveyTypeWithTenant = InstaQLEntity<AppSchema, "surveyTypes", TenantRelation>;

// Task Category type from InstantDB
export type TaskCategory = InstaQLEntity<AppSchema, "taskCategories">;
export type TaskCategoryWithTenant = InstaQLEntity<AppSchema, "taskCategories", TenantRelation>;