"use client";

import { useRouter } from "next/navigation";
import { useLocalStorage } from "./useLocalStorage";
import { Id } from "../../../../convex/_generated/dataModel";

export function useLogout() {
  const router = useRouter();
  const [, setUserId] = useLocalStorage<Id<"users"> | null>("userId", null);

  const logout = async (redirectPath: string = "/") => {
    try {
      // Clear user session
      setUserId(null);
      // Clear any other auth-related data
      localStorage.removeItem("userId");
      router.push(redirectPath);
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, redirect to login
      router.push(redirectPath);
    }
  };

  return logout;
}