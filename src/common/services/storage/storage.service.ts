"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function uploadFile(tenant: string, path: string, file: File) {
  const context = await getCloudflareContext({ async: true });
  const bucket = context.env.PROCOMPLY_BUCKET;

  const sanitizedPath = path.replace(/^\//, "");
  const key = `tenant/${tenant}/${sanitizedPath}`;

  await bucket.put(key, file);
  return path;
}

export async function deleteFile(tenant: string, path: string) {
  const context = await getCloudflareContext({ async: true });
  const bucket = context.env.PROCOMPLY_BUCKET;

  const key = `tenant/${tenant}/${path}`;
  await bucket.delete(key);
}
