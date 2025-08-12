import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getCurrentUserTenant } from "./tenants";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCompanies = query({
  args: {
    category: v.optional(v.string()),
  },
  returns: v.array(
    v.object({
      _id: v.id("companies"),
      _creationTime: v.number(),
      tenantId: v.id("tenants"),
      name: v.string(),
      referral: v.string(),
      category: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      postcode: v.optional(v.string()),
      numberOfEmployees: v.optional(v.number()),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    const tenantId = await getCurrentUserTenant(ctx, userId);
    if (!tenantId) {
      throw new Error("No tenant found for user");
    }
    
    let companies = await ctx.db
      .query("companies")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
    
    // Apply filter
    if (args.category) {
      companies = companies.filter(c => c.category === args.category);
    }
    
    return companies;
  },
});

export const getCompany = query({
  args: { companyId: v.id("companies") },
  returns: v.union(
    v.object({
      _id: v.id("companies"),
      _creationTime: v.number(),
      tenantId: v.id("tenants"),
      name: v.string(),
      referral: v.string(),
      category: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      postcode: v.optional(v.string()),
      numberOfEmployees: v.optional(v.number()),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const company = await ctx.db.get(args.companyId);
    if (!company) return null;

    // Ensure user has access
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    const tenantId = await getCurrentUserTenant(ctx, userId);
    if (!tenantId || company.tenantId !== tenantId) {
      throw new Error("Access denied");
    }

    return company;
  },
});

export const createCompany = mutation({
  args: {
    name: v.string(),
    referral: v.string(),
    category: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    postcode: v.optional(v.string()),
    numberOfEmployees: v.optional(v.number()),
  },
  returns: v.id("companies"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    const tenantId = await getCurrentUserTenant(ctx, userId);
    if (!tenantId) {
      throw new Error("No tenant found for user");
    }
    const now = Date.now();

    return await ctx.db.insert("companies", {
      tenantId,
      name: args.name,
      referral: args.referral,
      category: args.category,
      email: args.email,
      phone: args.phone,
      postcode: args.postcode,
      numberOfEmployees: args.numberOfEmployees,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateCompany = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.optional(v.string()),
    referral: v.optional(v.string()),
    category: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    postcode: v.optional(v.string()),
    numberOfEmployees: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const company = await ctx.db.get(args.companyId);
    if (!company) {
      throw new Error("Company not found");
    }

    // Ensure user has access
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    const tenantId = await getCurrentUserTenant(ctx, userId);
    if (!tenantId || company.tenantId !== tenantId) {
      throw new Error("Access denied");
    }

    const updates: any = { updatedAt: Date.now() };
    if (args.name !== undefined) updates.name = args.name;
    if (args.referral !== undefined) updates.referral = args.referral;
    if (args.category !== undefined) updates.category = args.category;
    if (args.email !== undefined) updates.email = args.email;
    if (args.phone !== undefined) updates.phone = args.phone;
    if (args.postcode !== undefined) updates.postcode = args.postcode;
    if (args.numberOfEmployees !== undefined) updates.numberOfEmployees = args.numberOfEmployees;

    await ctx.db.patch(args.companyId, updates);
    return null;
  },
});

export const deleteCompany = mutation({
  args: { companyId: v.id("companies") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const company = await ctx.db.get(args.companyId);
    if (!company) {
      throw new Error("Company not found");
    }

    // Ensure user has access
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    const tenantId = await getCurrentUserTenant(ctx, userId);
    if (!tenantId || company.tenantId !== tenantId) {
      throw new Error("Access denied");
    }

    // Check if company has teams
    const teamsInCompany = await ctx.db
      .query("teams")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .first();

    if (teamsInCompany) {
      throw new Error("Cannot delete company that has teams");
    }

    // Check if company has employees
    const employeesInCompany = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("companyId"), args.companyId))
      .first();

    if (employeesInCompany) {
      throw new Error("Cannot delete company that has employees");
    }

    await ctx.db.delete(args.companyId);
    return null;
  },
});