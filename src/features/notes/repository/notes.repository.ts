"use server";

import { id } from "@instantdb/admin";
import { dbAdmin } from "~/lib/db-admin";
import { getAuthCookies } from "@/features/auth/repository/auth.repository";
import type { NoteWithRelations } from "@/features/notes/models";
import type { Building, BuildingWithRelations } from "@/features/buildings/models";
import type { Tenant } from "@/features/tenant/models";

export async function createNote(
  building: Building | BuildingWithRelations,
  tenant: Tenant,
  data: {
    title: string;
    content: string;
    category?: string;
    priority?: string;
  }
): Promise<string> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  const noteId = id();
  const now = new Date().toISOString();

  await dbAdmin.transact([
    dbAdmin.tx.notes[noteId]
      .update({
        title: data.title,
        content: data.content,
        category: data.category || "general",
        priority: data.priority || "medium",
        createdAt: now,
        updatedAt: now,
      })
      .link({
        building: building.id,
        tenant: tenant.id,
        creator: auth.user.id,
      }),
  ]);

  return noteId;
}

export async function updateNote(
  noteId: string,
  data: {
    title?: string;
    content?: string;
    category?: string;
    priority?: string;
  }
): Promise<void> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  const now = new Date().toISOString();

  await dbAdmin.transact([
    dbAdmin.tx.notes[noteId].update({
      ...data,
      updatedAt: now,
    }),
  ]);
}

export async function getNotesByBuilding(
  building: Building | BuildingWithRelations
): Promise<NoteWithRelations[]> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  const result = await dbAdmin.query({
    notes: {
      $: {
        where: { "building.id": building.id },
        order: { createdAt: "desc" },
      },
      building: {},
      tenant: {},
      creator: {},
    },
  });

  return result.notes || [];
}

export async function deleteNote(noteId: string): Promise<void> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  // Get note to verify access
  const result = await dbAdmin.query({
    notes: {
      $: {
        where: { id: noteId },
      },
      building: {
        tenant: {},
      },
    },
  });

  const note = result.notes[0];
  if (!note) throw new Error("Note not found");

  // Verify user has access
  const isAdmin = auth.user.profile?.role === "admin";
  const belongsToTenant = auth.user.tenant?.id === note.building?.tenant?.id;

  if (!isAdmin && !belongsToTenant) {
    throw new Error("Unauthorized: User must be admin or belong to tenant");
  }

  // Delete record
  await dbAdmin.transact([dbAdmin.tx.notes[noteId].delete()]);
}