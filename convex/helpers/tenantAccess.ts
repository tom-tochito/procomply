import { QueryCtx, MutationCtx } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

type Context = QueryCtx | MutationCtx;

export async function getTenantAccess(
  ctx: Context,
  requestedTenantId: Id<"tenants"> | undefined
): Promise<{
  userId: Id<"users">;
  user: Doc<"users">;
  tenantId: Id<"tenants">;
  isAdmin: boolean;
}> {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const user = await ctx.db.get(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const isAdmin = user.role === "admin";

  // If no tenant specified, throw error - tenantId should always be provided
  if (!requestedTenantId) {
    throw new Error("Tenant ID is required");
  }

  // Admins can access any tenant
  if (isAdmin) {
    return { userId, user, tenantId: requestedTenantId, isAdmin };
  }

  // Non-admin users need to have access to the tenant
  const userTenant = await ctx.db
    .query("userTenants")
    .withIndex("by_user_and_tenant", (q) =>
      q.eq("userId", userId).eq("tenantId", requestedTenantId)
    )
    .unique();

  if (!userTenant) {
    throw new Error("Access denied to this tenant");
  }

  return { userId, user, tenantId: requestedTenantId, isAdmin };
}

export async function requireTenantAccess(
  ctx: Context,
  tenantId: Id<"tenants"> | undefined
) {
  return getTenantAccess(ctx, tenantId);
}
