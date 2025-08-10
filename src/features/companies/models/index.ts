import { Doc, Id } from "../../../../convex/_generated/dataModel";

export type Company = Doc<"companies">;
export type CompanyId = Id<"companies">;
export type CompanyWithTenant = Company & { tenant?: Doc<"tenants"> };
export type CompanyWithRelations = Company & {
  tenant?: Doc<"tenants">;
  teams?: Doc<"teams">[];
  employees?: Doc<"users">[];
};