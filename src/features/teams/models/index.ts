/* eslint-disable @typescript-eslint/no-empty-object-type */
import { InstaQLEntity } from "@instantdb/react";
import { AppSchema } from "~/instant.schema";

export type Team = InstaQLEntity<AppSchema, "teams">;
export type TeamWithRelations = InstaQLEntity<AppSchema, "teams", {
  tenant: {},
  company: {},
  supervisor: {}
}>;