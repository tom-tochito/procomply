"use server";

import { redirect } from "next/navigation";
import { AuthRepository } from "../repository";
import { generateTenantRedirectUrl } from "@/utils/tenant";

export async function logoutAction(tenantSubdomain: string) {
  await AuthRepository.clearAuthCookies();
  redirect(generateTenantRedirectUrl(tenantSubdomain, "/login"));
}