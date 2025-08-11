"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { api } from "../../../../convex/_generated/api";
import { fetchMutation } from "convex/nextjs";

// Initialize S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

interface UploadDocumentParams {
  file: File;
  buildingId: string;
  category?: string;
  docCategory?: string;
  description?: string;
}

export async function uploadDocumentAction(params: UploadDocumentParams) {
  try {
    const { file, buildingId, ...metadata } = params;
    
    // Generate unique file key
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileKey = `documents/${buildingId}/${timestamp}-${randomString}-${sanitizedFileName}`;

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: fileKey,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(uploadCommand);

    // Create document record in Convex
    const documentId = await fetchMutation(api.documents.createDocument, {
      buildingId: buildingId as any,
      name: file.name,
      type: file.type,
      path: fileKey,
      size: file.size,
      category: metadata.category,
      docCategory: metadata.docCategory,
      description: metadata.description,
      isActive: true,
    });

    return {
      success: true,
      documentId,
      fileKey,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}