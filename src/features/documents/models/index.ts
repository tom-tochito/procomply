import { InstaQLEntity } from "@instantdb/react";
import { AppSchema } from "~/instant.schema";

// Base document type from InstantDB
export type Document = InstaQLEntity<AppSchema, "documents">;

// Document with related data
export type DocumentWithBuilding = InstaQLEntity<AppSchema, "documents", { building: object }>;
export type DocumentWithUploader = InstaQLEntity<AppSchema, "documents", { uploader: object }>;
export type DocumentWithTenant = InstaQLEntity<AppSchema, "documents", { tenant: object }>;

// Document with all relations
export type DocumentWithRelations = InstaQLEntity<
  AppSchema,
  "documents",
  {
    building: object;
    uploader: object;
    tenant: object;
  }
>;