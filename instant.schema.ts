import { i } from "@instantdb/react";

// Template field type definition
interface TemplateField {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "select" | "multiselect" | "checkbox" | "image" | "file" | "url";
  required: boolean;
  placeholder?: string;
  helpText?: string;
  // Type-specific options
  options?: string[]; // For select/multiselect
  min?: number; // For number type
  max?: number; // For number type
  rows?: number; // For textarea
  accept?: string; // For file/image types
}

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    userProfiles: i.entity({
      role: i.string().indexed(), // "user" or "admin"
      name: i.string().optional(),
      phone: i.string().optional(),
      phoneMobile: i.string().optional(),
      position: i.string().optional(), // job title/position
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),
    tenants: i.entity({
      name: i.string(),
      slug: i.string().unique().indexed(),
      description: i.string(),
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),
    buildings: i.entity({
      name: i.string(),
      image: i.string().optional(), // Path to building image in storage
      division: i.string().optional(), // For organizational grouping
      data: i.json<Record<string, any>>().optional(), // Stores all template field values
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),
    templates: i.entity({
      name: i.string(),
      type: i.string().indexed(),
      fields: i.json<TemplateField[]>(),
      isActive: i.boolean().indexed(),
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),
    inspections: i.entity({
      type: i.string().indexed(),
      status: i.string().indexed(),
      scheduledDate: i.number().indexed(),
      completedDate: i.number().optional(),
      results: i.json().optional(),
      notes: i.string().optional(),
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),
    tasks: i.entity({
      title: i.string(),
      description: i.string().optional(),
      status: i.string().indexed(),
      priority: i.string().indexed(),
      dueDate: i.number().indexed(),
      completedDate: i.number().optional(),
      data: i.json<Record<string, any>>().optional(), // Stores all template field values
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),
    documents: i.entity({
      name: i.string(),
      type: i.string().indexed(),
      path: i.string(), // Storage path
      size: i.number(),
      // Document metadata
      docType: i.string().optional(), // Policy, Certificate, Manual, etc.
      code: i.string().indexed().optional(),
      reference: i.string().indexed().optional(),
      description: i.string().optional(),
      // Categories
      category: i.string().indexed().optional(), // Health & Safety, Environment, etc.
      subCategory: i.string().optional(),
      docCategory: i.string().indexed().optional(), // Asbestos, Electrical, Fire, etc.
      // Validity dates
      validFrom: i.number().optional(),
      expiryDate: i.number().indexed().optional(),
      // Status flags
      isStatutory: i.boolean().indexed().optional(),
      isActive: i.boolean().indexed().optional(),
      data: i.json<Record<string, any>>().optional(), // Stores all template field values
      // Timestamps
      uploadedAt: i.number().indexed(),
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),
    companies: i.entity({
      name: i.string(),
      referral: i.string(),
      category: i.string().optional(),
      email: i.string().optional(),
      phone: i.string().optional(),
      postcode: i.string().optional(),
      numberOfEmployees: i.number().optional(),
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),
    divisions: i.entity({
      name: i.string().indexed(),
      type: i.string().indexed(), // "Active", "Archived", "Leased"
      description: i.string().optional(),
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),
    teams: i.entity({
      code: i.string().optional(),
      description: i.string(),
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),
    complianceChecks: i.entity({
      checkType: i.string().indexed(), // annualFlatDoor, asbestosReinspections, etc.
      status: i.string().indexed(), // success, warning, overdue, pending
      dueDate: i.number().indexed(),
      completedDate: i.number().optional(),
      notes: i.string().optional(),
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),
    contacts: i.entity({
      name: i.string(),
      role: i.string().optional(),
      email: i.string().optional(),
      phone: i.string().optional(),
      mobile: i.string().optional(),
      department: i.string().optional(),
      notes: i.string().optional(),
      isPrimary: i.boolean().indexed(),
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),
    notes: i.entity({
      title: i.string(),
      content: i.string(),
      category: i.string().indexed(), // general, maintenance, compliance, etc.
      priority: i.string().indexed(), // low, medium, high
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),
    yearPlannerEvents: i.entity({
      title: i.string(),
      description: i.string().optional(),
      eventType: i.string().indexed(), // inspection, maintenance, compliance, meeting, etc.
      startDate: i.number().indexed(),
      endDate: i.number().optional(),
      allDay: i.boolean(),
      status: i.string().indexed(), // scheduled, completed, cancelled
      reminder: i.boolean(),
      reminderDays: i.number().optional(),
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),
    // Template Management Entities
    countries: i.entity({
      code: i.string().unique().indexed(),
      description: i.string(),
      isActive: i.boolean().indexed(),
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),
    legislation: i.entity({
      code: i.string().unique().indexed(),
      title: i.string(),
      url: i.string().optional(),
      isActive: i.boolean().indexed(),
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),
    riskAreas: i.entity({
      code: i.string().unique().indexed(),
      description: i.string(),
      isActive: i.boolean().indexed(),
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),
    subsections: i.entity({
      code: i.string().unique().indexed(),
      description: i.string(),
      isActive: i.boolean().indexed(),
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),
    surveyTypes: i.entity({
      code: i.string().unique().indexed(),
      description: i.string(),
      isActive: i.boolean().indexed(),
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),
    taskCategories: i.entity({
      code: i.string().unique().indexed(),
      description: i.string(),
      isActive: i.boolean().indexed(),
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),
  },
  links: {
    userProfile: {
      forward: { on: "userProfiles", has: "one", label: "$user" },
      reverse: { on: "$users", has: "one", label: "profile" },
    },
    userTenant: {
      forward: { on: "tenants", has: "many", label: "users" },
      reverse: { on: "$users", has: "one", label: "tenant" },
    },
    buildingTenant: {
      forward: { on: "buildings", has: "one", label: "tenant" },
      reverse: { on: "tenants", has: "many", label: "buildings" },
    },
    templateTenant: {
      forward: { on: "templates", has: "one", label: "tenant" },
      reverse: { on: "tenants", has: "many", label: "templates" },
    },
    inspectionBuilding: {
      forward: { on: "inspections", has: "one", label: "building" },
      reverse: { on: "buildings", has: "many", label: "inspections" },
    },
    inspectionTemplate: {
      forward: { on: "inspections", has: "one", label: "template" },
      reverse: { on: "templates", has: "many", label: "inspections" },
    },
    inspectionInspector: {
      forward: { on: "inspections", has: "one", label: "inspector" },
      reverse: { on: "$users", has: "many", label: "inspections" },
    },
    inspectionTenant: {
      forward: { on: "inspections", has: "one", label: "tenant" },
      reverse: { on: "tenants", has: "many", label: "inspections" },
    },
    taskBuilding: {
      forward: { on: "tasks", has: "one", label: "building" },
      reverse: { on: "buildings", has: "many", label: "tasks" },
    },
    taskAssignee: {
      forward: { on: "tasks", has: "one", label: "assignee" },
      reverse: { on: "$users", has: "many", label: "assignedTasks" },
    },
    taskCreator: {
      forward: { on: "tasks", has: "one", label: "creator" },
      reverse: { on: "$users", has: "many", label: "createdTasks" },
    },
    taskTenant: {
      forward: { on: "tasks", has: "one", label: "tenant" },
      reverse: { on: "tenants", has: "many", label: "tasks" },
    },
    documentBuilding: {
      forward: { on: "documents", has: "one", label: "building" },
      reverse: { on: "buildings", has: "many", label: "documents" },
    },
    documentUploader: {
      forward: { on: "documents", has: "one", label: "uploader" },
      reverse: { on: "$users", has: "many", label: "uploadedDocuments" },
    },
    documentTenant: {
      forward: { on: "documents", has: "one", label: "tenant" },
      reverse: { on: "tenants", has: "many", label: "documents" },
    },
    companyTenant: {
      forward: { on: "companies", has: "one", label: "tenant" },
      reverse: { on: "tenants", has: "many", label: "companies" },
    },
    divisionTenant: {
      forward: { on: "divisions", has: "one", label: "tenant" },
      reverse: { on: "tenants", has: "many", label: "divisions" },
    },
    divisionBuildings: {
      forward: { on: "buildings", has: "one", label: "divisionEntity" },
      reverse: { on: "divisions", has: "many", label: "buildings" },
    },
    buildingTemplate: {
      forward: { on: "buildings", has: "one", label: "template" },
      reverse: { on: "templates", has: "many", label: "buildings" },
    },
    taskTemplate: {
      forward: { on: "tasks", has: "one", label: "template" },
      reverse: { on: "templates", has: "many", label: "tasks" },
    },
    documentTemplate: {
      forward: { on: "documents", has: "one", label: "template" },
      reverse: { on: "templates", has: "many", label: "documents" },
    },
    teamTenant: {
      forward: { on: "teams", has: "one", label: "tenant" },
      reverse: { on: "tenants", has: "many", label: "teams" },
    },
    teamCompany: {
      forward: { on: "teams", has: "one", label: "company" },
      reverse: { on: "companies", has: "many", label: "teams" },
    },
    teamSupervisor: {
      forward: { on: "teams", has: "one", label: "supervisor" },
      reverse: { on: "userProfiles", has: "many", label: "supervisedTeams" },
    },
    personCompany: {
      forward: { on: "userProfiles", has: "one", label: "company" },
      reverse: { on: "companies", has: "many", label: "employees" },
    },
    complianceCheckBuilding: {
      forward: { on: "complianceChecks", has: "one", label: "building" },
      reverse: { on: "buildings", has: "many", label: "complianceChecks" },
    },
    complianceCheckTenant: {
      forward: { on: "complianceChecks", has: "one", label: "tenant" },
      reverse: { on: "tenants", has: "many", label: "complianceChecks" },
    },
    contactBuilding: {
      forward: { on: "contacts", has: "one", label: "building" },
      reverse: { on: "buildings", has: "many", label: "contacts" },
    },
    contactTenant: {
      forward: { on: "contacts", has: "one", label: "tenant" },
      reverse: { on: "tenants", has: "many", label: "contacts" },
    },
    contactCreator: {
      forward: { on: "contacts", has: "one", label: "creator" },
      reverse: { on: "$users", has: "many", label: "createdContacts" },
    },
    noteBuilding: {
      forward: { on: "notes", has: "one", label: "building" },
      reverse: { on: "buildings", has: "many", label: "notes" },
    },
    noteTenant: {
      forward: { on: "notes", has: "one", label: "tenant" },
      reverse: { on: "tenants", has: "many", label: "notes" },
    },
    noteCreator: {
      forward: { on: "notes", has: "one", label: "creator" },
      reverse: { on: "$users", has: "many", label: "createdNotes" },
    },
    yearPlannerEventBuilding: {
      forward: { on: "yearPlannerEvents", has: "one", label: "building" },
      reverse: { on: "buildings", has: "many", label: "yearPlannerEvents" },
    },
    yearPlannerEventTenant: {
      forward: { on: "yearPlannerEvents", has: "one", label: "tenant" },
      reverse: { on: "tenants", has: "many", label: "yearPlannerEvents" },
    },
    yearPlannerEventCreator: {
      forward: { on: "yearPlannerEvents", has: "one", label: "creator" },
      reverse: { on: "$users", has: "many", label: "createdYearPlannerEvents" },
    },
    // Template Management Links
    countryTenant: {
      forward: { on: "countries", has: "one", label: "tenant" },
      reverse: { on: "tenants", has: "many", label: "countries" },
    },
    legislationTenant: {
      forward: { on: "legislation", has: "one", label: "tenant" },
      reverse: { on: "tenants", has: "many", label: "legislation" },
    },
    riskAreaTenant: {
      forward: { on: "riskAreas", has: "one", label: "tenant" },
      reverse: { on: "tenants", has: "many", label: "riskAreas" },
    },
    subsectionTenant: {
      forward: { on: "subsections", has: "one", label: "tenant" },
      reverse: { on: "tenants", has: "many", label: "subsections" },
    },
    surveyTypeTenant: {
      forward: { on: "surveyTypes", has: "one", label: "tenant" },
      reverse: { on: "tenants", has: "many", label: "surveyTypes" },
    },
    taskCategoryTenant: {
      forward: { on: "taskCategories", has: "one", label: "tenant" },
      reverse: { on: "tenants", has: "many", label: "taskCategories" },
    },
  },
});

type AppSchema = typeof _schema;
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
