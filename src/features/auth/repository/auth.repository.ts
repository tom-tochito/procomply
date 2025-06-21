"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generateTenantRedirectUrl } from "@/utils/tenant";
import { type AppSchema } from "~/instant.schema";
import { type InstaQLEntity } from "@instantdb/react";

type User = InstaQLEntity<AppSchema, "$users">;

const AUTH_COOKIE_NAME = "procomply-auth";
const TENANT_COOKIE_NAME = "procomply-tenant";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface AuthCookieData {
  userId: string;
  tenantId: string;
  email: string;
}

/**
 * Set authentication cookies after successful login
 */
export async function setAuthCookies(user: User, tenantId: string): Promise<void> {
  const cookieStore = await cookies();
  
  const authData: AuthCookieData = {
    userId: user.id,
    tenantId,
    email: user.email,
  };

  cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(authData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });

  cookieStore.set(TENANT_COOKIE_NAME, tenantId, {
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
  cookieStore.delete(TENANT_COOKIE_NAME);
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
export async function requireAuth(tenantSubdomain: string): Promise<AuthCookieData> {
  const auth = await getAuthCookies();
  
  if (!auth) {
    redirect(generateTenantRedirectUrl(tenantSubdomain, "/login"));
  }
  
  // TODO: Validate tenant relationship
  
  return auth;
}

/**
 * Get current user's tenant ID from cookies
 */
export async function getCurrentTenantId(): Promise<string | null> {
  const cookieStore = await cookies();
  const tenantCookie = cookieStore.get(TENANT_COOKIE_NAME);
  return tenantCookie?.value || null;
}