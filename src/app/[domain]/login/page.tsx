"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { TENANTS } from "@/data/tenants";
import logo from "@/assets/images/logo.png";
import { useState, FormEvent } from "react";

export default function Page() {
  const router = useRouter();
  const { domain } = useParams();

  // Try to match domain to known tenants
  const _tenant = domain?.toString().split(".")[0];
  const tenant = TENANTS.find((t) => t.id === _tenant);

  if (!tenant) {
    // If tenant not found, show 404
    notFound();
  }

  // Controlled form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Simple client-side check:
    if (email === "admin@procomply.co.uk" && password === "password") {
      // On success, route them to the dashboard for this tenant
      router.push(`/dashboard`);
    } else {
      alert("Invalid credentials!");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 sm:px-0">
      <div className="w-full max-w-sm rounded-md bg-white p-6 sm:p-8 shadow-md">
        <Image src={logo} alt="ProComply" className="w-full mb-5 block" />
        <h1 className="mb-1 text-center text-xl font-semibold">
          Welcome to ProComply
        </h1>
        <p className="mb-6 text-center text-sm text-black/75">
          Log in to{" "}
          <span className="font-semibold capitalize">{tenant?.name}</span>
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
              className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#F30] focus:outline-none focus:ring-1 focus:ring-[#F30]"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#F30] focus:outline-none focus:ring-1 focus:ring-[#F30]"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-[#F30] py-2 text-sm font-semibold text-white hover:bg-[#E02D00] focus:outline-none focus:ring-2 focus:ring-[#F30] focus:ring-offset-2"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-black/60">
          ProComply © 2025
        </p>
      </div>
    </main>
  );
}
