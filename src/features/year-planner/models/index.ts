import { Doc, Id } from "../../../../convex/_generated/dataModel";

export type YearPlannerEvent = Doc<"yearPlannerEvents">;
export type YearPlannerEventId = Id<"yearPlannerEvents">;

export type YearPlannerEventWithRelations = YearPlannerEvent & {
  building?: Doc<"buildings">;
  tenant?: Doc<"tenants">;
  creator?: Doc<"users">;
};