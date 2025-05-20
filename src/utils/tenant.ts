import { PROTOCOL, ROOT_DOMAIN } from "@/constants";

export function generateTenantRedirectUrl(subdomain: string, path: string) {
  const tenant = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, "");
  const isPreview = subdomain.includes("---");

  if (isPreview) {
    return `${PROTOCOL}://${tenant}---${ROOT_DOMAIN}/${path}`;
  }

  return `${PROTOCOL}://${tenant}.${ROOT_DOMAIN}/${path}`;
}
