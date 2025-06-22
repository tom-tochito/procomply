import * as path from "path";

export function getFileUrl(tenant: string, inputPath: `/${string}`) {
  const normalizedPath = path.normalize(inputPath).replace(/^\//, "");
  const tenantPrefix = `tenant/${tenant}/`;
  const pathWithoutTenant = normalizedPath.startsWith(tenantPrefix)
    ? normalizedPath.slice(tenantPrefix.length)
    : normalizedPath;
  return path.join("/", "tenant", tenant, "files", pathWithoutTenant);
}
