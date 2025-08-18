import { convexAuth } from "@convex-dev/auth/server";
import { ResendOTPProvider } from "./auth/ResendOTPProvider";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [ResendOTPProvider],
});
