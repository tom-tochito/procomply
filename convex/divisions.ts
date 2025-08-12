import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getDivisions = query({
  args: {
    tenantId: v.optional(v.id("tenants")),
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
    // Filter by tenantId if provided
    let divisions;
    if (args.tenantId) {
      divisions = await ctx.db
        .query("divisions")
        .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId!))
        .collect();
    } else {
      divisions = await ctx.db.query("divisions").collect();
    }
    
    // Apply filter
    if (args.type) {
      divisions = divisions.filter(d => d.type === args.type);
    }
    
    return divisions;
  },
});

export const getDivision = query({
  args: { 
    divisionId: v.id("divisions"),
    tenantId: v.optional(v.id("tenants")), // Optional for access check
  },
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

    // Optional access check if tenantId is provided
    if (args.tenantId && division.tenantId !== args.tenantId) {
      throw new Error("Access denied");
    }

    return division;
  },
});

export const createDivision = mutation({
  args: {
    tenantId: v.id("tenants"), // Required for testing
    name: v.string(),
    type: v.string(),
    description: v.optional(v.string()),
  },
  returns: v.id("divisions"),
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("divisions", {
      tenantId: args.tenantId,
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
    tenantId: v.optional(v.id("tenants")), // Optional for access check
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

    // Optional access check if tenantId is provided
    if (args.tenantId && division.tenantId !== args.tenantId) {
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
  args: { 
    divisionId: v.id("divisions"),
    tenantId: v.optional(v.id("tenants")), // Optional for access check
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const division = await ctx.db.get(args.divisionId);
    if (!division) {
      throw new Error("Division not found");
    }

    // Optional access check if tenantId is provided
    if (args.tenantId && division.tenantId !== args.tenantId) {
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