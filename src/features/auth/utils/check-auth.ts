import { requireAuth as requireAuthFromRepo, getAuthCookies } from "../repository";

export async function requireAuth(tenantSlug: string) {
  return requireAuthFromRepo(tenantSlug);
}

export async function checkAuth() {
  return getAuthCookies();
}