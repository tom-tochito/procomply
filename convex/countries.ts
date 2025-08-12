import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getCountries = query({
  args: {
    tenantId: v.optional(v.id("tenants")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get user to check tenant access
    const userId = identity.subject as Id<"users">;
    const user = await ctx.db.get(userId);
    
    if (!user) {
      throw new Error("User not found");
    }

    const tenantId = args.tenantId || user.tenantId;
    if (!tenantId) {
      throw new Error("No tenant specified");
    }

    // Check user has access to this tenant
    if (user.tenantId !== tenantId) {
      throw new Error("Access denied to this tenant");
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get user to check tenant access
    const userId = identity.subject as Id<"users">;
    const user = await ctx.db.get(userId);
    
    if (!user) {
      throw new Error("User not found");
    }

    const tenantId = args.tenantId || user.tenantId;
    if (!tenantId) {
      throw new Error("No tenant specified");
    }

    // Check user has access to this tenant
    if (user.tenantId !== tenantId) {
      throw new Error("Access denied to this tenant");
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the country to check tenant access
    const country = await ctx.db.get(args.countryId);
    if (!country) {
      throw new Error("Country not found");
    }

    // Get user to check tenant access
    const userId = identity.subject as Id<"users">;
    const user = await ctx.db.get(userId);
    
    if (!user || user.tenantId !== country.tenantId) {
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the country to check tenant access
    const country = await ctx.db.get(args.countryId);
    if (!country) {
      throw new Error("Country not found");
    }

    // Get user to check tenant access
    const userId = identity.subject as Id<"users">;
    const user = await ctx.db.get(userId);
    
    if (!user || user.tenantId !== country.tenantId) {
      throw new Error("Access denied");
    }

    return await ctx.db.delete(args.countryId);
  },
});