import { InstaQLEntity } from "@instantdb/react";
import { AppSchema } from "~/instant.schema";

export type YearPlannerEvent = InstaQLEntity<AppSchema, "yearPlannerEvents">;

export type YearPlannerEventWithRelations = InstaQLEntity<
  AppSchema,
  "yearPlannerEvents",
  { building: object; tenant: object; creator: object }
>;