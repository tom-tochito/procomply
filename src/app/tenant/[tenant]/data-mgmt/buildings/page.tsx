import BuildingRedirect from "@/features/data-mgmt/components/BuildingRedirect";

interface BuildingRedirectPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function BuildingRedirectPage({
  params,
}: BuildingRedirectPageProps) {
  const { tenant } = await params;

  return <BuildingRedirect tenant={tenant} />;
}