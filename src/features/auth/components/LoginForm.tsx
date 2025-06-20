"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { db } from "~/lib/db";
import { checkUserExistsAction, setAuthCookiesAction } from "../actions/magic-code";
import { generateTenantRedirectUrl } from "@/utils/tenant";

interface LoginFormProps {
  tenantId: string;
  tenantSubdomain: string;
}

type Step = "email" | "code";

export function LoginForm({ tenantId, tenantSubdomain }: LoginFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const codeInputRef = useRef<HTMLInputElement>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Check if user exists in our database
      const checkResult = await checkUserExistsAction(email, tenantId);
      
      if (!checkResult.success) {
        setError(checkResult.error || "Failed to verify email");
        return;
      }

      if (!checkResult.exists) {
        setError("No account found with this email address. Please contact your administrator.");
        return;
      }

      // Send magic code using InstantDB client
      await db.auth.sendMagicCode({ email });
      
      // Move to code step
      setStep("code");
    } catch (err) {
      const error = err as { body?: { message?: string } };
      setError(error.body?.message || "Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const code = codeInputRef.current?.value || "";

    try {
      // Verify magic code with InstantDB
      await db.auth.signInWithMagicCode({ email, code });
      
      // Set server-side auth cookies
      const cookieResult = await setAuthCookiesAction(email, tenantId);
      
      if (!cookieResult.success) {
        setError(cookieResult.error || "Failed to complete login");
        return;
      }

      // Redirect to dashboard
      router.push(generateTenantRedirectUrl(tenantSubdomain, "/dashboard"));
    } catch (err) {
      const error = err as { body?: { message?: string } };
      setError(error.body?.message || "Invalid verification code");
      codeInputRef.current!.value = "";
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "email") {
    return (
      <form className="space-y-4" onSubmit={handleEmailSubmit}>
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
          {isLoading ? "Sending code..." : "Send Verification Code"}
        </button>
      </form>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleCodeSubmit}>
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          We sent a verification code to <strong>{email}</strong>
        </p>
        <button
          type="button"
          onClick={() => setStep("email")}
          className="text-sm text-[#F30] hover:underline"
        >
          Use a different email
        </button>
      </div>

      <div>
        <label
          htmlFor="code"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Verification Code
        </label>
        <input
          ref={codeInputRef}
          id="code"
          name="code"
          type="text"
          required
          disabled={isLoading}
          className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#F30] focus:outline-none focus:ring-1 focus:ring-[#F30] disabled:bg-gray-100"
          placeholder="Enter 6-digit code"
          autoFocus
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded bg-[#F30] py-2 text-sm font-semibold text-white hover:bg-[#E02D00] focus:outline-none focus:ring-2 focus:ring-[#F30] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Verifying..." : "Verify & Login"}
      </button>
    </form>
  );
}