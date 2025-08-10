import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserIdentity } from "./auth";

// Helper to get current user's tenant
export async function getCurrentUserTenant(ctx: any) {
  const identity = await getUserIdentity(ctx);
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q: any) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .unique();

  if (!user) {
    throw new Error("User not found");
  }

  const userTenant = await ctx.db
    .query("userTenants")
    .withIndex("by_user", (q: any) => q.eq("userId", user._id))
    .first();

  if (!userTenant) {
    throw new Error("User not assigned to any tenant");
  }

  return userTenant.tenantId;
}

export const getTenant = query({
  args: { tenantId: v.id("tenants") },
  returns: v.union(
    v.object({
      _id: v.id("tenants"),
      _creationTime: v.number(),
      name: v.string(),
      slug: v.string(),
      description: v.string(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.tenantId);
  },
});

export const getCurrentTenant = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("tenants"),
      _creationTime: v.number(),
      name: v.string(),
      slug: v.string(),
      description: v.string(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    try {
      const tenantId = await getCurrentUserTenant(ctx);
      return await ctx.db.get(tenantId);
    } catch {
      return null;
    }
  },
});

export const createTenant = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
  },
  returns: v.id("tenants"),
  handler: async (ctx, args) => {
    // Check if slug already exists
    const existing = await ctx.db
      .query("tenants")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing) {
      throw new Error("Tenant with this slug already exists");
    }

    const now = Date.now();
    return await ctx.db.insert("tenants", {
      name: args.name,
      slug: args.slug,
      description: args.description,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateTenant = mutation({
  args: {
    tenantId: v.id("tenants"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const tenant = await ctx.db.get(args.tenantId);
    if (!tenant) {
      throw new Error("Tenant not found");
    }

    const updates: any = { updatedAt: Date.now() };
    if (args.name !== undefined) updates.name = args.name;
    if (args.description !== undefined) updates.description = args.description;

    await ctx.db.patch(args.tenantId, updates);
    return null;
  },
});