import { Doc, Id } from "../../../../convex/_generated/dataModel";

export type Note = Doc<"notes">;
export type NoteId = Id<"notes">;

export type NoteWithRelations = Note & {
  building?: Doc<"buildings">;
  tenant?: Doc<"tenants">;
  creator?: Doc<"users">;
};