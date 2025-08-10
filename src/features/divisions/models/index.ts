import { Doc, Id } from "../../../../convex/_generated/dataModel";

export type Division = Doc<"divisions">;
export type DivisionId = Id<"divisions">;
export type DivisionWithTenant = Division & { tenant?: Doc<"tenants"> };
export type DivisionWithRelations = Division & {
  tenant?: Doc<"tenants">;
  buildings?: Doc<"buildings">[];
};