import { Doc, Id } from "../../../../convex/_generated/dataModel";

// Base building type from Convex
export type Building = Doc<"buildings">;
export type BuildingId = Id<"buildings">;

// Building with related data
export interface BuildingWithTenant extends Building {
  tenant?: Doc<"tenants">;
}

export interface BuildingWithDocuments extends Building {
  documents?: Doc<"documents">[];
}

export interface BuildingWithInspections extends Building {
  inspections?: Doc<"inspections">[];
}

export interface BuildingWithTasks extends Building {
  tasks?: Doc<"tasks">[];
}

export interface BuildingWithDivision extends Building {
  divisionEntity?: Doc<"divisions">;
}

export interface BuildingWithTemplate extends Building {
  template?: Doc<"templates">;
}

// Division with related buildings
export interface DivisionWithBuildings extends Doc<"divisions"> {
  buildings?: Building[];
}

// Building with all relations
export interface BuildingWithRelations extends Building {
  tenant?: Doc<"tenants">;
  divisionEntity?: Doc<"divisions">;
  template?: Doc<"templates">;
  documents?: (Doc<"documents"> & { uploader?: Doc<"users"> })[];
  inspections?: Doc<"inspections">[];
  tasks?: Doc<"tasks">[];
}

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

// Division type
export type Division = Doc<"divisions">;
export type DivisionId = Id<"divisions">;

// Other related types
export type Inspection = Doc<"inspections">;
export type InspectionId = Id<"inspections">;
export type Task = Doc<"tasks">;
export type TaskId = Id<"tasks">;