"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useLocalStorage } from "./useLocalStorage";

export function useAuth() {
  const [userId] = useLocalStorage<Id<"users"> | null>("userId", null);
  const user = useQuery(
    api.simpleAuth.getCurrentUser,
    userId ? { userId } : { userId: undefined }
  );

  return {
    user,
    isAuthenticated: !!user,
    isLoading: user === undefined,
  };
}