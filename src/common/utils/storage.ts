// Helper function to get public URL for a file
export function getStorageFileUrl(tenantSlug: string, filePath: string): string {
  if (!filePath) return "";
  
  // If it's already a full URL, return as is
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }
  
  // Get R2 public URL from environment or use default
  const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL || "";
  
  // If it's a relative path, construct the full R2 URL
  const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
  return `${R2_PUBLIC_URL}/${tenantSlug}/${cleanPath}`;
}