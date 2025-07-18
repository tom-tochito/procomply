"use server";

import type { Tenant } from "@/features/tenant/models";
import { findUserByEmail } from "@/features/user/repository";

import { setAuthCookies } from "../repository";

export interface CheckUserResult {
  success: boolean;
  exists: boolean;
  error?: string;
}

export interface SetAuthCookiesResult {
  success: boolean;
  error?: string;
}

/**
 * Check if a user exists for the given email and tenant
 * This is called before sending a magic code on the client
 */
export async function checkUserExistsAction(
  email: string,
  tenant: Tenant
): Promise<CheckUserResult> {
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return {
        success: true,
        exists: false,
      };
    }

    // Check if user belongs to the tenant or is an admin
    const belongsToTenant = user.tenant?.id === tenant.id;
    const isAdmin = user.profile?.role === "admin";

    return {
      success: true,
      exists: belongsToTenant || isAdmin,
    };
  } catch (error) {
    console.error("Error checking user:", error);
    return {
      success: false,
      exists: false,
      error: "Failed to check user existence",
    };
  }
}

/**
 * Set auth cookies after successful magic code verification
 * This is called after the client successfully verifies the magic code
 */
export async function setAuthCookiesAction(
  email: string,
  tenant: Tenant
): Promise<SetAuthCookiesResult> {
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Check if user belongs to the tenant or is an admin
    const belongsToTenant = user.tenant?.id === tenant.id;
    const isAdmin = user.profile?.role === "admin";

    if (!belongsToTenant && !isAdmin) {
      return {
        success: false,
        error: "User not authorized for this tenant",
      };
    }

    // Set auth cookies with full user object
    await setAuthCookies(user);

    return { success: true };
  } catch (error) {
    console.error("Error setting auth cookies:", error);
    return {
      success: false,
      error: "Failed to complete authentication",
    };
  }
}
