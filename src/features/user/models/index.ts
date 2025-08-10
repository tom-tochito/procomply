import { Doc, Id } from "../../../../convex/_generated/dataModel";

// Base user types from Convex
export type User = Doc<"users">;
export type UserId = Id<"users">;
export type UserProfile = Doc<"userProfiles">;
export type UserProfileId = Id<"userProfiles">;

// User with related data
export type UserWithProfile = User & { profile?: UserProfile };
export type UserWithTenant = User & { tenant?: Doc<"tenants"> };
export type UserWithProfileAndTenant = User & { 
  profile?: UserProfile;
  tenant?: Doc<"tenants">;
};

// Full user type for auth
export type FullUser = User & { 
  profile?: UserProfile;
  tenant?: Doc<"tenants">;
};