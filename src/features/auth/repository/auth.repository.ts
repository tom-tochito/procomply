"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import type { FullUser } from "@/features/user/repository";

const AUTH_COOKIE_NAME = "procomply-auth";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface AuthCookieData {
  user: FullUser;
}

/**
 * Set authentication cookies after successful login
 */
export async function setAuthCookies(user: FullUser): Promise<void> {
  const cookieStore = await cookies();

  const authData: AuthCookieData = {
    user,
  };

  cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(authData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

/**
 * Get authentication data from cookies
 */
export async function getAuthCookies(): Promise<AuthCookieData | null> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);

  if (!authCookie?.value) {
    return null;
  }

  try {
    return JSON.parse(authCookie.value) as AuthCookieData;
  } catch {
    return null;
  }
}

/**
 * Clear authentication cookies (logout)
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const auth = await getAuthCookies();
  return !!auth;
}

/**
 * Require authentication for a page
 * Redirects to login if not authenticated
 */
export async function requireAuth(tenantSlug: string): Promise<AuthCookieData> {
  const auth = await getAuthCookies();

  if (!auth) {
    redirect(generateTenantRedirectUrl(tenantSlug, "/login"));
  }

  // Validate tenant relationship
  const userBelongsToTenant = auth.user.tenant?.slug === tenantSlug;
  const isAdmin = auth.user.profile?.role === "admin";

  if (!userBelongsToTenant && !isAdmin) {
    // User doesn't have access to this tenant
    redirect(generateTenantRedirectUrl(tenantSlug, "/login"));
  }

  return auth;
}
