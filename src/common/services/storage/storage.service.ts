"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function uploadFile(path: `/${string}`, file: File) {
  const context = await getCloudflareContext({ async: true });
  const bucket = context.env.PROCOMPLY_BUCKET;
  bucket.put(path, file);
  return path;
}

export async function getFileUrl(tenant: string, path: `/${string}`) {
  // Remove leading slash for URL construction
  const pathWithoutLeadingSlash = path.startsWith('/') ? path.slice(1) : path;
  return `/tenant/${tenant}/files/${pathWithoutLeadingSlash}`;
}

export async function deleteFile(path: `/${string}`) {
  const context = await getCloudflareContext({ async: true });
  const bucket = context.env.PROCOMPLY_BUCKET;
  await bucket.delete(path);
}
