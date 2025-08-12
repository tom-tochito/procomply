import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireTenantAccess } from "./helpers/tenantAccess";

export const getBuildings = query({
  args: {
    tenantId: v.id("tenants"),
    divisionId: v.optional(v.id("divisions")),
  },
  returns: v.array(
    v.object({
      _id: v.id("buildings"),
      _creationTime: v.number(),
      tenantId: v.id("tenants"),
      templateId: v.optional(v.id("templates")),
      divisionId: v.optional(v.id("divisions")),
      name: v.string(),
      image: v.optional(v.string()),
      division: v.optional(v.string()),
      data: v.optional(v.any()),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    const { tenantId } = await requireTenantAccess(ctx, args.tenantId);

    // Get buildings for the tenant
    const buildings = await ctx.db
      .query("buildings")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
    
    // Filter by division if provided
    if (args.divisionId) {
      return buildings.filter(b => b.divisionId === args.divisionId);
    }
    
    return buildings;
  },
});

export const getBuilding = query({
  args: { 
    buildingId: v.id("buildings"),
    tenantId: v.id("tenants"),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await requireTenantAccess(ctx, args.tenantId);

    const building = await ctx.db.get(args.buildingId);
    if (!building) return null;

    // Verify building belongs to the tenant
    if (building.tenantId !== tenantId) {
      throw new Error("Access denied");
    }

    // Get related data
    const template = building.templateId 
      ? await ctx.db.get(building.templateId) 
      : undefined;
    
    const divisionEntity = building.divisionId
      ? await ctx.db.get(building.divisionId)
      : undefined;

    return {
      ...building,
      template,
      divisionEntity,
    };
  },
});

export const createBuilding = mutation({
  args: {
    tenantId: v.id("tenants"),
    name: v.string(),
    templateId: v.optional(v.id("templates")),
    divisionId: v.optional(v.id("divisions")),
    image: v.optional(v.string()),
    division: v.optional(v.string()),
    data: v.optional(v.any()),
  },
  returns: v.id("buildings"),
  handler: async (ctx, args) => {
    const { tenantId } = await requireTenantAccess(ctx, args.tenantId);

    const now = Date.now();

    return await ctx.db.insert("buildings", {
      tenantId,
      name: args.name,
      templateId: args.templateId,
      divisionId: args.divisionId,
      image: args.image,
      division: args.division,
      data: args.data,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateBuilding = mutation({
  args: {
    buildingId: v.id("buildings"),
    tenantId: v.id("tenants"),
    name: v.optional(v.string()),
    templateId: v.optional(v.id("templates")),
    divisionId: v.optional(v.id("divisions")),
    image: v.optional(v.string()),
    division: v.optional(v.string()),
    data: v.optional(v.any()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { tenantId } = await requireTenantAccess(ctx, args.tenantId);

    const building = await ctx.db.get(args.buildingId);
    if (!building) {
      throw new Error("Building not found");
    }

    // Verify building belongs to the tenant
    if (building.tenantId !== tenantId) {
      throw new Error("Access denied");
    }

    const updates: any = { updatedAt: Date.now() };
    if (args.name !== undefined) updates.name = args.name;
    if (args.templateId !== undefined) updates.templateId = args.templateId;
    if (args.divisionId !== undefined) updates.divisionId = args.divisionId;
    if (args.image !== undefined) updates.image = args.image;
    if (args.division !== undefined) updates.division = args.division;
    if (args.data !== undefined) updates.data = args.data;

    await ctx.db.patch(args.buildingId, updates);
    return null;
  },
});

export const deleteBuilding = mutation({
  args: { 
    buildingId: v.id("buildings"),
    tenantId: v.id("tenants"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { tenantId } = await requireTenantAccess(ctx, args.tenantId);

    const building = await ctx.db.get(args.buildingId);
    if (!building) {
      throw new Error("Building not found");
    }

    // Verify building belongs to the tenant
    if (building.tenantId !== tenantId) {
      throw new Error("Access denied");
    }

    // Delete related data
    // Delete tasks
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_building", (q) => q.eq("buildingId", args.buildingId))
      .collect();
    
    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }

    // Delete documents
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_building", (q) => q.eq("buildingId", args.buildingId))
      .collect();
    
    for (const doc of documents) {
      await ctx.db.delete(doc._id);
    }

    // Delete compliance checks
    const complianceChecks = await ctx.db
      .query("complianceChecks")
      .withIndex("by_building", (q) => q.eq("buildingId", args.buildingId))
      .collect();
    
    for (const check of complianceChecks) {
      await ctx.db.delete(check._id);
    }

    // Delete contacts
    const contacts = await ctx.db
      .query("contacts")
      .withIndex("by_building", (q) => q.eq("buildingId", args.buildingId))
      .collect();
    
    for (const contact of contacts) {
      await ctx.db.delete(contact._id);
    }

    // Delete notes
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_building", (q) => q.eq("buildingId", args.buildingId))
      .collect();
    
    for (const note of notes) {
      await ctx.db.delete(note._id);
    }

    // Delete year planner events
    const events = await ctx.db
      .query("yearPlannerEvents")
      .withIndex("by_building", (q) => q.eq("buildingId", args.buildingId))
      .collect();
    
    for (const event of events) {
      await ctx.db.delete(event._id);
    }

    // Finally delete the building
    await ctx.db.delete(args.buildingId);
    return null;
  },
});