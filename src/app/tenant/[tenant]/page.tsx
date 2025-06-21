import { generateTenantRedirectUrl } from "@/utils/tenant";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: Promise<{ tenant: string }>;
}

export default async function Page({ params }: Props) {
  const { tenant: slug } = await params;

  if (!slug) notFound();

  redirect(generateTenantRedirectUrl(slug, "/login"));
}
