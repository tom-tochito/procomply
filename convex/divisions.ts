import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserTenant } from "./tenants";

export const getDivisions = query({
  args: {
    type: v.optional(v.string()),
  },
  returns: v.array(
    v.object({
      _id: v.id("divisions"),
      _creationTime: v.number(),
      tenantId: v.id("tenants"),
      name: v.string(),
      type: v.string(),
      description: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    const tenantId = await getCurrentUserTenant(ctx);
    
    let query = ctx.db
      .query("divisions")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId));
    
    let divisions = await query.collect();
    
    // Apply filter
    if (args.type) {
      divisions = divisions.filter(d => d.type === args.type);
    }
    
    return divisions;
  },
});

export const getDivision = query({
  args: { divisionId: v.id("divisions") },
  returns: v.union(
    v.object({
      _id: v.id("divisions"),
      _creationTime: v.number(),
      tenantId: v.id("tenants"),
      name: v.string(),
      type: v.string(),
      description: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const division = await ctx.db.get(args.divisionId);
    if (!division) return null;

    // Ensure user has access
    const tenantId = await getCurrentUserTenant(ctx);
    if (division.tenantId !== tenantId) {
      throw new Error("Access denied");
    }

    return division;
  },
});

export const createDivision = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    description: v.optional(v.string()),
  },
  returns: v.id("divisions"),
  handler: async (ctx, args) => {
    const tenantId = await getCurrentUserTenant(ctx);
    const now = Date.now();

    return await ctx.db.insert("divisions", {
      tenantId,
      name: args.name,
      type: args.type,
      description: args.description,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateDivision = mutation({
  args: {
    divisionId: v.id("divisions"),
    name: v.optional(v.string()),
    type: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const division = await ctx.db.get(args.divisionId);
    if (!division) {
      throw new Error("Division not found");
    }

    // Ensure user has access
    const tenantId = await getCurrentUserTenant(ctx);
    if (division.tenantId !== tenantId) {
      throw new Error("Access denied");
    }

    const updates: any = { updatedAt: Date.now() };
    if (args.name !== undefined) updates.name = args.name;
    if (args.type !== undefined) updates.type = args.type;
    if (args.description !== undefined) updates.description = args.description;

    await ctx.db.patch(args.divisionId, updates);
    return null;
  },
});

export const deleteDivision = mutation({
  args: { divisionId: v.id("divisions") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const division = await ctx.db.get(args.divisionId);
    if (!division) {
      throw new Error("Division not found");
    }

    // Ensure user has access
    const tenantId = await getCurrentUserTenant(ctx);
    if (division.tenantId !== tenantId) {
      throw new Error("Access denied");
    }

    // Check if division has buildings
    const buildingsInDivision = await ctx.db
      .query("buildings")
      .withIndex("by_division", (q) => q.eq("divisionId", args.divisionId))
      .first();

    if (buildingsInDivision) {
      throw new Error("Cannot delete division that contains buildings");
    }

    await ctx.db.delete(args.divisionId);
    return null;
  },
});