import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { requireTenantAccess } from "./helpers/tenantAccess";

export const getDocuments = query({
  args: {
    tenantId: v.id("tenants"),
    buildingId: v.optional(v.id("buildings")),
    category: v.optional(v.string()),
    docCategory: v.optional(v.string()),
    isStatutory: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
  },
  returns: v.array(
    v.object({
      _id: v.id("documents"),
      _creationTime: v.number(),
      tenantId: v.id("tenants"),
      buildingId: v.optional(v.id("buildings")),
      templateId: v.optional(v.id("templates")),
      uploaderId: v.id("users"),
      name: v.string(),
      type: v.string(),
      path: v.string(),
      size: v.number(),
      docType: v.optional(v.string()),
      code: v.optional(v.string()),
      reference: v.optional(v.string()),
      description: v.optional(v.string()),
      category: v.optional(v.string()),
      subCategory: v.optional(v.string()),
      docCategory: v.optional(v.string()),
      validFrom: v.optional(v.number()),
      expiryDate: v.optional(v.number()),
      isStatutory: v.optional(v.boolean()),
      isActive: v.optional(v.boolean()),
      data: v.optional(v.any()),
      uploadedAt: v.number(),
      createdAt: v.number(),
      updatedAt: v.number(),
      building: v.optional(v.object({
        _id: v.id("buildings"),
        name: v.string(),
      })),
      uploader: v.optional(v.object({
        _id: v.id("users"),
        email: v.optional(v.string()),
      })),
    })
  ),
  handler: async (ctx, args) => {
    const { tenantId } = await requireTenantAccess(ctx, args.tenantId);
    
    // Get documents for the tenant
    let documents = await ctx.db
      .query("documents")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
    
    // Apply filters
    if (args.buildingId !== undefined) {
      documents = documents.filter(d => d.buildingId === args.buildingId);
    }
    if (args.category !== undefined) {
      documents = documents.filter(d => d.category === args.category);
    }
    if (args.docCategory !== undefined) {
      documents = documents.filter(d => d.docCategory === args.docCategory);
    }
    if (args.isStatutory !== undefined) {
      documents = documents.filter(d => d.isStatutory === args.isStatutory);
    }
    if (args.isActive !== undefined) {
      documents = documents.filter(d => d.isActive === args.isActive);
    }
    
    // Fetch related data
    const documentsWithRelations = await Promise.all(
      documents.map(async (doc) => {
        const building = doc.buildingId 
          ? await ctx.db.get(doc.buildingId) 
          : undefined;
        const uploader = await ctx.db.get(doc.uploaderId);
        
        return {
          ...doc,
          building: building ? { _id: building._id, name: building.name } : undefined,
          uploader: uploader ? { _id: uploader._id, email: uploader.email } : undefined,
        };
      })
    );
    
    return documentsWithRelations;
  },
});

