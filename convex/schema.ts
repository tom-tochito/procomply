import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// Template field type validator
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

export default defineSchema({
  ...authTables,
  
  // Extend users table with additional fields
  users: defineTable({
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    image: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    // Additional fields
    tenantId: v.optional(v.id("tenants")),
    role: v.optional(v.string()), // "user" or "admin"
    phoneMobile: v.optional(v.string()),
    position: v.optional(v.string()),
    companyId: v.optional(v.id("companies")),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("email", ["email"])
    .index("by_emailVerificationTime", ["emailVerificationTime"])
    .index("phone", ["phone"])
    .index("by_phoneVerificationTime", ["phoneVerificationTime"])
    .index("by_role", ["role"])
    .index("by_company", ["companyId"])
    .index("by_createdAt", ["createdAt"])
    .index("by_updatedAt", ["updatedAt"]),

  tenants: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_createdAt", ["createdAt"])
    .index("by_updatedAt", ["updatedAt"]),

  userTenants: defineTable({
    userId: v.id("users"),
    tenantId: v.id("tenants"),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_tenant", ["tenantId"])
    .index("by_user_and_tenant", ["userId", "tenantId"]),

  buildings: defineTable({
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
    .index("by_tenant", ["tenantId"])
    .index("by_template", ["templateId"])
    .index("by_division", ["divisionId"])
    .index("by_createdAt", ["createdAt"])
    .index("by_updatedAt", ["updatedAt"]),

  templates: defineTable({
    tenantId: v.id("tenants"),
    name: v.string(),
    type: v.string(),
    fields: v.array(templateFieldValidator),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_type", ["type"])
    .index("by_active", ["isActive"])
    .index("by_tenant_and_type", ["tenantId", "type"])
    .index("by_createdAt", ["createdAt"])
    .index("by_updatedAt", ["updatedAt"]),

  inspections: defineTable({
    tenantId: v.id("tenants"),
    buildingId: v.id("buildings"),
    templateId: v.optional(v.id("templates")),
    inspectorId: v.optional(v.id("users")),
    type: v.string(),
    status: v.string(),
    scheduledDate: v.number(),
    completedDate: v.optional(v.number()),
    results: v.optional(v.any()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_building", ["buildingId"])
    .index("by_type", ["type"])
    .index("by_status", ["status"])
    .index("by_scheduledDate", ["scheduledDate"])
    .index("by_createdAt", ["createdAt"])
    .index("by_updatedAt", ["updatedAt"]),

  tasks: defineTable({
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
  })
    .index("by_tenant", ["tenantId"])
    .index("by_building", ["buildingId"])
    .index("by_assignee", ["assigneeId"])
    .index("by_creator", ["creatorId"])
    .index("by_status", ["status"])
    .index("by_priority", ["priority"])
    .index("by_dueDate", ["dueDate"])
    .index("by_tenant_and_status", ["tenantId", "status"])
    .index("by_building_and_status", ["buildingId", "status"])
    .index("by_createdAt", ["createdAt"])
    .index("by_updatedAt", ["updatedAt"]),

  documents: defineTable({
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
  })
    .index("by_tenant", ["tenantId"])
    .index("by_building", ["buildingId"])
    .index("by_uploader", ["uploaderId"])
    .index("by_type", ["type"])
    .index("by_code", ["code"])
    .index("by_reference", ["reference"])
    .index("by_category", ["category"])
    .index("by_docCategory", ["docCategory"])
    .index("by_expiryDate", ["expiryDate"])
    .index("by_statutory", ["isStatutory"])
    .index("by_active", ["isActive"])
    .index("by_tenant_and_building", ["tenantId", "buildingId"])
    .index("by_uploadedAt", ["uploadedAt"])
    .index("by_createdAt", ["createdAt"])
    .index("by_updatedAt", ["updatedAt"]),

  companies: defineTable({
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
    .index("by_tenant", ["tenantId"])
    .index("by_createdAt", ["createdAt"])
    .index("by_updatedAt", ["updatedAt"]),

  divisions: defineTable({
    tenantId: v.id("tenants"),
    name: v.string(),
    type: v.string(), // "Active", "Archived", "Leased"
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_name", ["name"])
    .index("by_type", ["type"])
    .index("by_tenant_and_type", ["tenantId", "type"])
    .index("by_createdAt", ["createdAt"])
    .index("by_updatedAt", ["updatedAt"]),

  teams: defineTable({
    tenantId: v.id("tenants"),
    companyId: v.optional(v.id("companies")),
    supervisorId: v.optional(v.id("users")),
    code: v.optional(v.string()),
    description: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_company", ["companyId"])
    .index("by_supervisor", ["supervisorId"])
    .index("by_createdAt", ["createdAt"])
    .index("by_updatedAt", ["updatedAt"]),

  complianceChecks: defineTable({
    tenantId: v.id("tenants"),
    buildingId: v.id("buildings"),
    checkType: v.string(),
    status: v.string(),
    dueDate: v.number(),
    completedDate: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_building", ["buildingId"])
    .index("by_checkType", ["checkType"])
    .index("by_status", ["status"])
    .index("by_dueDate", ["dueDate"])
    .index("by_tenant_and_status", ["tenantId", "status"])
    .index("by_building_and_status", ["buildingId", "status"])
    .index("by_createdAt", ["createdAt"])
    .index("by_updatedAt", ["updatedAt"]),

  contacts: defineTable({
    tenantId: v.id("tenants"),
    buildingId: v.optional(v.id("buildings")),
    creatorId: v.id("users"),
    name: v.string(),
    role: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    mobile: v.optional(v.string()),
    department: v.optional(v.string()),
    notes: v.optional(v.string()),
    isPrimary: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_building", ["buildingId"])
    .index("by_creator", ["creatorId"])
    .index("by_isPrimary", ["isPrimary"])
    .index("by_tenant_and_building", ["tenantId", "buildingId"])
    .index("by_createdAt", ["createdAt"])
    .index("by_updatedAt", ["updatedAt"]),

  notes: defineTable({
    tenantId: v.id("tenants"),
    buildingId: v.optional(v.id("buildings")),
    creatorId: v.id("users"),
    title: v.string(),
    content: v.string(),
    category: v.string(),
    priority: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_building", ["buildingId"])
    .index("by_creator", ["creatorId"])
    .index("by_category", ["category"])
    .index("by_priority", ["priority"])
    .index("by_tenant_and_building", ["tenantId", "buildingId"])
    .index("by_createdAt", ["createdAt"])
    .index("by_updatedAt", ["updatedAt"]),

  yearPlannerEvents: defineTable({
    tenantId: v.id("tenants"),
    buildingId: v.optional(v.id("buildings")),
    creatorId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    eventType: v.string(),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    allDay: v.boolean(),
    status: v.string(),
    reminder: v.boolean(),
    reminderDays: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_building", ["buildingId"])
    .index("by_creator", ["creatorId"])
    .index("by_eventType", ["eventType"])
    .index("by_startDate", ["startDate"])
    .index("by_status", ["status"])
    .index("by_tenant_and_building", ["tenantId", "buildingId"])
    .index("by_createdAt", ["createdAt"])
    .index("by_updatedAt", ["updatedAt"]),

  // Template Management Entities
  countries: defineTable({
    tenantId: v.id("tenants"),
    code: v.string(),
    name: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_code", ["code"])
    .index("by_tenant_and_code", ["tenantId", "code"])
    .index("by_active", ["isActive"])
    .index("by_createdAt", ["createdAt"])
    .index("by_updatedAt", ["updatedAt"]),

  legislation: defineTable({
    tenantId: v.id("tenants"),
    code: v.string(),
    title: v.string(),
    url: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_code", ["code"])
    .index("by_tenant_and_code", ["tenantId", "code"])
    .index("by_active", ["isActive"])
    .index("by_createdAt", ["createdAt"])
    .index("by_updatedAt", ["updatedAt"]),

  riskAreas: defineTable({
    tenantId: v.id("tenants"),
    code: v.string(),
    description: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_code", ["code"])
    .index("by_tenant_and_code", ["tenantId", "code"])
    .index("by_active", ["isActive"])
    .index("by_createdAt", ["createdAt"])
    .index("by_updatedAt", ["updatedAt"]),

  subsections: defineTable({
    tenantId: v.id("tenants"),
    code: v.string(),
    description: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_code", ["code"])
    .index("by_tenant_and_code", ["tenantId", "code"])
    .index("by_active", ["isActive"])
    .index("by_createdAt", ["createdAt"])
    .index("by_updatedAt", ["updatedAt"]),

  surveyTypes: defineTable({
    tenantId: v.id("tenants"),
    code: v.string(),
    description: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_code", ["code"])
    .index("by_tenant_and_code", ["tenantId", "code"])
    .index("by_active", ["isActive"])
    .index("by_createdAt", ["createdAt"])
    .index("by_updatedAt", ["updatedAt"]),

  taskCategories: defineTable({
    tenantId: v.id("tenants"),
    code: v.string(),
    description: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_code", ["code"])
    .index("by_tenant_and_code", ["tenantId", "code"])
    .index("by_active", ["isActive"])
    .index("by_createdAt", ["createdAt"])
    .index("by_updatedAt", ["updatedAt"]),
});