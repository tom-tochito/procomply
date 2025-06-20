import { AuthRepository } from "../repository";
import { TenantRepository } from "@/features/tenant/repository";

export async function requireAuth(tenantSubdomain: string) {
  return AuthRepository.requireAuth(tenantSubdomain);
}

export async function checkAuth() {
  return AuthRepository.getAuthCookies();
}

export async function getTenantIdBySubdomain(subdomain: string): Promise<string | null> {
  const tenant = await TenantRepository.findBySubdomain(subdomain);
  return tenant?.id || null;
}