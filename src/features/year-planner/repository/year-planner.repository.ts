"use server";

import { id } from "@instantdb/admin";
import { dbAdmin } from "~/lib/db-admin";
import { getAuthCookies } from "@/features/auth/repository/auth.repository";
import type { YearPlannerEventWithRelations } from "@/features/year-planner/models";
import type { Building, BuildingWithRelations } from "@/features/buildings/models";
import type { Tenant } from "@/features/tenant/models";

export async function createYearPlannerEvent(
  building: Building | BuildingWithRelations,
  tenant: Tenant,
  data: {
    title: string;
    description?: string;
    eventType: string;
    startDate: Date | string;
    endDate?: Date | string;
    allDay?: boolean;
    status?: string;
    reminder?: boolean;
    reminderDays?: number;
  }
): Promise<string> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  const eventId = id();
  const now = new Date().toISOString();

  await dbAdmin.transact([
    dbAdmin.tx.yearPlannerEvents[eventId]
      .update({
        title: data.title,
        description: data.description,
        eventType: data.eventType,
        startDate: typeof data.startDate === "string" ? data.startDate : data.startDate.toISOString(),
        endDate: data.endDate ? (typeof data.endDate === "string" ? data.endDate : data.endDate.toISOString()) : undefined,
        allDay: data.allDay || false,
        status: data.status || "scheduled",
        reminder: data.reminder || false,
        reminderDays: data.reminderDays,
        createdAt: now,
        updatedAt: now,
      })
      .link({
        building: building.id,
        tenant: tenant.id,
        creator: auth.user.id,
      }),
  ]);

  return eventId;
}

export async function updateYearPlannerEvent(
  eventId: string,
  data: {
    title?: string;
    description?: string;
    eventType?: string;
    startDate?: Date | string;
    endDate?: Date | string;
    allDay?: boolean;
    status?: string;
    reminder?: boolean;
    reminderDays?: number;
  }
): Promise<void> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  const now = new Date().toISOString();
  interface UpdateData {
    updatedAt: string;
    title?: string;
    description?: string;
    eventType?: string;
    startDate?: string;
    endDate?: string;
    allDay?: boolean;
    status?: string;
    reminder?: boolean;
    reminderDays?: number;
  }
  
  const updateData: UpdateData = { updatedAt: now };

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.eventType !== undefined) updateData.eventType = data.eventType;
  if (data.startDate !== undefined) {
    updateData.startDate = typeof data.startDate === "string" ? data.startDate : data.startDate.toISOString();
  }
  if (data.endDate !== undefined) {
    updateData.endDate = data.endDate ? (typeof data.endDate === "string" ? data.endDate : data.endDate.toISOString()) : undefined;
  }
  if (data.allDay !== undefined) updateData.allDay = data.allDay;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.reminder !== undefined) updateData.reminder = data.reminder;
  if (data.reminderDays !== undefined) updateData.reminderDays = data.reminderDays;

  await dbAdmin.transact([
    dbAdmin.tx.yearPlannerEvents[eventId].update(updateData),
  ]);
}

export async function getYearPlannerEventsByBuilding(
  building: Building | BuildingWithRelations,
  options?: {
    startDate?: Date;
    endDate?: Date;
    eventType?: string;
    status?: string;
  }
): Promise<YearPlannerEventWithRelations[]> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  // Build where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = { "building.id": building.id };
  
  if (options?.startDate) {
    where.startDate = { $gte: options.startDate.toISOString() };
  }
  if (options?.endDate) {
    where.startDate = { ...where.startDate, $lte: options.endDate.toISOString() };
  }
  if (options?.eventType) {
    where.eventType = options.eventType;
  }
  if (options?.status) {
    where.status = options.status;
  }

  const result = await dbAdmin.query({
    yearPlannerEvents: {
      $: {
        where,
        order: { startDate: "asc" },
      },
      building: {},
      tenant: {},
      creator: {},
    },
  });

  return result.yearPlannerEvents || [];
}

export async function deleteYearPlannerEvent(eventId: string): Promise<void> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  // Get event to verify access
  const result = await dbAdmin.query({
    yearPlannerEvents: {
      $: {
        where: { id: eventId },
      },
      building: {
        tenant: {},
      },
    },
  });

  const event = result.yearPlannerEvents[0];
  if (!event) throw new Error("Event not found");

  // Verify user has access
  const isAdmin = auth.user.profile?.role === "admin";
  const belongsToTenant = auth.user.tenant?.id === event.building?.tenant?.id;

  if (!isAdmin && !belongsToTenant) {
    throw new Error("Unauthorized: User must be admin or belong to tenant");
  }

  // Delete record
  await dbAdmin.transact([dbAdmin.tx.yearPlannerEvents[eventId].delete()]);
}