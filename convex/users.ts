import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get the current authenticated user
export const currentUser = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      image: v.optional(v.string()),
      isAnonymous: v.optional(v.boolean()),
      name: v.optional(v.string()),
      phone: v.optional(v.string()),
      phoneVerificationTime: v.optional(v.number()),
      role: v.optional(v.string()),
      phoneMobile: v.optional(v.string()),
      position: v.optional(v.string()),
      companyId: v.optional(v.id("companies")),
      tenantId: v.optional(v.id("tenants")),
      createdAt: v.optional(v.number()),
      updatedAt: v.optional(v.number()),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    return user || null;
  },
});

export const getUsers = query({
  args: {
    tenantId: v.id("tenants"),
  },
  returns: v.array(
    v.object({
      _id: v.id("users"),
      email: v.string(),
      name: v.optional(v.string()),
      role: v.string(),
      phone: v.optional(v.string()),
      phoneMobile: v.optional(v.string()),
      position: v.optional(v.string()),
      companyId: v.optional(v.id("companies")),
    })
  ),
  handler: async (ctx, args) => {
    // Get all users in the tenant
    const userTenants = await ctx.db
      .query("userTenants")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .collect();

    const users = await Promise.all(
      userTenants.map(async (ut) => {
        const user = await ctx.db.get(ut.userId);
        if (!user) return null;

        return {
          _id: user._id,
          email: user.email!,
          name: user.name,
          role: user.role || "user",
          phone: user.phone,
          phoneMobile: user.phoneMobile,
          position: user.position,
          companyId: user.companyId,
        };
      })
    );

    return users.filter(Boolean) as any;
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

// Check if a user with email exists and has access to the tenant
export const validateEmailForTenant = query({
  args: {
    email: v.string(),
    tenantId: v.id("tenants"),
  },
  returns: v.object({
    isValid: v.boolean(),
    isAdmin: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    // Find user by email
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    if (users.length === 0) {
      return {
        isValid: false,
        isAdmin: false,
        message: "No account found with this email. Please contact your administrator.",
      };
    }

    const user = users[0];

    // Check if user is admin (admins can access any tenant)
    if (user.role === "admin") {
      return {
        isValid: true,
        isAdmin: true,
        message: "Admin access granted.",
      };
    }

    // Check if user is assigned to the requested tenant
    const userTenant = await ctx.db
      .query("userTenants")
      .withIndex("by_user_and_tenant", (q) =>
        q.eq("userId", user._id).eq("tenantId", args.tenantId)
      )
      .unique();

    if (!userTenant) {
      return {
        isValid: false,
        isAdmin: false,
        message: "You don't have access to this organization. Please contact your administrator.",
      };
    }

    return {
      isValid: true,
      isAdmin: false,
      message: "Access granted.",
    };
  },
});
