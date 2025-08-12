import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { requireTenantAccess } from "./helpers/tenantAccess";

export const getCountries = query({
  args: {
    tenantId: v.id("tenants"),
  },
  returns: v.array(
    v.object({
      _id: v.id("countries"),
      _creationTime: v.number(),
      tenantId: v.id("tenants"),
      code: v.string(),
      name: v.string(),
      isActive: v.boolean(),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    const { tenantId } = await requireTenantAccess(ctx, args.tenantId);

    return await ctx.db
      .query("countries")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
  },
});

export const createCountry = mutation({
  args: {
    tenantId: v.id("tenants"),
    code: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await requireTenantAccess(ctx, args.tenantId);

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
  returns: v.null(),
  handler: async (ctx, args) => {
    // Get the country to check tenant access
    const country = await ctx.db.get(args.countryId);
    if (!country) {
      throw new Error("Country not found");
    }

    // Verify tenant access
    await requireTenantAccess(ctx, country.tenantId);

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
  returns: v.null(),
  handler: async (ctx, args) => {
    // Get the country to check tenant access
    const country = await ctx.db.get(args.countryId);
    if (!country) {
      throw new Error("Country not found");
    }

    // Verify tenant access
    await requireTenantAccess(ctx, country.tenantId);

    return await ctx.db.delete(args.countryId);
  },
});