import * as path from "path";

export function getFileUrl(tenant: string, inputPath: string) {
  console.log("inputPath", inputPath);
  console.log("tenant", tenant);

  const normalizedPath = path.normalize(inputPath).replace(/^\//, "");

  return path.join("/", "tenant", tenant, "files", normalizedPath);
}
