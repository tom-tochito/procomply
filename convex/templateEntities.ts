import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

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
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    const user = await ctx.db.get(userId);
    
    if (!user) {
      throw new Error("User not found");
    }

    let tenantId = args.tenantId;

    // If no tenant specified, get user's tenants
    if (!tenantId) {
      const userTenants = await ctx.db
        .query("userTenants")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
      
      if (userTenants.length === 0) {
        throw new Error("User not assigned to any tenant");
      }
      
      // Use the first tenant if not specified
      tenantId = userTenants[0].tenantId;
    } else {
      // Check user has access to the specified tenant
      const userTenant = await ctx.db
        .query("userTenants")
        .withIndex("by_user_and_tenant", (q) => 
          q.eq("userId", userId).eq("tenantId", tenantId as Id<"tenants">)
        )
        .unique();
        
      if (!userTenant) {
        throw new Error("Access denied to this tenant");
      }
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
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    const user = await ctx.db.get(userId);
    
    if (!user) {
      throw new Error("User not found");
    }

    let tenantId = args.tenantId;

    // If no tenant specified, get user's tenants
    if (!tenantId) {
      const userTenants = await ctx.db
        .query("userTenants")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
      
      if (userTenants.length === 0) {
        throw new Error("User not assigned to any tenant");
      }
      
      // Use the first tenant if not specified
      tenantId = userTenants[0].tenantId;
    } else {
      // Check user has access to the specified tenant
      const userTenant = await ctx.db
        .query("userTenants")
        .withIndex("by_user_and_tenant", (q) => 
          q.eq("userId", userId).eq("tenantId", tenantId as Id<"tenants">)
        )
        .unique();
        
      if (!userTenant) {
        throw new Error("Access denied to this tenant");
      }
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
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the entity to check tenant access
    const entity = await ctx.db.get(args.entityId as any);
    if (!entity) {
      throw new Error("Entity not found");
    }
    const user = await ctx.db.get(userId);
    
    if (!user) {
      throw new Error("User not found");
    }

    // Check user has access to this tenant
    const userTenant = await ctx.db
      .query("userTenants")
      .withIndex("by_user_and_tenant", (q) => 
        q.eq("userId", userId).eq("tenantId", (entity as any).tenantId)
      )
      .unique();
      
    if (!userTenant) {
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
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the entity to check tenant access
    const entity = await ctx.db.get(args.entityId as any);
    if (!entity) {
      throw new Error("Entity not found");
    }
    const user = await ctx.db.get(userId);
    
    if (!user) {
      throw new Error("User not found");
    }

    // Check user has access to this tenant
    const userTenant = await ctx.db
      .query("userTenants")
      .withIndex("by_user_and_tenant", (q) => 
        q.eq("userId", userId).eq("tenantId", (entity as any).tenantId)
      )
      .unique();
      
    if (!userTenant) {
      throw new Error("Access denied");
    }

    return await ctx.db.delete(args.entityId as any);
  },
});