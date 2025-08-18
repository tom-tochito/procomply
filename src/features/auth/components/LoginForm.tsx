"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvex } from "convex/react";
import { api } from "~/convex/_generated/api";
import type { Doc } from "~/convex/_generated/dataModel";

interface LoginFormProps {
  tenant: Doc<"tenants">;
}

export function LoginForm({ tenant }: LoginFormProps) {
  const { signIn } = useAuthActions();
  const convex = useConvex();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"email" | "otp">("email");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Check if email has access to this tenant
      const validation = await convex.query(api.users.validateEmailForTenant, {
        email,
        tenantId: tenant._id,
      });

      if (!validation.isValid) {
        setError(validation.message);
        return;
      }

      // Send OTP
      const formData = new FormData();
      formData.set("email", email);
      await signIn("resend-otp", formData);
      
      setStep("otp");
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.set("email", email);
      formData.set("code", otp);
      await signIn("resend-otp", formData);
      
      // The auth system will handle the redirect
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Invalid verification code. Please try again.");
      setIsLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <form className="space-y-4" onSubmit={handleOtpSubmit}>
        <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800">
          <p className="font-semibold">Check your email!</p>
          <p className="mt-1">
            We&apos;ve sent a verification code to {email}
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="otp"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Verification Code
          </label>
          <input
            id="otp"
            name="otp"
            type="text"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={isLoading}
            className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#F30] focus:outline-none focus:ring-1 focus:ring-[#F30] disabled:bg-gray-100"
            placeholder="Enter 6-digit code"
            autoFocus
            maxLength={6}
            pattern="[0-9]{6}"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="w-full rounded bg-[#F30] py-2 text-sm font-semibold text-white hover:bg-[#E02D00] focus:outline-none focus:ring-2 focus:ring-[#F30] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying..." : "Verify Code"}
        </button>

        <button
          type="button"
          onClick={() => {
            setStep("email");
            setOtp("");
            setError("");
          }}
          className="w-full rounded border border-gray-300 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#F30] focus:ring-offset-2"
        >
          Use a different email
        </button>
      </form>
    );
  }

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