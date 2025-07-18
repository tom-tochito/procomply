import { PROTOCOL, ROOT_DOMAIN } from "@/common/constants";

export function generateTenantRedirectUrl(
  tenantSlug = "akelius",
  path: `/${string}`
) {
  return `${PROTOCOL}://${ROOT_DOMAIN}/tenant/${tenantSlug}${path}`;
}
