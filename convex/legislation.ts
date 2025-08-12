import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getLegislation = query({
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the legislation to check tenant access
    const legislation = await ctx.db.get(args.legislationId);
    if (!legislation) {
      throw new Error("Legislation not found");
    }

    // Get user to check tenant access
    const userId = identity.subject as Id<"users">;
    const user = await ctx.db.get(userId);
    
    if (!user || user.tenantId !== legislation.tenantId) {
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the legislation to check tenant access
    const legislation = await ctx.db.get(args.legislationId);
    if (!legislation) {
      throw new Error("Legislation not found");
    }

    // Get user to check tenant access
    const userId = identity.subject as Id<"users">;
    const user = await ctx.db.get(userId);
    
    if (!user || user.tenantId !== legislation.tenantId) {
      throw new Error("Access denied");
    }

    return await ctx.db.delete(args.legislationId);
  },
});