import { generateTenantRedirectUrl } from "@/utils/tenant";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: Promise<{ subdomain: string }>;
}

export default async function Page({ params }: Props) {
  const { subdomain } = await params;

  if (!subdomain) notFound();

  redirect(generateTenantRedirectUrl(subdomain, "/login"));
}
