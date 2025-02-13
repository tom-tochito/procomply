import Image from "next/image";

import logo from "@/assets/images/logo.png";
import { TENANTS } from "@/data/tenants";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ domain: string }>;
}

export default async function Page({ params }: PageProps) {
  const { domain } = await params;

  const _tenant = domain.split(".")[0];

  const tenant = TENANTS.find((tenant) => tenant.id === _tenant);

  if (!tenant) notFound();

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded-md bg-white p-8 shadow-md">
        <Image src={logo} alt="ProComply" className="w-full mb-5 block" />
        <h1 className="mb-1 text-center text-xl font-semibold">
          Welcome to ProComply
        </h1>
        <p className="mb-6 text-center text-sm text-black/75">
          Log in to{" "}
          <span className="font-semibold capitalize">{tenant.name}</span>
        </p>
        <form className="space-y-4">
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
