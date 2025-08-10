import { Doc, Id } from "../../../../convex/_generated/dataModel";

// Base document type from Convex
export type Document = Doc<"documents">;
export type DocumentId = Id<"documents">;

// Document with related data
export type DocumentWithBuilding = Document & { building?: Doc<"buildings"> };
export type DocumentWithUploader = Document & { uploader?: Doc<"users"> };
export type DocumentWithTenant = Document & { tenant?: Doc<"tenants"> };

// Document with all relations
export type DocumentWithRelations = Document & {
  building?: Doc<"buildings">;
  uploader?: Doc<"users">;
  tenant?: Doc<"tenants">;
};