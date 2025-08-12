import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Simple authentication for testing - accepts any email
export const signInWithEmail = mutation({
  args: {
    email: v.string(),
  },
  returns: v.object({
    userId: v.id("users"),
    email: v.string(),
  }),
  handler: async (ctx, args) => {
    const { email } = args;
    
    // Check if user exists
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    
    const now = Date.now();
    
    if (!user) {
      // Create new user
      const userId = await ctx.db.insert("users", {
        email,
        emailVerificationTime: now,
        role: "user",
        createdAt: now,
        updatedAt: now,
      });
      
      user = await ctx.db.get(userId);
    }
    
    if (!user) {
      throw new Error("Failed to create user");
    }
    
    // Store current user ID in session (simplified)
    // In production, you'd use proper session management
    return {
      userId: user._id,
      email: user.email!,
    };
  },
});

export const getCurrentUser = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  returns: v.union(
    v.object({
      _id: v.id("users"),
      email: v.string(),
      role: v.string(),
      name: v.optional(v.string()),
      phone: v.optional(v.string()),
      phoneMobile: v.optional(v.string()),
      position: v.optional(v.string()),
      companyId: v.optional(v.id("companies")),
      tenantId: v.optional(v.id("tenants")),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    if (!args.userId) {
      return null;
    }
    
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return null;
    }
    
    // Get user's tenant
    const userTenant = await ctx.db
      .query("userTenants")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    
    return {
      _id: user._id,
      email: user.email!,
      role: user.role || "user",
      name: user.name,
      phone: user.phone,
      phoneMobile: user.phoneMobile,
      position: user.position,
      companyId: user.companyId,
      tenantId: userTenant?.tenantId,
    };
  },
});

export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    phoneMobile: v.optional(v.string()),
    position: v.optional(v.string()),
    companyId: v.optional(v.id("companies")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    await ctx.db.patch(userId, {
      ...updates,
      updatedAt: Date.now(),
    });
    
    return null;
  },
});