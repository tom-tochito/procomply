/* eslint-disable @typescript-eslint/no-empty-object-type */
import { InstaQLEntity } from "@instantdb/react";
import { AppSchema } from "~/instant.schema";

export type Task = InstaQLEntity<AppSchema, "tasks">;
export type TaskWithRelations = InstaQLEntity<AppSchema, "tasks", {
  building: {},
  assignee: {},
  creator: {},
  tenant: {}
}>;