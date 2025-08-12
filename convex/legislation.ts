import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getLegislation = query({
  args: {
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
      .query("legislation")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
  },
});

export const createLegislation = mutation({
  args: {
    code: v.string(),
    title: v.string(),
    url: v.optional(v.string()),
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
    
    return await ctx.db.insert("legislation", {
      code: args.code,
      title: args.title,
      url: args.url,
      tenantId,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateLegislation = mutation({
  args: {
    legislationId: v.id("legislation"),
    code: v.string(),
    title: v.string(),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the legislation to check tenant access
    const legislation = await ctx.db.get(args.legislationId);
    if (!legislation) {
      throw new Error("Legislation not found");
    }
    const user = await ctx.db.get(userId);
    
    if (!user) {
      throw new Error("User not found");
    }

    // Check user has access to this tenant
    const userTenant = await ctx.db
      .query("userTenants")
      .withIndex("by_user_and_tenant", (q) => 
        q.eq("userId", userId).eq("tenantId", legislation.tenantId)
      )
      .unique();
      
    if (!userTenant) {
      throw new Error("Access denied");
    }

    return await ctx.db.patch(args.legislationId, {
      code: args.code,
      title: args.title,
      url: args.url,
      updatedAt: Date.now(),
    });
  },
});

export const deleteLegislation = mutation({
  args: {
    legislationId: v.id("legislation"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the legislation to check tenant access
    const legislation = await ctx.db.get(args.legislationId);
    if (!legislation) {
      throw new Error("Legislation not found");
    }
    const user = await ctx.db.get(userId);
    
    if (!user) {
      throw new Error("User not found");
    }

    // Check user has access to this tenant
    const userTenant = await ctx.db
      .query("userTenants")
      .withIndex("by_user_and_tenant", (q) => 
        q.eq("userId", userId).eq("tenantId", legislation.tenantId)
      )
      .unique();
      
    if (!userTenant) {
      throw new Error("Access denied");
    }

    return await ctx.db.delete(args.legislationId);
  },
});