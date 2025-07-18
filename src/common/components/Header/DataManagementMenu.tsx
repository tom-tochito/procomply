"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import {
  Database,
  ChevronDown,
  Building2,
  Menu,
  Users,
  FileText,
  UserCircle,
  ClipboardList,
} from "lucide-react";

interface DataManagementMenuProps {
  tenantSlug: string;
}

const MENU_ITEMS: Array<{
  href: `/${string}`;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { href: "/data-mgmt/company", label: "Company", icon: Building2 },
  { href: "/data-mgmt/division", label: "Division", icon: Menu },
  { href: "/data-mgmt/buildings", label: "Building", icon: Building2 },
  { href: "/data-mgmt/task", label: "Task", icon: ClipboardList },
  { href: "/data-mgmt/document", label: "Document", icon: FileText },
  { href: "/data-mgmt/person", label: "Person", icon: UserCircle },
  { href: "/data-mgmt/team", label: "Team", icon: Users },
];

export function DataManagementMenu({ tenantSlug }: DataManagementMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-white text-sm hover:text-gray-300 transition-colors group whitespace-nowrap"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="inline-flex items-center justify-center mr-1.5 text-gray-400 group-hover:text-gray-300">
          <Database className="h-5 w-5" />
        </span>
        Data Mgmt
        <ChevronDown className="h-4 w-4 ml-1" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-0"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={generateTenantRedirectUrl(tenantSlug, item.href)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => setIsOpen(false)}
              >
                <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                  <item.icon className="h-4 w-4" />
                </span>
                {item.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}