"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

export function useLogout() {
  const router = useRouter();
  const { signOut } = useAuth();

  const logout = async (redirectPath: string = "/") => {
    try {
      await signOut();
      router.push(redirectPath);
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, redirect to login
      router.push(redirectPath);
    }
  };

  return logout;
}