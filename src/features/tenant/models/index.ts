import { InstaQLEntity } from "@instantdb/react";
import { AppSchema } from "~/instant.schema";

// Base tenant type from InstantDB
export type Tenant = InstaQLEntity<AppSchema, "tenants">;

// Tenant with related data
export type TenantWithUsers = InstaQLEntity<AppSchema, "tenants", { users: object }>;
export type TenantWithBuildings = InstaQLEntity<AppSchema, "tenants", { buildings: object }>;
export type TenantWithTemplates = InstaQLEntity<AppSchema, "tenants", { templates: object }>;
export type TenantWithTasks = InstaQLEntity<AppSchema, "tenants", { tasks: object }>;
export type TenantWithDocuments = InstaQLEntity<AppSchema, "tenants", { documents: object }>;
export type TenantWithInspections = InstaQLEntity<AppSchema, "tenants", { inspections: object }>;

// Tenant with all relations
export type TenantWithRelations = InstaQLEntity<
  AppSchema,
  "tenants",
  {
    users: object;
    buildings: object;
    templates: object;
    tasks: object;
    documents: object;
    inspections: object;
  }
>;