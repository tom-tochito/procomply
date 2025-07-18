"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function uploadFile(tenant: string, path: string, file: File) {
  const context = await getCloudflareContext({ async: true });
  const bucket = context.env.PROCOMPLY_BUCKET;
  await bucket.put(`/tenant/${tenant}/${path}`, file);
  return path;
}

export async function deleteFile(tenant: string, path: string) {
  const context = await getCloudflareContext({ async: true });
  const bucket = context.env.PROCOMPLY_BUCKET;
  await bucket.delete(`/tenant/${tenant}/${path}`);
}
