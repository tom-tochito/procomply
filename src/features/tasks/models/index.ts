/* eslint-disable @typescript-eslint/no-empty-object-type */
import { InstaQLEntity } from "@instantdb/react";
import { AppSchema } from "~/instant.schema";

export type Task = InstaQLEntity<AppSchema, "tasks">;
export type TaskWithRelations = InstaQLEntity<AppSchema, "tasks", {
  assignee: {};
  creator: {};
  tenant: {};
  building: {};
}>;

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
  progress: string;
  notes: unknown[];
  completed: boolean;
  groups: unknown[];
  building_id: string;
}