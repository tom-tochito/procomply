"use server";

import { id } from "@instantdb/admin";
import { dbAdmin } from "~/lib/db-admin";
import { getAuthCookies } from "@/features/auth/repository/auth.repository";
import type { FullUser } from "@/features/user/repository/user.repository";
import type { Task, TaskWithRelations } from "@/features/tasks/models";
import type { Tenant } from "@/features/tenant/models";
import { dateInputToTimestamp } from "@/common/utils/date";

async function validateUserAccess(
  user: FullUser,
  tenant: Tenant
): Promise<boolean> {
  const isAdmin = user.profile?.role === "admin";
  const belongsToTenant = user.tenant?.id === tenant.id;
  return isAdmin || belongsToTenant;
}

export async function getTasksByTenant(
  tenant: Tenant
): Promise<TaskWithRelations[]> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  if (!(await validateUserAccess(auth.user, tenant))) {
    throw new Error("Unauthorized: User must be admin or belong to tenant");
  }

  const result = await dbAdmin.query({
    tasks: {
      $: {
        where: { "tenant.id": tenant.id },
        order: { dueDate: "asc" },
      },
      building: {},
      assignee: {},
      creator: {},
      tenant: {},
    },
  });

  return result.tasks || [];
}

export async function getTasksByBuilding(
  buildingId: string
): Promise<TaskWithRelations[]> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  const result = await dbAdmin.query({
    tasks: {
      $: {
        where: { "building.id": buildingId },
        order: { dueDate: "asc" },
      },
      building: {},
      assignee: {},
      creator: {},
      tenant: {},
    },
  });

  return result.tasks || [];
}

export async function createTask(
  data: {
    title: string;
    description?: string;
    status: string;
    priority: string;
    dueDate: string;
    buildingId?: string;
    assigneeId?: string;
    tenantId: string;
  }
): Promise<Task> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  const taskId = id();
  const now = Date.now();

  const linkData: {
    creator: string;
    tenant: string;
    building?: string;
    assignee?: string;
  } = {
    creator: auth.user.id,
    tenant: data.tenantId,
  };

  if (data.buildingId) {
    linkData.building = data.buildingId;
  }

  if (data.assigneeId) {
    linkData.assignee = data.assigneeId;
  }

  const transactions = [
    dbAdmin.tx.tasks[taskId]
      .update({
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: dateInputToTimestamp(data.dueDate),
        createdAt: now,
        updatedAt: now,
      })
      .link(linkData),
  ];

  await dbAdmin.transact(transactions);

  const result = await dbAdmin.query({
    tasks: {
      $: { where: { id: taskId } },
    },
  });

  return result.tasks[0];
}

export async function updateTask(
  taskId: string,
  data: Partial<{
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string;
    completedDate: string;
    assigneeId: string;
  }>
): Promise<boolean> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  try {
    const updates: Record<string, string | number | undefined> = {
      updatedAt: Date.now(),
    };
    
    if (data.title !== undefined) updates.title = data.title;
    if (data.description !== undefined) updates.description = data.description;
    if (data.status !== undefined) updates.status = data.status;
    if (data.priority !== undefined) updates.priority = data.priority;
    if (data.dueDate !== undefined) updates.dueDate = dateInputToTimestamp(data.dueDate);
    if (data.completedDate !== undefined) updates.completedDate = dateInputToTimestamp(data.completedDate);

    const transactions = [dbAdmin.tx.tasks[taskId].update(updates)];

    // Update assignee link if provided
    if (data.assigneeId !== undefined) {
      if (data.assigneeId) {
        transactions.push(
          dbAdmin.tx.tasks[taskId].link({ assignee: data.assigneeId })
        );
      } else {
        transactions.push(
          dbAdmin.tx.tasks[taskId].unlink({ assignee: auth.user.id })
        );
      }
    }

    await dbAdmin.transact(transactions);
    return true;
  } catch (error) {
    console.error("Error updating task:", error);
    return false;
  }
}

export async function deleteTask(taskId: string): Promise<boolean> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  try {
    await dbAdmin.transact([dbAdmin.tx.tasks[taskId].delete()]);
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    return false;
  }
}