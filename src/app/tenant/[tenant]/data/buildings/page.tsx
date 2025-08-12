import { redirect } from "next/navigation";

import { generateTenantRedirectUrl } from "@/features/tenant/utils/tenant.utils";

interface PageProps {
  params: Promise<{ tenant: string }>;
}

export default async function Page({ params }: PageProps) {
  const { tenant } = await params;

  redirect(generateTenantRedirectUrl(tenant, "/buildings"));
}
