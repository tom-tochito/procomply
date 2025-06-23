/* eslint-disable @typescript-eslint/no-empty-object-type */
import { InstaQLEntity } from "@instantdb/react";
import { AppSchema } from "~/instant.schema";

export type Company = InstaQLEntity<AppSchema, "companies">;
export type CompanyWithTenant = InstaQLEntity<AppSchema, "companies", { tenant: {} }>;
export type CompanyWithRelations = InstaQLEntity<AppSchema, "companies", { 
  tenant: {},
  teams: {},
  employees: {}
}>;