"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { generateTenantRedirectUrl } from "@/utils/tenant";

export default function BuildingRedirectPage() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    // Redirect to the buildings page but keep the subdomain parameter
    const subdomain = typeof params.tenant === 'string' ? params.tenant : (Array.isArray(params.tenant) ? params.tenant[0] : '');
    if (subdomain) {
      router.push(generateTenantRedirectUrl(subdomain, "buildings"));
    }
  }, [router, params]);

  return (
    <div className="p-6 flex justify-center items-center h-screen">
      <p className="text-gray-500">Redirecting to Buildings...</p>
    </div>
  );
} 