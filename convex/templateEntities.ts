import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Generic query for template entities
export const getTemplateEntities = query({
  args: {
    entityType: v.union(
      v.literal("riskAreas"),
      v.literal("subsections"),
      v.literal("surveyTypes"),
      v.literal("taskCategories")
    ),
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

    return await ctx.db
      .query(args.entityType)
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
  },
});

// Generic create mutation for template entities
export const createTemplateEntity = mutation({
  args: {
    entityType: v.union(
      v.literal("riskAreas"),
      v.literal("subsections"),
      v.literal("surveyTypes"),
      v.literal("taskCategories")
    ),
    code: v.string(),
    description: v.string(),
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
    
    return await ctx.db.insert(args.entityType, {
      code: args.code,
      description: args.description,
      tenantId,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Generic update mutation for template entities
export const updateTemplateEntity = mutation({
  args: {
    entityType: v.union(
      v.literal("riskAreas"),
      v.literal("subsections"),
      v.literal("surveyTypes"),
      v.literal("taskCategories")
    ),
    entityId: v.string(), // Generic ID since we don't know the table
    code: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the entity to check tenant access
    const entity = await ctx.db.get(args.entityId as any);
    if (!entity) {
      throw new Error("Entity not found");
    }

    // Get user profile to check tenant access
    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject as Id<"users">))
      .first();

    if (!userProfile || userProfile.tenantId !== (entity as any).tenantId) {
      throw new Error("Access denied");
    }

    return await ctx.db.patch(args.entityId as any, {
      code: args.code,
      description: args.description,
      updatedAt: Date.now(),
    });
  },
});

// Generic delete mutation for template entities
export const deleteTemplateEntity = mutation({
  args: {
    entityType: v.union(
      v.literal("riskAreas"),
      v.literal("subsections"),
      v.literal("surveyTypes"),
      v.literal("taskCategories")
    ),
    entityId: v.string(), // Generic ID since we don't know the table
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the entity to check tenant access
    const entity = await ctx.db.get(args.entityId as any);
    if (!entity) {
      throw new Error("Entity not found");
    }

    // Get user profile to check tenant access
    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject as Id<"users">))
      .first();

    if (!userProfile || userProfile.tenantId !== (entity as any).tenantId) {
      throw new Error("Access denied");
    }

    return await ctx.db.delete(args.entityId as any);
  },
});