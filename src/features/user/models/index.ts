import { Doc, Id } from "../../../../convex/_generated/dataModel";

// Base user types from Convex
export type User = Doc<"users">;
export type UserId = Id<"users">;

// User with related data
export type UserWithTenant = User & { tenant?: Doc<"tenants"> };

// Full user type for auth
export type FullUser = User & { 
  tenant?: Doc<"tenants">;
};