import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getCurrentUserTenant } from "./tenants";

// This query is deprecated - use simpleAuth.getCurrentUser instead
export const viewer = query({
  args: {},
  returns: v.null(),
  handler: async () => {
    return null;
  },
});

// Profile creation is now handled by updateProfile in simpleAuth.ts

// Profile update is now handled by updateProfile in simpleAuth.ts

export const getUsers = query({
  args: {
    tenantId: v.id("tenants"),
  },
  returns: v.array(v.object({
    _id: v.id("users"),
    email: v.string(),
    name: v.optional(v.string()),
    role: v.string(),
    phone: v.optional(v.string()),
    phoneMobile: v.optional(v.string()),
    position: v.optional(v.string()),
    companyId: v.optional(v.id("companies")),
  })),
  handler: async (ctx, args) => {
    // Get all users in the tenant
    const userTenants = await ctx.db
      .query("userTenants")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .collect();

    const users = await Promise.all(
      userTenants.map(async (ut) => {
        const user = await ctx.db.get(ut.userId);
        if (!user) return null;

        return {
          _id: user._id,
          email: user.email!,
          name: user.name,
          role: user.role || "user",
          phone: user.phone,
          phoneMobile: user.phoneMobile,
          position: user.position,
          companyId: user.companyId,
        };
      })
    );

    return users.filter(Boolean) as any;
  },
});

export const assignUserToTenant = mutation({
  args: {
    userId: v.id("users"),
    tenantId: v.id("tenants"),
  },
  returns: v.id("userTenants"),
  handler: async (ctx, args) => {
    // Check if assignment already exists
    const existing = await ctx.db
      .query("userTenants")
      .withIndex("by_user_and_tenant", (q) => 
        q.eq("userId", args.userId).eq("tenantId", args.tenantId)
      )
      .unique();

    if (existing) {
      throw new Error("User already assigned to tenant");
    }

    return await ctx.db.insert("userTenants", {
      userId: args.userId,
      tenantId: args.tenantId,
      createdAt: Date.now(),
    });
  },
});