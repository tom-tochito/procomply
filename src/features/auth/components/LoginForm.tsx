"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export function LoginForm() {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.set("email", email);
      await signIn("resend", formData);
      setIsSuccess(true);
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to send magic link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
          <p className="font-semibold">Check your email!</p>
          <p className="mt-1">
            We've sent a magic link to {email}. Click the link in the email to
            log in.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsSuccess(false);
            setEmail("");
          }}
          className="w-full rounded border border-gray-300 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#F30] focus:ring-offset-2"
        >
          Try a different email
        </button>
      </div>
    );
  }

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
        {isLoading ? "Sending magic link..." : "Send Magic Link"}
      </button>
    </form>
  );
}
