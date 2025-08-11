"use client";

import React, { useState, useRef, useEffect } from "react";
import type { Tenant } from "@/features/tenant/models";
import { useLogout } from "~/src/hooks/useLogout";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";

interface UserAvatarProps {
  user?: { email?: string; profile?: { name?: string } };
  tenant: Tenant;
}

export function UserAvatar({ user, tenant }: UserAvatarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const logout = useLogout();

  const getInitials = () => {
    if (user?.profile?.name) {
      const names = user.profile.name.trim().split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0].slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "UN";
  };

  const initials = getInitials();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    if (!tenant) return;
    await logout(generateTenantRedirectUrl(tenant.slug, "/login"));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="size-8 md:size-10 bg-black rounded-full flex items-center justify-center text-white hover:bg-orange-500 transition-colors text-sm md:text-base font-medium"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-label="User menu"
        aria-expanded={dropdownOpen}
      >
        {initials}
      </button>

      {dropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setDropdownOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 py-1 border border-gray-200">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium">
                {user?.profile?.name || "User"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email || "Unknown"}
              </p>
            </div>
            <a
              href="#profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Profile
            </a>
            <a
              href="#settings"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Settings
            </a>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 font-medium"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}