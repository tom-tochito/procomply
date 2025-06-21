"use server";

import { findUserByEmailAndTenant } from "@/features/user/repository";
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
  tenantId: string
): Promise<CheckUserResult> {
  try {
    const user = await findUserByEmailAndTenant(email, tenantId);
    
    return { 
      success: true,
      exists: !!user
    };
  } catch (error) {
    console.error("Error checking user:", error);
    return { 
      success: false, 
      exists: false,
      error: "Failed to check user existence" 
    };
  }
}

/**
 * Set auth cookies after successful magic code verification
 * This is called after the client successfully verifies the magic code
 */
export async function setAuthCookiesAction(
  email: string,
  tenantId: string
): Promise<SetAuthCookiesResult> {
  try {
    // Get the user to ensure they still exist
    const user = await findUserByEmailAndTenant(email, tenantId);
    
    if (!user) {
      return { 
        success: false, 
        error: "User not found" 
      };
    }

    // Set auth cookies
    await setAuthCookies(user, tenantId);
    
    return { success: true };
  } catch (error) {
    console.error("Error setting auth cookies:", error);
    return { 
      success: false, 
      error: "Failed to complete authentication" 
    };
  }
}