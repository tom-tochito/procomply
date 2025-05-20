import { PROTOCOL, ROOT_DOMAIN } from "@/constants";

export function generateTenantRedirectUrl(domain = "akelius", path: string) {
  //const tenant = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, "");

  return `${PROTOCOL}://${ROOT_DOMAIN}/tenant/${domain}/${path}`;
}
