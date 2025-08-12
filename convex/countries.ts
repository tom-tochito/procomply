import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCountries = query({
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
      .query("countries")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
  },
});

export const createCountry = mutation({
  args: {
    code: v.string(),
    name: v.string(),
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
    
    return await ctx.db.insert("countries", {
      code: args.code,
      name: args.name,
      tenantId,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateCountry = mutation({
  args: {
    countryId: v.id("countries"),
    code: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the country to check tenant access
    const country = await ctx.db.get(args.countryId);
    if (!country) {
      throw new Error("Country not found");
    }
    const user = await ctx.db.get(userId);
    
    if (!user) {
      throw new Error("User not found");
    }

    // Check user has access to this tenant
    const userTenant = await ctx.db
      .query("userTenants")
      .withIndex("by_user_and_tenant", (q) => 
        q.eq("userId", userId).eq("tenantId", country.tenantId)
      )
      .unique();
      
    if (!userTenant) {
      throw new Error("Access denied");
    }

    return await ctx.db.patch(args.countryId, {
      code: args.code,
      name: args.name,
      updatedAt: Date.now(),
    });
  },
});

export const deleteCountry = mutation({
  args: {
    countryId: v.id("countries"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the country to check tenant access
    const country = await ctx.db.get(args.countryId);
    if (!country) {
      throw new Error("Country not found");
    }
    const user = await ctx.db.get(userId);
    
    if (!user) {
      throw new Error("User not found");
    }

    // Check user has access to this tenant
    const userTenant = await ctx.db
      .query("userTenants")
      .withIndex("by_user_and_tenant", (q) => 
        q.eq("userId", userId).eq("tenantId", country.tenantId)
      )
      .unique();
      
    if (!userTenant) {
      throw new Error("Access denied");
    }

    return await ctx.db.delete(args.countryId);
  },
});