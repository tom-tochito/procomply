import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
// Helper to get current user's tenant
export async function getCurrentUserTenant(ctx: any, userId?: Id<"users">): Promise<Id<"tenants"> | null> {
  if (!userId) {
    return null;
  }

  const userTenant = await ctx.db
    .query("userTenants")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .first();

  if (!userTenant) {
    return null;
  }

  return userTenant.tenantId as Id<"tenants">;
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

export const getTenantBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    
    if (!tenant) {
      throw new Error("Tenant not found");
    }
    
    return tenant;
  },
});

export const getAllTenants = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tenants").collect();
  },
});

export const getCurrentTenant = query({
  args: {
    userId: v.optional(v.id("users")),
  },
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
    try {
      const tenantId = await getCurrentUserTenant(ctx, args.userId);
      if (!tenantId) return null;
      
      const tenant = await ctx.db.get(tenantId);
      if (!tenant) return null;
      
      return {
        _id: tenant._id as Id<"tenants">,
        _creationTime: tenant._creationTime,
        name: tenant.name,
        slug: tenant.slug,
        description: tenant.description,
        createdAt: tenant.createdAt,
        updatedAt: tenant.updatedAt,
      };
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