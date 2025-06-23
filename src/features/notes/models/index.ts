import { InstaQLEntity } from "@instantdb/react";
import { AppSchema } from "~/instant.schema";

export type Note = InstaQLEntity<AppSchema, "notes">;

export type NoteWithRelations = InstaQLEntity<
  AppSchema,
  "notes",
  { building: object; tenant: object; creator: object }
>;