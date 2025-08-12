import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { requireTenantAccess } from "./helpers/tenantAccess";

export const getComplianceChecks = query({
  args: {
    tenantId: v.id("tenants"),
    buildingId: v.optional(v.id("buildings")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { tenantId, userId, user, isAdmin } = await requireTenantAccess(ctx, args.tenantId);

    let query = ctx.db
      .query("complianceChecks")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId));

    if (args.buildingId) {
      // Filter by building after fetching
      const checks = await query.collect();
      return checks
        .filter((c) => c.buildingId === args.buildingId)
        .slice(0, args.limit || 100);
    }

    const checks = await query.take(args.limit || 100);
    
    // Fetch related buildings
    const buildingIds = [...new Set(checks.map(c => c.buildingId).filter(Boolean))];
    const buildings = await Promise.all(
      buildingIds.map(id => ctx.db.get(id as Id<"buildings">))
    );
    const buildingMap = Object.fromEntries(
      buildings.filter(Boolean).map(b => [b!._id, b])
    );

    return checks.map(check => ({
      ...check,
      building: check.buildingId ? buildingMap[check.buildingId] : undefined,
    }));
  },
});

export const createComplianceCheck = mutation({
  args: {
    buildingId: v.id("buildings"),
    checkType: v.string(),
    status: v.string(),
    dueDate: v.number(),
    completedDate: v.optional(v.number()),
    notes: v.optional(v.string()),
    tenantId: v.id("tenants"),
  },
  returns: v.id("complianceChecks"),
  handler: async (ctx, args) => {
    const { tenantId, userId, user, isAdmin } = await requireTenantAccess(ctx, args.tenantId);

    const now = Date.now();
    
    return await ctx.db.insert("complianceChecks", {
      buildingId: args.buildingId,
      checkType: args.checkType,
      status: args.status,
      dueDate: args.dueDate,
      completedDate: args.completedDate,
      notes: args.notes,
      tenantId: args.tenantId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateComplianceCheck = mutation({
  args: {
    checkId: v.id("complianceChecks"),
    checkType: v.optional(v.string()),
    status: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    completedDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Get the check to verify tenant access
    const check = await ctx.db.get(args.checkId);
    if (!check) {
      throw new Error("Compliance check not found");
    }

    const { tenantId, userId, user, isAdmin } = await requireTenantAccess(ctx, check.tenantId);

    const updates: Partial<Doc<"complianceChecks">> = { updatedAt: Date.now() };
    if (args.checkType !== undefined) updates.checkType = args.checkType;
    if (args.status !== undefined) updates.status = args.status;
    if (args.dueDate !== undefined) updates.dueDate = args.dueDate;
    if (args.completedDate !== undefined) updates.completedDate = args.completedDate;
    if (args.notes !== undefined) updates.notes = args.notes;

    return await ctx.db.patch(args.checkId, updates);
  },
});

export const deleteComplianceCheck = mutation({
  args: {
    checkId: v.id("complianceChecks"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Get the check to verify tenant access
    const check = await ctx.db.get(args.checkId);
    if (!check) {
      throw new Error("Compliance check not found");
    }

    const { tenantId, userId, user, isAdmin } = await requireTenantAccess(ctx, check.tenantId);

    return await ctx.db.delete(args.checkId);
  },
});