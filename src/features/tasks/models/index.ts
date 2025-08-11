import { Doc, Id } from "../../../../convex/_generated/dataModel";

export type Task = Doc<"tasks">;
export type TaskId = Id<"tasks">;
export type TaskWithRelations = Task & {
  assignee?: Doc<"users">;
  creator?: Doc<"users">;
  tenant?: Doc<"tenants">;
  building?: Doc<"buildings">;
};

// UI-specific task interface for legacy components
export interface TaskUI {
  id: string;
  description: string;
  risk_area: string;
  priority: "H" | "M" | "L";
  risk_level: "H" | "M" | "L";
  due_date: string;
  team: string;
  assignee: string;
  assigneeId?: string;
  progress: string;
  notes: unknown[];
  completed: boolean;
  groups: unknown[];
  building_id: string;
}