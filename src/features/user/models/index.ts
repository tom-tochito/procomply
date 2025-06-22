import { InstaQLEntity } from "@instantdb/react";
import { AppSchema } from "~/instant.schema";

// Base user types from InstantDB
export type User = InstaQLEntity<AppSchema, "$users">;
export type UserProfile = InstaQLEntity<AppSchema, "userProfiles">;

// User with related data
export type UserWithProfile = InstaQLEntity<AppSchema, "$users", { profile: object }>;
export type UserWithTenant = InstaQLEntity<AppSchema, "$users", { tenant: object }>;
export type UserWithProfileAndTenant = InstaQLEntity<AppSchema, "$users", { profile: object; tenant: object }>;

// Full user type for auth
export type FullUser = User & { 
  profile?: UserProfile;
  tenant?: InstaQLEntity<AppSchema, "tenants">;
};