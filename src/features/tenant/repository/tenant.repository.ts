"use server";

import { dbAdmin } from "~/lib/db-admin";
import { id } from "@instantdb/admin";
import type { InstaQLEntity } from "@instantdb/react";
import type { AppSchema } from "~/instant.schema";

type Tenant = InstaQLEntity<AppSchema, "tenants">;

/**
 * Find a tenant by ID
 */
export async function findTenantById(tenantId: string): Promise<Tenant | null> {
  try {
    const result = await dbAdmin.query({
      tenants: {
        $: {
          where: { id: tenantId },
        },
      },
    });

    return result.tenants?.[0] || null;
  } catch (error) {
    console.error("Error fetching tenant:", error);
    return null;
  }
}

/**
 * Find a tenant by subdomain (assuming subdomain matches id for now)
 */
export async function findTenantBySubdomain(subdomain: string): Promise<Tenant | null> {
  // In a real app, you might have a separate subdomain field
  // For now, using ID as subdomain
  return findTenantById(subdomain);
}

/**
 * Create a new tenant
 */
export async function createTenant(data: {
  name: string;
  description: string;
}): Promise<Tenant | null> {
  try {
    const tenantId = id();
    await dbAdmin.transact([
      dbAdmin.tx.tenants[tenantId].update({
        name: data.name,
        description: data.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    ]);

    return findTenantById(tenantId);
  } catch (error) {
    console.error("Error creating tenant:", error);
    return null;
  }
}

/**
 * Update a tenant
 */
export async function updateTenant(
  tenantId: string,
  data: Partial<{
    name: string;
    description: string;
  }>
): Promise<boolean> {
  try {
    await dbAdmin.transact([
      dbAdmin.tx.tenants[tenantId].update({
        ...data,
        updatedAt: new Date().toISOString(),
      }),
    ]);
    return true;
  } catch (error) {
    console.error("Error updating tenant:", error);
    return false;
  }
}

/**
 * Get all tenants
 */
export async function findAllTenants(): Promise<Tenant[]> {
  try {
    const result = await dbAdmin.query({
      tenants: {},
    });

    return result.tenants || [];
  } catch (error) {
    console.error("Error fetching all tenants:", error);
    return [];
  }
}