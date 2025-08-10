import { Doc, Id } from "../../../../convex/_generated/dataModel";

// Country type from Convex
export type Country = Doc<"countries">;
export type CountryId = Id<"countries">;
export type CountryWithTenant = Country & { tenant?: Doc<"tenants"> };

// Legislation type from Convex
export type Legislation = Doc<"legislation">;
export type LegislationId = Id<"legislation">;
export type LegislationWithTenant = Legislation & { tenant?: Doc<"tenants"> };

// Risk Area type from Convex
export type RiskArea = Doc<"riskAreas">;
export type RiskAreaId = Id<"riskAreas">;
export type RiskAreaWithTenant = RiskArea & { tenant?: Doc<"tenants"> };

// Subsection type from Convex
export type Subsection = Doc<"subsections">;
export type SubsectionId = Id<"subsections">;
export type SubsectionWithTenant = Subsection & { tenant?: Doc<"tenants"> };

// Survey Type type from Convex
export type SurveyType = Doc<"surveyTypes">;
export type SurveyTypeId = Id<"surveyTypes">;
export type SurveyTypeWithTenant = SurveyType & { tenant?: Doc<"tenants"> };

// Task Category type from Convex
export type TaskCategory = Doc<"taskCategories">;
export type TaskCategoryId = Id<"taskCategories">;
export type TaskCategoryWithTenant = TaskCategory & { tenant?: Doc<"tenants"> };