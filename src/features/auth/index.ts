export { LoginForm } from "./components/LoginForm";

// Server-side auth placeholder
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function requireAuth(_tenant: unknown) {
  // In Convex, auth is handled client-side
  return true;
}

export function getAuthCookies() {
  // In Convex, auth is handled client-side
  return {};
}