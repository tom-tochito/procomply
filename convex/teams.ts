import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getCurrentUserTenant } from "./tenants";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getTeams = query({
  args: {
    companyId: v.optional(v.id("companies")),
  },
  returns: v.array(
    v.object({
      _id: v.id("teams"),
      _creationTime: v.number(),
      tenantId: v.id("tenants"),
      companyId: v.optional(v.id("companies")),
      supervisorId: v.optional(v.id("users")),
      code: v.optional(v.string()),
      description: v.string(),
      createdAt: v.number(),
      updatedAt: v.number(),
      company: v.optional(v.object({
        _id: v.id("companies"),
        name: v.string(),
      })),
      supervisor: v.optional(v.object({
        _id: v.id("users"),
        name: v.optional(v.string()),
      })),
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
    
    let teams = await ctx.db
      .query("teams")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
    
    // Apply filter
    if (args.companyId) {
      teams = teams.filter(t => t.companyId === args.companyId);
    }
    
    // Fetch related data
    const teamsWithRelations = await Promise.all(
      teams.map(async (team) => {
        const company = team.companyId 
          ? await ctx.db.get(team.companyId) 
          : undefined;
        const supervisor = team.supervisorId 
          ? await ctx.db.get(team.supervisorId) 
          : undefined;
        
        return {
          ...team,
          company: company ? { _id: company._id, name: company.name } : undefined,
          supervisor: supervisor ? { _id: supervisor._id, name: supervisor.name } : undefined,
        };
      })
    );
    
    return teamsWithRelations;
  },
});

export const getTeam = query({
  args: { teamId: v.id("teams") },
  returns: v.union(
    v.object({
      _id: v.id("teams"),
      _creationTime: v.number(),
      tenantId: v.id("tenants"),
      companyId: v.optional(v.id("companies")),
      supervisorId: v.optional(v.id("users")),
      code: v.optional(v.string()),
      description: v.string(),
      createdAt: v.number(),
      updatedAt: v.number(),
      company: v.optional(v.any()),
      supervisor: v.optional(v.any()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const team = await ctx.db.get(args.teamId);
    if (!team) return null;

    // Ensure user has access
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    const tenantId = await getCurrentUserTenant(ctx, userId);
    if (!tenantId || team.tenantId !== tenantId) {
      throw new Error("Access denied");
    }

    // Get related data
    const company = team.companyId 
      ? await ctx.db.get(team.companyId) 
      : undefined;
    const supervisor = team.supervisorId 
      ? await ctx.db.get(team.supervisorId) 
      : undefined;

    return {
      ...team,
      company,
      supervisor,
    };
  },
});

export const createTeam = mutation({
  args: {
    companyId: v.optional(v.id("companies")),
    supervisorId: v.optional(v.id("users")),
    code: v.optional(v.string()),
    description: v.string(),
  },
  returns: v.id("teams"),
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

    return await ctx.db.insert("teams", {
      tenantId,
      companyId: args.companyId,
      supervisorId: args.supervisorId,
      code: args.code,
      description: args.description,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateTeam = mutation({
  args: {
    teamId: v.id("teams"),
    companyId: v.optional(v.id("companies")),
    supervisorId: v.optional(v.id("users")),
    code: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const team = await ctx.db.get(args.teamId);
    if (!team) {
      throw new Error("Team not found");
    }

    // Ensure user has access
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    const tenantId = await getCurrentUserTenant(ctx, userId);
    if (!tenantId || team.tenantId !== tenantId) {
      throw new Error("Access denied");
    }

    const updates: any = { updatedAt: Date.now() };
    if (args.companyId !== undefined) updates.companyId = args.companyId;
    if (args.supervisorId !== undefined) updates.supervisorId = args.supervisorId;
    if (args.code !== undefined) updates.code = args.code;
    if (args.description !== undefined) updates.description = args.description;

    await ctx.db.patch(args.teamId, updates);
    return null;
  },
});

export const deleteTeam = mutation({
  args: { teamId: v.id("teams") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const team = await ctx.db.get(args.teamId);
    if (!team) {
      throw new Error("Team not found");
    }

    // Ensure user has access
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    const tenantId = await getCurrentUserTenant(ctx, userId);
    if (!tenantId || team.tenantId !== tenantId) {
      throw new Error("Access denied");
    }

    await ctx.db.delete(args.teamId);
    return null;
  },
});