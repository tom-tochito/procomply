import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { TENANTS } from "@/data/tenants";
import logo from "@/assets/images/logo.png";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { checkAuth, getTenantIdBySubdomain } from "@/features/auth/utils/check-auth";
import { generateTenantRedirectUrl } from "@/utils/tenant";

interface PageProps {
  params: Promise<{ tenant: string }>;
}

export default async function LoginPage({ params }: PageProps) {
  const { tenant: subdomain } = await params;
  
  // Check if already authenticated
  const auth = await checkAuth();
  if (auth) {
    redirect(generateTenantRedirectUrl(subdomain, "/dashboard"));
  }

  // Try to match domain to known tenants
  const _tenant = subdomain?.toString().split(".")[0];
  const tenant = TENANTS.find((t) => t.id === _tenant);

  if (!tenant) {
    // If tenant not found, show 404
    notFound();
  }

  // Get the actual tenant ID from the database
  // For now, we'll use the subdomain as the tenant ID
  const tenantId = await getTenantIdBySubdomain(_tenant) || _tenant;

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

        <LoginForm tenantId={tenantId} tenantSubdomain={subdomain} />
        
        <p className="mt-6 text-center text-xs text-black/60">
          ProComply © 2025
        </p>
      </div>
    </main>
  );
}
