import { Doc, Id } from "../../../../convex/_generated/dataModel";

export type Team = Doc<"teams">;
export type TeamId = Id<"teams">;
export type TeamWithRelations = Team & {
  tenant?: Doc<"tenants">;
  company?: Doc<"companies">;
  supervisor?: Doc<"users">;
};