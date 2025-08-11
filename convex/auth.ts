import { auth } from "./auth.config";

export const { getSessionId } = auth;

// Custom getUserIdentity function
export async function getUserIdentity(ctx: { auth: any }) {
  const userId = await auth.getUserId(ctx);
  if (!userId) return null;
  
  return {
    subject: userId,
    tokenIdentifier: userId,
  };
}