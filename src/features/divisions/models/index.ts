/* eslint-disable @typescript-eslint/no-empty-object-type */
import { InstaQLEntity } from "@instantdb/react";
import { AppSchema } from "~/instant.schema";

export type Division = InstaQLEntity<AppSchema, "divisions">;
export type DivisionWithTenant = InstaQLEntity<AppSchema, "divisions", { tenant: {} }>;
export type DivisionWithRelations = InstaQLEntity<AppSchema, "divisions", { 
  tenant: {},
  buildings: {}
}>;