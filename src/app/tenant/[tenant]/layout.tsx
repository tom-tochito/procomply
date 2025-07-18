import { notFound } from "next/navigation";

import { Header } from "@/common/components/Header";
import { findTenantBySlug } from "@/features/tenant/repository";

interface TenantLayoutProps {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}

export default async function TenantLayout({
  children,
  params,
}: TenantLayoutProps) {
  const { tenant: tenantSlug } = await params;
  const tenant = await findTenantBySlug(tenantSlug);

  if (!tenant) notFound();

  return (
    <section>
      <Header tenant={tenant} />
      <main>{children}</main>
    </section>
  );
}
