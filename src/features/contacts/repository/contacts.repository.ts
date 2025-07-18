"use server";

import { id } from "@instantdb/admin";
import { dbAdmin } from "~/lib/db-admin";
import { getAuthCookies } from "@/features/auth/repository/auth.repository";
import type { ContactWithRelations } from "@/features/contacts/models";
import type { Building, BuildingWithRelations } from "@/features/buildings/models";
import type { Tenant } from "@/features/tenant/models";

export async function createContact(
  building: Building | BuildingWithRelations,
  tenant: Tenant,
  data: {
    name: string;
    role?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    department?: string;
    notes?: string;
    isPrimary?: boolean;
  }
): Promise<string> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  const contactId = id();
  const now = Date.now();

  await dbAdmin.transact([
    dbAdmin.tx.contacts[contactId]
      .update({
        ...data,
        isPrimary: data.isPrimary || false,
        createdAt: now,
        updatedAt: now,
      })
      .link({
        building: building.id,
        tenant: tenant.id,
        creator: auth.user.id,
      }),
  ]);

  return contactId;
}

export async function updateContact(
  contactId: string,
  data: {
    name?: string;
    role?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    department?: string;
    notes?: string;
    isPrimary?: boolean;
  }
): Promise<void> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  const now = Date.now();

  await dbAdmin.transact([
    dbAdmin.tx.contacts[contactId].update({
      ...data,
      updatedAt: now,
    }),
  ]);
}

export async function getContactsByBuilding(
  building: Building | BuildingWithRelations
): Promise<ContactWithRelations[]> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  const result = await dbAdmin.query({
    contacts: {
      $: {
        where: { "building.id": building.id },
        order: { isPrimary: "desc", createdAt: "desc" },
      },
      building: {},
      tenant: {},
      creator: {},
    },
  });

  return result.contacts || [];
}

export async function deleteContact(contactId: string): Promise<void> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  // Get contact to verify access
  const result = await dbAdmin.query({
    contacts: {
      $: {
        where: { id: contactId },
      },
      building: {
        tenant: {},
      },
    },
  });

  const contact = result.contacts[0];
  if (!contact) throw new Error("Contact not found");

  // Verify user has access
  const isAdmin = auth.user.profile?.role === "admin";
  const belongsToTenant =
    auth.user.tenant?.id === contact.building?.tenant?.id;

  if (!isAdmin && !belongsToTenant) {
    throw new Error("Unauthorized: User must be admin or belong to tenant");
  }

  // Delete record
  await dbAdmin.transact([dbAdmin.tx.contacts[contactId].delete()]);
}