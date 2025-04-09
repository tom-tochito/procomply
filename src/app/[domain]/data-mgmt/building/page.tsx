"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BuildingRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/buildings");
  }, [router]);

  return (
    <div className="p-6 flex justify-center items-center h-screen">
      <p className="text-gray-500">Redirecting to Buildings...</p>
    </div>
  );
} 