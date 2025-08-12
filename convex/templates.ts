import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const templateFieldValidator = v.object({
  key: v.string(),
  label: v.string(),
  type: v.union(
    v.literal("text"),
    v.literal("textarea"),
    v.literal("number"),
    v.literal("date"),
    v.literal("select"),
    v.literal("multiselect"),
    v.literal("checkbox"),
    v.literal("image"),
    v.literal("file"),
    v.literal("url")
  ),
  required: v.boolean(),
  placeholder: v.optional(v.string()),
  helpText: v.optional(v.string()),
  options: v.optional(v.array(v.string())),
  min: v.optional(v.number()),
  max: v.optional(v.number()),
  rows: v.optional(v.number()),
  accept: v.optional(v.string()),
});

export const getTemplates = query({
  args: {
    tenantId: v.optional(v.id("tenants")),
    type: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  returns: v.array(
    v.object({
      _id: v.id("templates"),
      _creationTime: v.number(),
      tenantId: v.id("tenants"),
      name: v.string(),
      type: v.string(),
      fields: v.array(templateFieldValidator),
      isActive: v.boolean(),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    // Filter by tenantId if provided
    let templates;
    if (args.tenantId) {
      templates = await ctx.db
        .query("templates")
        .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId!))
        .collect();
    } else {
      templates = await ctx.db.query("templates").collect();
    }
    
    // Apply filters
    if (args.type !== undefined) {
      templates = templates.filter(t => t.type === args.type);
    }
    
    if (args.isActive !== undefined) {
      templates = templates.filter(t => t.isActive === args.isActive);
    }
    
    return templates;
  },
});

export const getTemplate = query({
  args: { 
    templateId: v.id("templates"),
    tenantId: v.optional(v.id("tenants")), // Optional for access check
  },
  returns: v.union(
    v.object({
      _id: v.id("templates"),
      _creationTime: v.number(),
      tenantId: v.id("tenants"),
      name: v.string(),
      type: v.string(),
      fields: v.array(templateFieldValidator),
      isActive: v.boolean(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const template = await ctx.db.get(args.templateId);
    if (!template) return null;

    // Optional access check if tenantId is provided
    if (args.tenantId && template.tenantId !== args.tenantId) {
      throw new Error("Access denied");
    }

    return template;
  },
});

export const createTemplate = mutation({
  args: {
    tenantId: v.id("tenants"), // Required for testing
    name: v.string(),
    type: v.string(),
    fields: v.array(templateFieldValidator),
    isActive: v.optional(v.boolean()),
  },
  returns: v.id("templates"),
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("templates", {
      tenantId: args.tenantId,
      name: args.name,
      type: args.type,
      fields: args.fields,
      isActive: args.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateTemplate = mutation({
  args: {
    templateId: v.id("templates"),
    tenantId: v.optional(v.id("tenants")), // Optional for access check
    name: v.optional(v.string()),
    fields: v.optional(v.array(templateFieldValidator)),
    isActive: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const template = await ctx.db.get(args.templateId);
    if (!template) {
      throw new Error("Template not found");
    }

    // Optional access check if tenantId is provided
    if (args.tenantId && template.tenantId !== args.tenantId) {
      throw new Error("Access denied");
    }

    const updates: any = { updatedAt: Date.now() };
    if (args.name !== undefined) updates.name = args.name;
    if (args.fields !== undefined) updates.fields = args.fields;
    if (args.isActive !== undefined) updates.isActive = args.isActive;

    await ctx.db.patch(args.templateId, updates);
    return null;
  },
});

export const deleteTemplate = mutation({
  args: { 
    templateId: v.id("templates"),
    tenantId: v.optional(v.id("tenants")), // Optional for access check
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const template = await ctx.db.get(args.templateId);
    if (!template) {
      throw new Error("Template not found");
    }

    // Optional access check if tenantId is provided
    if (args.tenantId && template.tenantId !== args.tenantId) {
      throw new Error("Access denied");
    }

    // Check if template is in use
    const buildingsUsingTemplate = await ctx.db
      .query("buildings")
      .withIndex("by_template", (q) => q.eq("templateId", args.templateId))
      .first();

    if (buildingsUsingTemplate) {
      throw new Error("Cannot delete template that is in use by buildings");
    }

    const tasksUsingTemplate = await ctx.db
      .query("tasks")
      .filter(q => q.eq(q.field("templateId"), args.templateId))
      .first();

    if (tasksUsingTemplate) {
      throw new Error("Cannot delete template that is in use by tasks");
    }

    const documentsUsingTemplate = await ctx.db
      .query("documents")
      .filter(q => q.eq(q.field("templateId"), args.templateId))
      .first();

    if (documentsUsingTemplate) {
      throw new Error("Cannot delete template that is in use by documents");
    }

    await ctx.db.delete(args.templateId);
    return null;
  },
});