import { InstaQLEntity } from "@instantdb/react";
import { AppSchema } from "~/instant.schema";

// Base building type from InstantDB
export type Building = InstaQLEntity<AppSchema, "buildings">;

// Building with related data
export type BuildingWithTenant = InstaQLEntity<
  AppSchema,
  "buildings",
  { tenant: object }
>;
export type BuildingWithDocuments = InstaQLEntity<
  AppSchema,
  "buildings",
  { documents: object }
>;
export type BuildingWithInspections = InstaQLEntity<
  AppSchema,
  "buildings",
  { inspections: object }
>;
export type BuildingWithTasks = InstaQLEntity<
  AppSchema,
  "buildings",
  { tasks: object }
>;
export type BuildingWithDivision = InstaQLEntity<
  AppSchema,
  "buildings",
  { divisionEntity: object }
>;

// Building with all relations
export type BuildingWithRelations = InstaQLEntity<
  AppSchema,
  "buildings",
  {
    tenant: object;
    divisionEntity: object;
    documents: { uploader: object };
    inspections: object;
    tasks: object;
  }
>;

// UI-specific building type with computed properties
export interface BuildingWithStats extends Building {
  status?: string;
  compliance?: number;
  inbox?: {
    urgent: number;
    warning: number;
    email: boolean;
  };
}

// Other related types (moved to their respective feature models)
export type Inspection = InstaQLEntity<AppSchema, "inspections">;
export type Task = InstaQLEntity<AppSchema, "tasks">;
