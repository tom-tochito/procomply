"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import logo from "@/common/assets/images/logo/light.png";
import {
  Database,
  ChevronDown,
  Layout,
  PieChart,
  LogOut,
  X,
} from "lucide-react";
import type { Tenant } from "@/features/tenant/models";
import { useLogout } from "@/features/auth/hooks/useLogout";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  tenantSlug: string;
  tenant?: Tenant;
  user?: any;
}

const DATA_MGMT_ITEMS: Array<{
  href: `/${string}`;
  label: string;
}> = [
  { href: "/data-mgmt/company", label: "Company" },
  { href: "/data-mgmt/division", label: "Division" },
  { href: "/data-mgmt/buildings", label: "Building" },
  { href: "/data-mgmt/task", label: "Task" },
  { href: "/data-mgmt/document", label: "Document" },
  { href: "/data-mgmt/person", label: "Person" },
  { href: "/data-mgmt/team", label: "Team" },
];

export function MobileMenu({ isOpen, onClose, tenantSlug, tenant }: MobileMenuProps) {
  const [dataMgmtOpen, setDataMgmtOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const logout = useLogout();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = async () => {
    if (!tenant) return;
    await logout(generateTenantRedirectUrl(tenant.slug, "/login"));
  };

  const closeMobileMenu = () => {
    onClose();
    setDataMgmtOpen(false);
  };

  const toggleDataMgmtMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDataMgmtOpen(!dataMgmtOpen);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={mobileMenuRef}
      className="fixed inset-0 bg-black bg-opacity-95 z-50 md:hidden flex flex-col overflow-y-auto"
    >
      <div className="flex justify-between items-center px-4 md:px-6 pt-4 pb-2">
        <div className="flex items-center">
          <Image
            src={logo}
            alt="ProComply"
            width={90}
            height={18}
            className="w-auto h-6"
            priority
          />
        </div>
        <button
          onClick={closeMobileMenu}
          className="text-white hover:text-gray-300 p-2"
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="px-4 md:px-6 py-6 space-y-4 flex-grow overflow-y-auto">
        <div className="text-white">
          <button
            onClick={toggleDataMgmtMenu}
            className="flex items-center justify-between w-full py-3 px-3 mb-2 rounded hover:bg-gray-800 active:bg-gray-700 border-b border-gray-700"
            aria-expanded={dataMgmtOpen}
            aria-controls="data-mgmt-submenu"
          >
            <div className="flex items-center">
              <span className="inline-flex items-center justify-center mr-3 text-gray-400">
                <Database className="h-5 w-5" />
              </span>
              <span className="text-base font-medium">Data Mgmt</span>
            </div>
            <ChevronDown
              className={`h-5 w-5 transform transition-transform duration-200 ${
                dataMgmtOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            id="data-mgmt-submenu"
            className={`pl-10 pb-2 space-y-1 overflow-hidden transition-all duration-300 ${
              dataMgmtOpen
                ? "max-h-[500px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            {DATA_MGMT_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={generateTenantRedirectUrl(tenantSlug, item.href)}
                onClick={closeMobileMenu}
                className="block py-2 px-2 my-1 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-800 active:bg-gray-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <Link
          href={generateTenantRedirectUrl(tenantSlug, "/compliance-overview")}
          onClick={closeMobileMenu}
          className="flex items-center py-3 px-3 my-2 rounded hover:bg-gray-800 active:bg-gray-700 text-white border-b border-gray-700"
        >
          <span className="inline-flex items-center justify-center mr-3 text-gray-400">
            <PieChart className="h-5 w-5" />
          </span>
          <span className="text-base font-medium">Compliance Overview</span>
        </Link>

        <Link
          href={generateTenantRedirectUrl(tenantSlug, "/dashboard")}
          onClick={closeMobileMenu}
          className="flex items-center py-3 px-3 my-2 rounded hover:bg-gray-800 active:bg-gray-700 text-white border-b border-gray-700"
        >
          <span className="inline-flex items-center justify-center mr-3 text-gray-400">
            <Layout className="h-5 w-5" />
          </span>
          <span className="text-base font-medium">Dashboard</span>
        </Link>

        <div className="pt-4 border-t border-gray-700">
          <button
            onClick={() => {
              handleLogout();
              closeMobileMenu();
            }}
            className="flex items-center w-full py-3 px-3 rounded hover:bg-gray-800 active:bg-gray-700 text-red-400 hover:text-red-300"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span className="text-base font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}