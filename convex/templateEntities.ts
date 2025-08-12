import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireTenantAccess } from "./helpers/tenantAccess";
import { Id } from "./_generated/dataModel";

// Generic template entity query for risk areas, subsections, survey types, and task categories
export const getTemplateEntities = query({
  args: {
    tenantId: v.id("tenants"),
    entityType: v.union(
      v.literal("riskAreas"),
      v.literal("subsections"),
      v.literal("surveyTypes"),
      v.literal("taskCategories")
    ),
  },
  returns: v.array(
    v.object({
      _id: v.union(
        v.id("riskAreas"),
        v.id("subsections"),
        v.id("surveyTypes"),
        v.id("taskCategories")
      ),
      _creationTime: v.number(),
      tenantId: v.id("tenants"),
      code: v.string(),
      description: v.string(),
      isActive: v.optional(v.boolean()),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    await requireTenantAccess(ctx, args.tenantId);
    
    // Type-safe query based on entity type
    let results;
    switch (args.entityType) {
      case "riskAreas":
        results = await ctx.db
          .query("riskAreas")
          .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
          .collect();
        break;
      case "subsections":
        results = await ctx.db
          .query("subsections")
          .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
          .collect();
        break;
      case "surveyTypes":
        results = await ctx.db
          .query("surveyTypes")
          .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
          .collect();
        break;
      case "taskCategories":
        results = await ctx.db
          .query("taskCategories")
          .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
          .collect();
        break;
    }
    
    return results;
  },
});

// Create template entity
export const createTemplateEntity = mutation({
  args: {
    tenantId: v.id("tenants"),
    entityType: v.union(
      v.literal("riskAreas"),
      v.literal("subsections"),
      v.literal("surveyTypes"),
      v.literal("taskCategories")
    ),
    code: v.string(),
    description: v.string(),
    isActive: v.optional(v.boolean()),
  },
  returns: v.union(
    v.id("riskAreas"),
    v.id("subsections"),
    v.id("surveyTypes"),
    v.id("taskCategories")
  ),
  handler: async (ctx, args) => {
    await requireTenantAccess(ctx, args.tenantId);
    
    const now = Date.now();
    const data = {
      tenantId: args.tenantId,
      code: args.code,
      description: args.description,
      isActive: args.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    
    // Type-safe insert based on entity type
    switch (args.entityType) {
      case "riskAreas":
        return await ctx.db.insert("riskAreas", data);
      case "subsections":
        return await ctx.db.insert("subsections", data);
      case "surveyTypes":
        return await ctx.db.insert("surveyTypes", data);
      case "taskCategories":
        return await ctx.db.insert("taskCategories", data);
    }
  },
});

// Update template entity
export const updateTemplateEntity = mutation({
  args: {
    entityType: v.union(
      v.literal("riskAreas"),
      v.literal("subsections"),
      v.literal("surveyTypes"),
      v.literal("taskCategories")
    ),
    entityId: v.string(),
    code: v.optional(v.string()),
    description: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Parse entity ID based on type
    let entity;
    switch (args.entityType) {
      case "riskAreas":
        entity = await ctx.db.get(args.entityId as Id<"riskAreas">);
        break;
      case "subsections":
        entity = await ctx.db.get(args.entityId as Id<"subsections">);
        break;
      case "surveyTypes":
        entity = await ctx.db.get(args.entityId as Id<"surveyTypes">);
        break;
      case "taskCategories":
        entity = await ctx.db.get(args.entityId as Id<"taskCategories">);
        break;
    }
    
    if (!entity) {
      throw new Error("Entity not found");
    }
    
    // Verify access
    await requireTenantAccess(ctx, entity.tenantId);
    
    const updates = {
      updatedAt: Date.now(),
      ...(args.code !== undefined && { code: args.code }),
      ...(args.description !== undefined && { description: args.description }),
      ...(args.isActive !== undefined && { isActive: args.isActive }),
    };
    
    // Type-safe patch based on entity type
    switch (args.entityType) {
      case "riskAreas":
        await ctx.db.patch(args.entityId as Id<"riskAreas">, updates);
        break;
      case "subsections":
        await ctx.db.patch(args.entityId as Id<"subsections">, updates);
        break;
      case "surveyTypes":
        await ctx.db.patch(args.entityId as Id<"surveyTypes">, updates);
        break;
      case "taskCategories":
        await ctx.db.patch(args.entityId as Id<"taskCategories">, updates);
        break;
    }
    
    return null;
  },
});

// Delete template entity
export const deleteTemplateEntity = mutation({
  args: {
    entityType: v.union(
      v.literal("riskAreas"),
      v.literal("subsections"),
      v.literal("surveyTypes"),
      v.literal("taskCategories")
    ),
    entityId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Parse entity ID based on type
    let entity;
    switch (args.entityType) {
      case "riskAreas":
        entity = await ctx.db.get(args.entityId as Id<"riskAreas">);
        break;
      case "subsections":
        entity = await ctx.db.get(args.entityId as Id<"subsections">);
        break;
      case "surveyTypes":
        entity = await ctx.db.get(args.entityId as Id<"surveyTypes">);
        break;
      case "taskCategories":
        entity = await ctx.db.get(args.entityId as Id<"taskCategories">);
        break;
    }
    
    if (!entity) {
      throw new Error("Entity not found");
    }
    
    // Verify access
    await requireTenantAccess(ctx, entity.tenantId);
    
    // Type-safe delete based on entity type
    switch (args.entityType) {
      case "riskAreas":
        await ctx.db.delete(args.entityId as Id<"riskAreas">);
        break;
      case "subsections":
        await ctx.db.delete(args.entityId as Id<"subsections">);
        break;
      case "surveyTypes":
        await ctx.db.delete(args.entityId as Id<"surveyTypes">);
        break;
      case "taskCategories":
        await ctx.db.delete(args.entityId as Id<"taskCategories">);
        break;
    }
    
    return null;
  },
});