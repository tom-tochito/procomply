"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function BuildingRedirectPage() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    // Redirect to the buildings page but keep the domain parameter
    const domain = params.domain;
    router.push(`/${domain}/buildings`);
  }, [router, params]);

  return (
    <div className="p-6 flex justify-center items-center h-screen">
      <p className="text-gray-500">Redirecting to Buildings...</p>
    </div>
  );
} 