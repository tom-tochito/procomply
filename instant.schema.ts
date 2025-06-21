import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    userProfiles: i.entity({
      role: i.string().indexed(), // "user" or "admin"
      createdAt: i.date().indexed(),
      updatedAt: i.date().indexed(),
    }),
    tenants: i.entity({
      name: i.string(),
      slug: i.string().unique().indexed(),
      description: i.string(),
      createdAt: i.date().indexed(),
      updatedAt: i.date().indexed(),
    }),
    buildings: i.entity({
      name: i.string(),
      address: i.string(),
      city: i.string().indexed(),
      state: i.string().indexed(),
      zipCode: i.string(),
      floors: i.number(),
      createdAt: i.date().indexed(),
      updatedAt: i.date().indexed(),
    }),
    templates: i.entity({
      name: i.string(),
      type: i.string().indexed(),
      content: i.json(),
      isActive: i.boolean().indexed(),
      createdAt: i.date().indexed(),
      updatedAt: i.date().indexed(),
    }),
    inspections: i.entity({
      type: i.string().indexed(),
      status: i.string().indexed(),
      scheduledDate: i.date().indexed(),
      completedDate: i.date(),
      results: i.json(),
      notes: i.string(),
      createdAt: i.date().indexed(),
      updatedAt: i.date().indexed(),
    }),
    tasks: i.entity({
      title: i.string(),
      description: i.string(),
      status: i.string().indexed(),
      priority: i.string().indexed(),
      dueDate: i.date().indexed(),
      completedDate: i.date(),
      createdAt: i.date().indexed(),
      updatedAt: i.date().indexed(),
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
  },
});

type AppSchema = typeof _schema;
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
