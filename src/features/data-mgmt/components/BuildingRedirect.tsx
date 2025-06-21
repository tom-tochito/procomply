"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";

interface BuildingRedirectProps {
  tenant: string;
}

export default function BuildingRedirect({ tenant }: BuildingRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    if (tenant) {
      router.push(generateTenantRedirectUrl(tenant, "/buildings"));
    }
  }, [router, tenant]);

  return (
    <div className="p-6 flex justify-center items-center h-screen">
      <p className="text-gray-500">Redirecting to Buildings...</p>
    </div>
  );
}
