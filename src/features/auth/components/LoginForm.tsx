"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Id } from "../../../../convex/_generated/dataModel";

type Tenant = Doc<"tenants">;

interface LoginFormProps {
  tenant: Tenant;
}

export function LoginForm({ tenant }: LoginFormProps) {
  const router = useRouter();
  const signIn = useMutation(api.simpleAuth.signInWithEmail);
  const [, setUserId] = useLocalStorage<Id<"users"> | null>("userId", null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Simple sign in - accepts any email
      const result = await signIn({ email });
      
      // Store user ID in local storage
      setUserId(result.userId);
      
      // Redirect to dashboard
      router.push(generateTenantRedirectUrl(tenant.slug, "/dashboard"));
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#F30] focus:outline-none focus:ring-1 focus:ring-[#F30] disabled:bg-gray-100"
          placeholder="Enter your email"
          autoFocus
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded bg-[#F30] py-2 text-sm font-semibold text-white hover:bg-[#E02D00] focus:outline-none focus:ring-2 focus:ring-[#F30] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}