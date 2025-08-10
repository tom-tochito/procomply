import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserIdentity } from "./auth";

export const viewer = query({
  args: {},
  returns: v.union(
    v.object({
      id: v.id("users"),
      email: v.string(),
      profile: v.union(
        v.object({
          _id: v.id("userProfiles"),
          userId: v.id("users"),
          role: v.string(),
          name: v.optional(v.string()),
          phone: v.optional(v.string()),
          phoneMobile: v.optional(v.string()),
          position: v.optional(v.string()),
          companyId: v.optional(v.id("companies")),
          createdAt: v.number(),
          updatedAt: v.number(),
        }),
        v.null()
      ),
      tenantId: v.union(v.id("tenants"), v.null()),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const identity = await getUserIdentity(ctx);
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) {
      return null;
    }

    // Get user profile
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    // Get user's tenant
    const userTenant = await ctx.db
      .query("userTenants")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    return {
      id: user._id,
      email: user.email ?? "",
      profile,
      tenantId: userTenant?.tenantId ?? null,
    };
  },
});

export const createUserProfile = mutation({
  args: {
    role: v.string(),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    phoneMobile: v.optional(v.string()),
    position: v.optional(v.string()),
    companyId: v.optional(v.id("companies")),
  },
  returns: v.id("userProfiles"),
  handler: async (ctx, args) => {
    const identity = await getUserIdentity(ctx);
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    if (existingProfile) {
      throw new Error("Profile already exists");
    }

    const now = Date.now();
    return await ctx.db.insert("userProfiles", {
      userId: user._id,
      role: args.role,
      name: args.name,
      phone: args.phone,
      phoneMobile: args.phoneMobile,
      position: args.position,
      companyId: args.companyId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateUserProfile = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    phoneMobile: v.optional(v.string()),
    position: v.optional(v.string()),
    companyId: v.optional(v.id("companies")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await getUserIdentity(ctx);
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    if (!profile) {
      throw new Error("Profile not found");
    }

    await ctx.db.patch(profile._id, {
      ...args,
      updatedAt: Date.now(),
    });

    return null;
  },
});

export const assignUserToTenant = mutation({
  args: {
    userId: v.id("users"),
    tenantId: v.id("tenants"),
  },
  returns: v.id("userTenants"),
  handler: async (ctx, args) => {
    // Check if assignment already exists
    const existing = await ctx.db
      .query("userTenants")
      .withIndex("by_user_and_tenant", (q) => 
        q.eq("userId", args.userId).eq("tenantId", args.tenantId)
      )
      .unique();

    if (existing) {
      throw new Error("User already assigned to tenant");
    }

    return await ctx.db.insert("userTenants", {
      userId: args.userId,
      tenantId: args.tenantId,
      createdAt: Date.now(),
    });
  },
});