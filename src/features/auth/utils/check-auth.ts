import { requireAuth as requireAuthFromRepo, getAuthCookies } from "../repository";
import { findTenantBySubdomain } from "@/features/tenant/repository";

export async function requireAuth(tenantSubdomain: string) {
  return requireAuthFromRepo(tenantSubdomain);
}

export async function checkAuth() {
  return getAuthCookies();
}

export async function getTenantIdBySubdomain(subdomain: string): Promise<string | null> {
  const tenant = await findTenantBySubdomain(subdomain);
  return tenant?.id || null;
}