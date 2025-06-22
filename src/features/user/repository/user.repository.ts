"use server";

import { dbAdmin } from "~/lib/db-admin";
import { id } from "@instantdb/admin";
import type { FullUser } from "@/features/user/models";

export type { FullUser };


/**
 * Find a user by email (regardless of tenant)
 */
export async function findUserByEmail(
  email: string
): Promise<FullUser | null> {
  try {
    const result = await dbAdmin.query({
      $users: {
        $: {
          where: { email },
        },
        tenant: {},
        profile: {},
      },
    });

    return result.$users?.[0] || null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
}

/**
 * Create a new user
 */
export async function createUser(data: {
  email: string;
  role: string;
  tenantId: string;
}): Promise<FullUser | null> {
  try {
    const userId = id();
    const profileId = id();
    const now = new Date().toISOString();

    await dbAdmin.transact([
      // Create user
      dbAdmin.tx.$users[userId]
        .update({
          email: data.email,
        })
        .link({ tenant: data.tenantId }),
      // Create user profile
      dbAdmin.tx.userProfiles[profileId]
        .update({
          role: data.role,
          createdAt: now,
          updatedAt: now,
        })
        .link({ $user: userId }),
    ]);

    // Fetch and return the created user
    return findUserByEmail(data.email);
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

/**
 * Update a user
 */
export async function updateUser(
  userId: string,
  data: Partial<{
    email: string;
    role: string;
  }>
): Promise<boolean> {
  try {
    const transactions = [];

    // Update email if provided
    if (data.email) {
      transactions.push(
        dbAdmin.tx.$users[userId].update({ email: data.email })
      );
    }

    // Update role if provided
    if (data.role) {
      // First, get the user's profile
      const result = await dbAdmin.query({
        $users: {
          $: { where: { id: userId } },
          profile: {},
        },
      });

      const userProfile = result.$users?.[0]?.profile;
      if (userProfile) {
        transactions.push(
          dbAdmin.tx.userProfiles[userProfile.id].update({
            role: data.role,
            updatedAt: new Date().toISOString(),
          })
        );
      }
    }

    if (transactions.length > 0) {
      await dbAdmin.transact(transactions);
    }

    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
}

/**
 * Delete a user
 */
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    await dbAdmin.transact([dbAdmin.tx.$users[userId].delete()]);
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
}

/**
 * Get all users for a tenant
 */
export async function findUsersByTenant(
  tenantId: string
): Promise<FullUser[]> {
  try {
    const result = await dbAdmin.query({
      $users: {
        $: {
          where: {
            "tenant.id": tenantId,
          },
        },
        tenant: {},
        profile: {},
      },
    });

    return result.$users || [];
  } catch (error) {
    console.error("Error fetching users by tenant:", error);
    return [];
  }
}
