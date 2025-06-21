export const PROTOCOL =
  process.env.NODE_ENV === "production" ? "https" : "http";
export const ROOT_DOMAIN =
  process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
