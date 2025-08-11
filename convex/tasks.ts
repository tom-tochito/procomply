import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getCurrentUserTenant } from "./tenants";
import { getUserIdentity } from "./auth";

export const getTasks = query({
  args: {
    buildingId: v.optional(v.id("buildings")),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    assigneeId: v.optional(v.id("users")),
  },
  returns: v.array(
    v.object({
      _id: v.id("tasks"),
      _creationTime: v.number(),
      tenantId: v.id("tenants"),
      buildingId: v.optional(v.id("buildings")),
      templateId: v.optional(v.id("templates")),
      assigneeId: v.optional(v.id("users")),
      creatorId: v.id("users"),
      title: v.string(),
      description: v.optional(v.string()),
      status: v.string(),
      priority: v.string(),
      dueDate: v.number(),
      completedDate: v.optional(v.number()),
      data: v.optional(v.any()),
      createdAt: v.number(),
      updatedAt: v.number(),
      building: v.optional(v.object({
        _id: v.id("buildings"),
        name: v.string(),
      })),
      assignee: v.optional(v.object({
        _id: v.id("users"),
        email: v.optional(v.string()),
      })),
      creator: v.optional(v.object({
        _id: v.id("users"),
        email: v.optional(v.string()),
      })),
    })
  ),
  handler: async (ctx, args) => {
    const tenantId = await getCurrentUserTenant(ctx);
    
    let query = ctx.db
      .query("tasks")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId));
    
    let tasks = await query.collect();
    
    // Apply filters
    if (args.buildingId) {
      tasks = tasks.filter(t => t.buildingId === args.buildingId);
    }
    if (args.status) {
      tasks = tasks.filter(t => t.status === args.status);
    }
    if (args.priority) {
      tasks = tasks.filter(t => t.priority === args.priority);
    }
    if (args.assigneeId) {
      tasks = tasks.filter(t => t.assigneeId === args.assigneeId);
    }
    
    // Fetch related data
    const tasksWithRelations = await Promise.all(
      tasks.map(async (task) => {
        const building = task.buildingId 
          ? await ctx.db.get(task.buildingId) 
          : undefined;
        const assignee = task.assigneeId 
          ? await ctx.db.get(task.assigneeId) 
          : undefined;
        const creator = await ctx.db.get(task.creatorId);
        
        return {
          ...task,
          building: building ? { _id: building._id, name: building.name } : undefined,
          assignee: assignee ? { _id: assignee._id, email: assignee.email } : undefined,
          creator: creator ? { _id: creator._id, email: creator.email } : undefined,
        };
      })
    );
    
    return tasksWithRelations;
  },
});

export const getTask = query({
  args: { taskId: v.id("tasks") },
  returns: v.union(
    v.object({
      _id: v.id("tasks"),
      _creationTime: v.number(),
      tenantId: v.id("tenants"),
      buildingId: v.optional(v.id("buildings")),
      templateId: v.optional(v.id("templates")),
      assigneeId: v.optional(v.id("users")),
      creatorId: v.id("users"),
      title: v.string(),
      description: v.optional(v.string()),
      status: v.string(),
      priority: v.string(),
      dueDate: v.number(),
      completedDate: v.optional(v.number()),
      data: v.optional(v.any()),
      createdAt: v.number(),
      updatedAt: v.number(),
      building: v.optional(v.any()),
      template: v.optional(v.any()),
      assignee: v.optional(v.any()),
      creator: v.optional(v.any()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) return null;

    // Ensure user has access
    const tenantId = await getCurrentUserTenant(ctx);
    if (task.tenantId !== tenantId) {
      throw new Error("Access denied");
    }

    // Get related data
    const building = task.buildingId 
      ? await ctx.db.get(task.buildingId) 
      : undefined;
    const template = task.templateId 
      ? await ctx.db.get(task.templateId) 
      : undefined;
    const assignee = task.assigneeId 
      ? await ctx.db.get(task.assigneeId) 
      : undefined;
    const creator = await ctx.db.get(task.creatorId);

    return {
      ...task,
      building,
      template,
      assignee,
      creator,
    };
  },
});

export const createTask = mutation({
  args: {
    buildingId: v.optional(v.id("buildings")),
    templateId: v.optional(v.id("templates")),
    assigneeId: v.optional(v.id("users")),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    priority: v.string(),
    dueDate: v.number(),
    data: v.optional(v.any()),
  },
  returns: v.id("tasks"),
  handler: async (ctx, args) => {
    const tenantId = await getCurrentUserTenant(ctx);
    const identity = await getUserIdentity(ctx);
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject as Id<"users">;
    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const now = Date.now();

    return await ctx.db.insert("tasks", {
      tenantId,
      buildingId: args.buildingId,
      templateId: args.templateId,
      assigneeId: args.assigneeId,
      creatorId: user._id,
      title: args.title,
      description: args.description,
      status: args.status,
      priority: args.priority,
      dueDate: args.dueDate,
      data: args.data,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    buildingId: v.optional(v.id("buildings")),
    templateId: v.optional(v.id("templates")),
    assigneeId: v.optional(v.id("users")),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    completedDate: v.optional(v.number()),
    data: v.optional(v.any()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    // Ensure user has access
    const tenantId = await getCurrentUserTenant(ctx);
    if (task.tenantId !== tenantId) {
      throw new Error("Access denied");
    }

    const updates: any = { updatedAt: Date.now() };
    if (args.buildingId !== undefined) updates.buildingId = args.buildingId;
    if (args.templateId !== undefined) updates.templateId = args.templateId;
    if (args.assigneeId !== undefined) updates.assigneeId = args.assigneeId;
    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.status !== undefined) updates.status = args.status;
    if (args.priority !== undefined) updates.priority = args.priority;
    if (args.dueDate !== undefined) updates.dueDate = args.dueDate;
    if (args.completedDate !== undefined) updates.completedDate = args.completedDate;
    if (args.data !== undefined) updates.data = args.data;

    // Auto-set completedDate when status changes to completed
    if (args.status === "completed" && !task.completedDate && !args.completedDate) {
      updates.completedDate = Date.now();
    }

    await ctx.db.patch(args.taskId, updates);
    return null;
  },
});

export const deleteTask = mutation({
  args: { taskId: v.id("tasks") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    // Ensure user has access
    const tenantId = await getCurrentUserTenant(ctx);
    if (task.tenantId !== tenantId) {
      throw new Error("Access denied");
    }

    await ctx.db.delete(args.taskId);
    return null;
  },
});