export const getDocument = query({
  args: { 
    documentId: v.id("documents"),
  },
  returns: v.union(
    v.object({
      _id: v.id("documents"),
      _creationTime: v.number(),
      tenantId: v.id("tenants"),
      buildingId: v.optional(v.id("buildings")),
      templateId: v.optional(v.id("templates")),
      uploaderId: v.id("users"),
      name: v.string(),
      type: v.string(),
      path: v.string(),
      size: v.number(),
      docType: v.optional(v.string()),
      code: v.optional(v.string()),
      reference: v.optional(v.string()),
      description: v.optional(v.string()),
      category: v.optional(v.string()),
      subCategory: v.optional(v.string()),
      docCategory: v.optional(v.string()),
      validFrom: v.optional(v.number()),
      expiryDate: v.optional(v.number()),
      isStatutory: v.optional(v.boolean()),
      isActive: v.optional(v.boolean()),
      data: v.optional(v.any()),
      uploadedAt: v.number(),
      createdAt: v.number(),
      updatedAt: v.number(),
      building: v.optional(v.any()),
      template: v.optional(v.any()),
      uploader: v.optional(v.any()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document) return null;

    // Check user has access to the document's tenant
    await requireTenantAccess(ctx, document.tenantId);

    // Get related data
    const building = document.buildingId 
      ? await ctx.db.get(document.buildingId) 
      : undefined;
    const template = document.templateId 
      ? await ctx.db.get(document.templateId) 
      : undefined;
    const uploader = await ctx.db.get(document.uploaderId);

    return {
      ...document,
      building,
      template,
      uploader,
    };
  },
});

export const createDocument = mutation({
  args: {
    tenantId: v.id("tenants"), // Required for testing
    uploaderId: v.id("users"), // Required for testing
    buildingId: v.optional(v.id("buildings")),
    templateId: v.optional(v.id("templates")),
    name: v.string(),
    type: v.string(),
    path: v.string(),
    size: v.number(),
    docType: v.optional(v.string()),
    code: v.optional(v.string()),
    reference: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    subCategory: v.optional(v.string()),
    docCategory: v.optional(v.string()),
    validFrom: v.optional(v.number()),
    expiryDate: v.optional(v.number()),
    isStatutory: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
    data: v.optional(v.any()),
  },
  returns: v.id("documents"),
  handler: async (ctx, args) => {
    const { tenantId, userId } = await requireTenantAccess(ctx, args.tenantId);

    const now = Date.now();

    return await ctx.db.insert("documents", {
      tenantId,
      buildingId: args.buildingId,
      templateId: args.templateId,
      uploaderId: args.uploaderId,
      name: args.name,
      type: args.type,
      path: args.path,
      size: args.size,
      docType: args.docType,
      code: args.code,
      reference: args.reference,
      description: args.description,
      category: args.category,
      subCategory: args.subCategory,
      docCategory: args.docCategory,
      validFrom: args.validFrom,
      expiryDate: args.expiryDate,
      isStatutory: args.isStatutory ?? false,
      isActive: args.isActive ?? true,
      data: args.data,
      uploadedAt: now,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateDocument = mutation({
  args: {
    documentId: v.id("documents"),
    tenantId: v.optional(v.id("tenants")), // Optional for access check
    buildingId: v.optional(v.id("buildings")),
    templateId: v.optional(v.id("templates")),
    name: v.optional(v.string()),
    docType: v.optional(v.string()),
    code: v.optional(v.string()),
    reference: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    subCategory: v.optional(v.string()),
    docCategory: v.optional(v.string()),
    validFrom: v.optional(v.number()),
    expiryDate: v.optional(v.number()),
    isStatutory: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
    data: v.optional(v.any()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    // Optional access check if tenantId is provided
    if (args.tenantId && document.tenantId !== args.tenantId) {
      throw new Error("Access denied");
    }

    const updates: any = { updatedAt: Date.now() };
    if (args.buildingId !== undefined) updates.buildingId = args.buildingId;
    if (args.templateId !== undefined) updates.templateId = args.templateId;
    if (args.name !== undefined) updates.name = args.name;
    if (args.docType !== undefined) updates.docType = args.docType;
    if (args.code !== undefined) updates.code = args.code;
    if (args.reference !== undefined) updates.reference = args.reference;
    if (args.description !== undefined) updates.description = args.description;
    if (args.category !== undefined) updates.category = args.category;
    if (args.subCategory !== undefined) updates.subCategory = args.subCategory;
    if (args.docCategory !== undefined) updates.docCategory = args.docCategory;
    if (args.validFrom !== undefined) updates.validFrom = args.validFrom;
    if (args.expiryDate !== undefined) updates.expiryDate = args.expiryDate;
    if (args.isStatutory !== undefined) updates.isStatutory = args.isStatutory;
    if (args.isActive !== undefined) updates.isActive = args.isActive;
    if (args.data !== undefined) updates.data = args.data;

    await ctx.db.patch(args.documentId, updates);
    return null;
  },
});

export const deleteDocument = mutation({
  args: { 
    documentId: v.id("documents"),
    tenantId: v.optional(v.id("tenants")), // Optional for access check
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    // Optional access check if tenantId is provided
    if (args.tenantId && document.tenantId !== args.tenantId) {
      throw new Error("Access denied");
    }

    // TODO: Delete file from storage (R2) using the path

    await ctx.db.delete(args.documentId);
    return null;
  },
});