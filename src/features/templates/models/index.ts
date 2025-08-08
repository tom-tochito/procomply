import { InstaQLEntity } from "@instantdb/react";
import { AppSchema } from "~/instant.schema";

// Base template type from InstantDB
export type Template = InstaQLEntity<AppSchema, "templates">;

// Template with related buildings
export type TemplateWithBuildings = InstaQLEntity<
  AppSchema,
  "templates",
  { buildings: object }
>;

// Template field type (matching schema)
export interface TemplateField {
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

// Built-in fields for building templates
export const BUILDING_BUILTIN_FIELDS: TemplateField[] = [
  {
    key: "name",
    label: "Building Name",
    type: "text",
    required: true,
    placeholder: "Enter building name",
    helpText: "The official name of the building",
  },
  {
    key: "image",
    label: "Building Image",
    type: "image",
    required: false,
    placeholder: "Upload building image",
    accept: "image/*",
    helpText: "Main image of the building",
  },
];

// Template types enum
export type TemplateType = "building" | "task" | "document" | "inspection" | "general";

// Built-in fields for tasks
export const TASK_BUILTIN_FIELDS: TemplateField[] = [
  {
    key: "title",
    label: "Task Title",
    type: "text",
    required: true,
    placeholder: "Enter task title",
    helpText: "A clear, concise title for the task",
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    required: false,
    placeholder: "Enter task description",
    rows: 3,
    helpText: "Detailed description of what needs to be done",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    required: true,
    options: ["Pending", "In Progress", "Completed", "Cancelled"],
    placeholder: "Select status",
  },
  {
    key: "priority",
    label: "Priority",
    type: "select",
    required: true,
    options: ["Low", "Medium", "High", "Urgent"],
    placeholder: "Select priority",
  },
  {
    key: "dueDate",
    label: "Due Date",
    type: "date",
    required: true,
    placeholder: "Select due date",
    helpText: "When this task needs to be completed",
  },
];

// Built-in fields for documents
export const DOCUMENT_BUILTIN_FIELDS: TemplateField[] = [
  {
    key: "name",
    label: "Document Name",
    type: "text",
    required: true,
    placeholder: "Enter document name",
    helpText: "The name of the document",
  },
  {
    key: "file",
    label: "Document File",
    type: "file",
    required: true,
    placeholder: "Upload document",
    accept: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv",
    helpText: "Upload the document file",
  },
  {
    key: "docType",
    label: "Document Type",
    type: "select",
    required: true,
    options: ["Policy", "Certificate", "Manual", "Report", "Contract", "Other"],
    placeholder: "Select document type",
  },
  {
    key: "category",
    label: "Category",
    type: "select",
    required: false,
    options: ["Health & Safety", "Environment", "Quality", "Legal", "Financial", "Operational"],
    placeholder: "Select category",
  },
  {
    key: "expiryDate",
    label: "Expiry Date",
    type: "date",
    required: false,
    placeholder: "Select expiry date",
    helpText: "When this document expires (if applicable)",
  },
];

// Built-in fields for inspections
export const INSPECTION_BUILTIN_FIELDS: TemplateField[] = [
  {
    key: "type",
    label: "Inspection Type",
    type: "text",
    required: true,
    placeholder: "Enter inspection type",
    helpText: "Type of inspection being conducted",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    required: true,
    options: ["Scheduled", "In Progress", "Completed", "Cancelled", "Failed"],
    placeholder: "Select status",
  },
  {
    key: "scheduledDate",
    label: "Scheduled Date",
    type: "date",
    required: true,
    placeholder: "Select scheduled date",
    helpText: "When the inspection is scheduled",
  },
  {
    key: "notes",
    label: "Notes",
    type: "textarea",
    required: false,
    placeholder: "Enter any notes",
    rows: 4,
    helpText: "Additional notes or observations",
  },
];

// Helper function to get built-in fields by template type
export function getBuiltinFieldsByType(type: TemplateType): TemplateField[] {
  switch (type) {
    case "building":
      return BUILDING_BUILTIN_FIELDS;
    case "task":
      return TASK_BUILTIN_FIELDS;
    case "document":
      return DOCUMENT_BUILTIN_FIELDS;
    case "inspection":
      return INSPECTION_BUILTIN_FIELDS;
    case "general":
      return [];
    default:
      return [];
  }
}

// Common field templates for buildings
export const BUILDING_COMMON_FIELDS: TemplateField[] = [
  {
    key: "status",
    label: "Status",
    type: "select",
    required: true,
    options: ["Active", "Archived", "Under Maintenance"],
    placeholder: "Select status",
  },
  {
    key: "address",
    label: "Address",
    type: "text",
    required: true,
    placeholder: "Enter full address",
  },
  {
    key: "city",
    label: "City",
    type: "text",
    required: true,
    placeholder: "Enter city",
  },
  {
    key: "state",
    label: "State/Province",
    type: "text",
    required: true,
    placeholder: "Enter state or province",
  },
  {
    key: "zipCode",
    label: "ZIP/Postal Code",
    type: "text",
    required: true,
    placeholder: "Enter ZIP or postal code",
  },
  {
    key: "floors",
    label: "Number of Floors",
    type: "number",
    required: true,
    min: 1,
    max: 200,
    placeholder: "Enter number of floors",
  },
  {
    key: "yearBuilt",
    label: "Year Built",
    type: "number",
    required: false,
    min: 1800,
    max: new Date().getFullYear() + 1,
    placeholder: "Enter year built",
  },
  {
    key: "totalArea",
    label: "Total Area (sq ft)",
    type: "number",
    required: false,
    min: 0,
    placeholder: "Enter total area",
  },
  {
    key: "occupancy",
    label: "Occupancy Type",
    type: "select",
    required: false,
    options: ["Residential", "Commercial", "Industrial", "Mixed Use", "Government", "Educational", "Healthcare"],
    placeholder: "Select occupancy type",
  },
  {
    key: "propertyManager",
    label: "Property Manager",
    type: "text",
    required: false,
    placeholder: "Enter property manager name",
  },
  {
    key: "contactPhone",
    label: "Contact Phone",
    type: "text",
    required: false,
    placeholder: "Enter contact phone number",
  },
  {
    key: "contactEmail",
    label: "Contact Email",
    type: "text",
    required: false,
    placeholder: "Enter contact email",
  },
  {
    key: "emergencyContact",
    label: "24/7 Emergency Contact",
    type: "text",
    required: false,
    placeholder: "Enter emergency contact number",
  },
];