import { InstaQLEntity } from "@instantdb/react";
import { AppSchema } from "~/instant.schema";

export type Contact = InstaQLEntity<AppSchema, "contacts">;

export type ContactWithRelations = InstaQLEntity<
  AppSchema,
  "contacts",
  { building: object; tenant: object; creator: object }
>;