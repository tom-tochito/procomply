import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import logo from "@/assets/images/logo.png";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { checkAuth } from "@/features/auth/utils/check-auth";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import { findTenantBySlug } from "@/features/tenant/repository";

interface PageProps {
  params: Promise<{ tenant: string }>;
}

export default async function LoginPage({ params }: PageProps) {
  const { tenant: slug } = await params;

  const auth = await checkAuth();
  if (auth) redirect(generateTenantRedirectUrl(slug, "/dashboard"));

  const tenant = await findTenantBySlug(slug);
  if (!tenant) notFound();

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
        <LoginForm tenant={tenant} />
        <p className="mt-6 text-center text-xs text-black/60">
          ProComply © 2025
        </p>
      </div>
    </main>
  );
}
