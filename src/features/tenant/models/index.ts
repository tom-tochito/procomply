import { Doc, Id } from "../../../../convex/_generated/dataModel";

// Base tenant type from Convex
export type Tenant = Doc<"tenants">;
export type TenantId = Id<"tenants">;

// Tenant with related data
export type TenantWithUsers = Tenant & { users?: Doc<"users">[] };
export type TenantWithBuildings = Tenant & { buildings?: Doc<"buildings">[] };
export type TenantWithTemplates = Tenant & { templates?: Doc<"templates">[] };
export type TenantWithTasks = Tenant & { tasks?: Doc<"tasks">[] };
export type TenantWithDocuments = Tenant & { documents?: Doc<"documents">[] };
export type TenantWithInspections = Tenant & { inspections?: Doc<"inspections">[] };

// Tenant with all relations
export type TenantWithRelations = Tenant & {
  users?: Doc<"users">[];
  buildings?: Doc<"buildings">[];
  templates?: Doc<"templates">[];
  tasks?: Doc<"tasks">[];
  documents?: Doc<"documents">[];
  inspections?: Doc<"inspections">[];
};