"use client";

import React from "react";
import Link from "next/link";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import { PieChart } from "lucide-react";
import { DataManagementMenu } from "./DataManagementMenu";

interface NavigationLinksProps {
  tenantSlug: string;
}

export function NavigationLinks({ tenantSlug }: NavigationLinksProps) {
  return (
    <div className="hidden md:flex items-center gap-x-4 lg:gap-x-8">
      <DataManagementMenu tenantSlug={tenantSlug} />

      <Link
        href={generateTenantRedirectUrl(tenantSlug, "/compliance-overview")}
        className="flex items-center text-white text-sm hover:text-gray-300 transition-colors group whitespace-nowrap"
      >
        <span className="inline-flex items-center justify-center mr-1.5 text-gray-400 group-hover:text-gray-300">
          <PieChart className="h-5 w-5" />
        </span>
        Compliance Overview
      </Link>
    </div>
  );
}