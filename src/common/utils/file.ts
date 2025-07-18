import * as path from "path";

export function getFileUrl(tenant: string, inputPath: string) {
  const normalizedPath = path.normalize(inputPath).replace(/^\//, "");

  return path.join("/", "tenant", tenant, "files", normalizedPath);
}
