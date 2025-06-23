import * as path from "path";

export function getFileUrl(tenant: string, inputPath: `/${string}`) {
  const normalizedPath = path.normalize(inputPath).replace(/^\//, "");
  
  // If the path already starts with /files/, remove it to avoid duplication
  const pathWithoutFiles = normalizedPath.replace(/^files\//, "");
  
  const tenantPrefix = `tenant/${tenant}/`;

  // Check if the path already includes the tenant prefix
  if (pathWithoutFiles.startsWith(tenantPrefix)) {
    // Remove the tenant prefix and add it back with /files/
    const pathWithoutTenant = pathWithoutFiles.slice(tenantPrefix.length);
    return path.join("/", "tenant", tenant, "files", pathWithoutTenant);
  }
  
  // Check if the path starts with just "tenant/" (for cross-tenant paths)
  if (pathWithoutFiles.startsWith("tenant/")) {
    // Replace "tenant/" with "/tenant/{tenant}/files/"
    return path.join("/", pathWithoutFiles.replace(/^tenant\//, `tenant/${tenant}/files/`));
  }

  // For paths that don't have tenant prefix, add the full prefix
  return path.join("/", "tenant", tenant, "files", pathWithoutFiles);
}
