"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function uploadFile(path: `/${string}`, file: File) {
  const context = await getCloudflareContext({ async: true });
  const bucket = context.env.PROCOMPLY_BUCKET;
  bucket.put(path, file);
  return path;
}

export async function downloadFile(path: `/${string}`) {
  const context = await getCloudflareContext({ async: true });
  const bucket = context.env.PROCOMPLY_BUCKET;
  const file = await bucket.get(path);
  return file;
}

export async function deleteFile(path: `/${string}`) {
  const context = await getCloudflareContext({ async: true });
  const bucket = context.env.PROCOMPLY_BUCKET;
  await bucket.delete(path);
}
