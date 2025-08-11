import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getInspections = query({
  args: {
    tenantId: v.optional(v.id("tenants")),
    buildingId: v.optional(v.id("buildings")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get user profile to check tenant access
    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject as Id<"users">))
      .first();

    if (!userProfile) {
      throw new Error("User profile not found");
    }

    const tenantId = args.tenantId || userProfile.tenantId;
    if (!tenantId) {
      throw new Error("No tenant specified");
    }

    // Check user has access to this tenant
    if (userProfile.tenantId !== tenantId) {
      throw new Error("Access denied to this tenant");
    }

    let query = ctx.db
      .query("inspections")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId));

    if (args.buildingId) {
      // Filter by building after fetching
      const inspections = await query.collect();
      return inspections
        .filter((i) => i.buildingId === args.buildingId)
        .slice(0, args.limit || 100);
    }

    const inspections = await query.take(args.limit || 100);
    
    // Fetch related buildings
    const buildingIds = [...new Set(inspections.map(i => i.buildingId).filter(Boolean))];
    const buildings = await Promise.all(
      buildingIds.map(id => ctx.db.get(id as Id<"buildings">))
    );
    const buildingMap = Object.fromEntries(
      buildings.filter(Boolean).map(b => [b!._id, b])
    );

    return inspections.map(inspection => ({
      ...inspection,
      building: inspection.buildingId ? buildingMap[inspection.buildingId] : undefined,
    }));
  },
});

export const createInspection = mutation({
  args: {
    buildingId: v.id("buildings"),
    type: v.string(),
    status: v.string(),
    scheduledDate: v.number(),
    completedDate: v.optional(v.number()),
    inspectorId: v.optional(v.id("users")),
    results: v.optional(v.any()),
    notes: v.optional(v.string()),
    templateId: v.optional(v.id("templates")),
    tenantId: v.optional(v.id("tenants")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get user profile to check tenant access
    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject as Id<"users">))
      .first();

    if (!userProfile) {
      throw new Error("User profile not found");
    }

    const tenantId = args.tenantId || userProfile.tenantId;
    if (!tenantId) {
      throw new Error("No tenant specified");
    }

    // Check user has access to this tenant
    if (userProfile.tenantId !== tenantId) {
      throw new Error("Access denied to this tenant");
    }

    const now = Date.now();
    
    return await ctx.db.insert("inspections", {
      buildingId: args.buildingId,
      type: args.type,
      status: args.status,
      scheduledDate: args.scheduledDate,
      completedDate: args.completedDate,
      inspectorId: args.inspectorId,
      results: args.results,
      notes: args.notes,
      templateId: args.templateId,
      tenantId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateInspection = mutation({
  args: {
    inspectionId: v.id("inspections"),
    type: v.optional(v.string()),
    status: v.optional(v.string()),
    scheduledDate: v.optional(v.number()),
    completedDate: v.optional(v.number()),
    inspectorId: v.optional(v.id("users")),
    results: v.optional(v.any()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the inspection to check tenant access
    const inspection = await ctx.db.get(args.inspectionId);
    if (!inspection) {
      throw new Error("Inspection not found");
    }

    // Get user profile to check tenant access
    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject as Id<"users">))
      .first();

    if (!userProfile || userProfile.tenantId !== inspection.tenantId) {
      throw new Error("Access denied");
    }

    const updates: any = { updatedAt: Date.now() };
    if (args.type !== undefined) updates.type = args.type;
    if (args.status !== undefined) updates.status = args.status;
    if (args.scheduledDate !== undefined) updates.scheduledDate = args.scheduledDate;
    if (args.completedDate !== undefined) updates.completedDate = args.completedDate;
    if (args.inspectorId !== undefined) updates.inspectorId = args.inspectorId;
    if (args.results !== undefined) updates.results = args.results;
    if (args.notes !== undefined) updates.notes = args.notes;

    return await ctx.db.patch(args.inspectionId, updates);
  },
});

export const deleteInspection = mutation({
  args: {
    inspectionId: v.id("inspections"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the inspection to check tenant access
    const inspection = await ctx.db.get(args.inspectionId);
    if (!inspection) {
      throw new Error("Inspection not found");
    }

    // Get user profile to check tenant access
    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject as Id<"users">))
      .first();

    if (!userProfile || userProfile.tenantId !== inspection.tenantId) {
      throw new Error("Access denied");
    }

    return await ctx.db.delete(args.inspectionId);
  },
});