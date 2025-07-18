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
  name?: string;
  phone?: string;
  phoneMobile?: string;
  position?: string;
  companyId?: string;
}): Promise<FullUser | null> {
  try {
    const userId = id();
    const profileId = id();
    const now = Date.now();

    const transactions = [
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
          ...(data.name && { name: data.name }),
          ...(data.phone && { phone: data.phone }),
          ...(data.phoneMobile && { phoneMobile: data.phoneMobile }),
          ...(data.position && { position: data.position }),
          createdAt: now,
          updatedAt: now,
        })
        .link({ $user: userId }),
    ];

    // Link to company if provided
    if (data.companyId) {
      transactions.push(
        dbAdmin.tx.userProfiles[profileId].link({ company: data.companyId })
      );
    }

    await dbAdmin.transact(transactions);

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
    name: string;
    phone: string;
    phoneMobile: string;
    position: string;
    companyId: string;
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

    // Update profile data if provided
    const profileUpdates: Record<string, unknown> = {};
    if (data.role) profileUpdates.role = data.role;
    if (data.name) profileUpdates.name = data.name;
    if (data.phone) profileUpdates.phone = data.phone;
    if (data.phoneMobile) profileUpdates.phoneMobile = data.phoneMobile;
    if (data.position) profileUpdates.position = data.position;

    if (Object.keys(profileUpdates).length > 0) {
      // First, get the user's profile
      const result = await dbAdmin.query({
        $users: {
          $: { where: { id: userId } },
          profile: {},
        },
      });

      const userProfile = result.$users?.[0]?.profile;
      if (userProfile) {
        profileUpdates.updatedAt = Date.now();
        transactions.push(
          dbAdmin.tx.userProfiles[userProfile.id].update(profileUpdates)
        );

        // Update company link if provided
        if (data.companyId) {
          transactions.push(
            dbAdmin.tx.userProfiles[userProfile.id].link({ company: data.companyId })
          );
        }
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
 * Get all users for a tenant with extended profile data
 */
export async function findUsersWithProfilesByTenant(
  tenantId: string
): Promise<FullUser[]> {
  try {
    const result = await dbAdmin.query({
      $users: {
        $: {
          where: {
            "tenant.id": tenantId,
          },
          order: { email: "asc" },
        },
        tenant: {},
        profile: {
          company: {},
        },
      },
    });

    return result.$users || [];
  } catch (error) {
    console.error("Error fetching users by tenant:", error);
    return [];
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
