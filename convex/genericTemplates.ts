import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { requireTenantAccess } from "./helpers/tenantAccess";

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

// Generic save template mutation that can create or update
export const saveTemplate = mutation({
  args: {
    tenantId: v.id("tenants"),
    templateId: v.optional(v.id("templates")),
    name: v.string(),
    type: v.string(),
    entity: v.string(),
    fields: v.array(templateFieldValidator),
    isActive: v.optional(v.boolean()),
  },
  returns: v.id("templates"),
  handler: async (ctx, args) => {
    await requireTenantAccess(ctx, args.tenantId);

    const now = Date.now();

    if (args.templateId) {
      // Update existing template
      const template = await ctx.db.get(args.templateId);
      if (!template) {
        throw new Error("Template not found");
      }

      // Verify template belongs to the tenant
      if (template.tenantId !== args.tenantId) {
        throw new Error("Access denied");
      }

      const updates: Partial<Doc<"templates">> = {
        name: args.name,
        entity: args.entity,
        fields: args.fields,
        isActive: args.isActive ?? template.isActive,
        updatedAt: now,
      };

      await ctx.db.patch(args.templateId, updates);
      return args.templateId;
    } else {
      // Create new template
      return await ctx.db.insert("templates", {
        tenantId: args.tenantId,
        name: args.name,
        type: args.type,
        entity: args.entity,
        fields: args.fields,
        isActive: args.isActive ?? true,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Generic get templates for any entity type
export const getTemplatesByEntity = query({
  args: {
    tenantId: v.id("tenants"),
    entity: v.string(),
    isActive: v.optional(v.boolean()),
  },
  returns: v.array(
    v.object({
      _id: v.id("templates"),
      _creationTime: v.number(),
      tenantId: v.id("tenants"),
      name: v.string(),
      type: v.string(),
      entity: v.optional(v.string()),
      fields: v.array(templateFieldValidator),
      isActive: v.boolean(),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    const { tenantId } = await requireTenantAccess(ctx, args.tenantId);

    let templates = await ctx.db
      .query("templates")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();

    // Filter by entity
    templates = templates.filter((t) => t.entity === args.entity);

    // Filter by active status if provided
    if (args.isActive !== undefined) {
      templates = templates.filter((t) => t.isActive === args.isActive);
    }

    return templates;
  },
});

// Generic validation function for template data
export const validateTemplateData = mutation({
  args: {
    tenantId: v.id("tenants"),
    templateId: v.id("templates"),
    data: v.any(),
  },
  returns: v.object({
    isValid: v.boolean(),
    errors: v.array(
      v.object({
        field: v.string(),
        message: v.string(),
      })
    ),
    validatedData: v.any(),
  }),
  handler: async (ctx, args) => {
    const { tenantId } = await requireTenantAccess(ctx, args.tenantId);

    const template = await ctx.db.get(args.templateId);
    if (!template) {
      throw new Error("Template not found");
    }

    // Verify template belongs to the tenant
    if (template.tenantId !== tenantId) {
      throw new Error("Access denied");
    }

    const errors: { field: string; message: string }[] = [];
    const validatedData: Record<string, any> = {};

    // Validate each field
    for (const field of template.fields) {
      const value = args.data[field.key];

      // Check required fields
      if (field.required && (value === null || value === undefined || value === "")) {
        errors.push({
          field: field.key,
          message: `${field.label} is required`,
        });
        continue;
      }

      // Skip validation for empty optional fields
      if (!field.required && (value === null || value === undefined || value === "")) {
        continue;
      }

      // Type-specific validation
      switch (field.type) {
        case "number":
          if (typeof value !== "number" && value !== "") {
            errors.push({
              field: field.key,
              message: `${field.label} must be a number`,
            });
          } else if (typeof value === "number") {
            if (field.min !== undefined && value < field.min) {
              errors.push({
                field: field.key,
                message: `${field.label} must be at least ${field.min}`,
              });
            }
            if (field.max !== undefined && value > field.max) {
              errors.push({
                field: field.key,
                message: `${field.label} must be at most ${field.max}`,
              });
            }
          }
          break;

        case "select":
          if (field.options && !field.options.includes(value)) {
            errors.push({
              field: field.key,
              message: `${field.label} must be one of the allowed options`,
            });
          }
          break;

        case "multiselect":
          if (field.options && Array.isArray(value)) {
            const invalidOptions = value.filter((v) => !field.options?.includes(v));
            if (invalidOptions.length > 0) {
              errors.push({
                field: field.key,
                message: `${field.label} contains invalid options: ${invalidOptions.join(", ")}`,
              });
            }
          }
          break;

        case "url":
          try {
            new URL(value);
          } catch {
            errors.push({
              field: field.key,
              message: `${field.label} must be a valid URL`,
            });
          }
          break;
      }

      // Add to validated data if no errors
      if (!errors.some((e) => e.field === field.key)) {
        validatedData[field.key] = value;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      validatedData,
    };
  },
});