import { Doc, Id } from "../../../../convex/_generated/dataModel";

export type Contact = Doc<"contacts">;
export type ContactId = Id<"contacts">;

export type ContactWithRelations = Contact & {
  building?: Doc<"buildings">;
  tenant?: Doc<"tenants">;
  creator?: Doc<"users">;
};