"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import logo from "@/common/assets/images/logo/light.png";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import { Menu, X } from "lucide-react";
import type { Tenant } from "@/features/tenant/models";
import { UserAvatar } from "./UserAvatar";
import { NavigationLinks } from "./NavigationLinks";
import { MobileMenu } from "./MobileMenu";
import { useAuth } from "~/src/hooks/useAuth";

interface HeaderProps {
  tenant: Tenant;
}

export default function Header({ tenant }: HeaderProps) {
  const paramsHook = useParams();
  const pathname = usePathname();
  const tenantSlug = paramsHook.tenant as string;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user } = useAuth();

  const isLoginPage = pathname.includes("/login");
  if (isLoginPage) return null;

  return (
    <header className="sticky top-0 z-40 bg-black shadow-sm p-3 md:p-4">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">
        <div className="flex items-center gap-x-4 md:gap-x-16">
          <Link
            href={generateTenantRedirectUrl(tenantSlug, "/dashboard")}
            className="flex-shrink-0"
          >
            <Image
              src={logo}
              alt="ProComply"
              width={120}
              height={24}
              className="w-auto h-6 md:h-8"
              priority
            />
          </Link>

          <NavigationLinks tenantSlug={tenantSlug} />

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {tenant && (
          <UserAvatar 
            user={user ? {
              email: user.email,
              profile: user.profile ? { name: user.profile.name } : undefined
            } : undefined} 
            tenant={tenant} 
          />
        )}
      </div>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        tenantSlug={tenantSlug}
        tenant={tenant}
        user={user ? {
          email: user.email,
          profile: user.profile ? { name: user.profile.name } : undefined
        } : undefined}
      />
    </header>
  );
}