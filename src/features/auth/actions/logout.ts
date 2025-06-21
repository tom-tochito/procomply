"use server";

import { redirect } from "next/navigation";
import { clearAuthCookies } from "../repository";
import { generateTenantRedirectUrl } from "@/utils/tenant";

export async function logoutAction(tenantSubdomain: string) {
  await clearAuthCookies();
  redirect(generateTenantRedirectUrl(tenantSubdomain, "/login"));
}