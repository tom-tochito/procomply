"use server";

import { redirect } from "next/navigation";

import type { Tenant } from "@/features/tenant/models";
import { generateTenantRedirectUrl } from "@/features/tenant/utils/tenant.utils";

import { clearAuthCookies } from "../repository";

export async function logoutAction(tenant: Tenant) {
  await clearAuthCookies();
  redirect(generateTenantRedirectUrl(tenant.slug, "/login"));
}
