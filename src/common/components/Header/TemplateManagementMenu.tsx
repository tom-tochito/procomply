"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import {
  Settings,
  ChevronDown,
  Building2,
  Gavel,
  FileCheck,
  MapPin,
  FolderOpen,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";

interface TemplateManagementMenuProps {
  tenantSlug: string;
}

const TEMPLATE_MENU_ITEMS: Array<{
  href: `/${string}`;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { href: "/templates/building", label: "Building", icon: Building2 },
  { href: "/templates/country", label: "Country", icon: MapPin },
  { href: "/templates/document", label: "Document", icon: FileCheck },
  { href: "/templates/legislation", label: "Legislation", icon: Gavel },
  { href: "/templates/risk-area", label: "Risk Area", icon: AlertTriangle },
  { href: "/templates/subsection", label: "Subsection", icon: FolderOpen },
  { href: "/templates/survey", label: "Survey", icon: ClipboardList },
  { href: "/templates/task", label: "Task", icon: ClipboardList },
];

export function TemplateManagementMenu({
  tenantSlug,
}: TemplateManagementMenuProps) {
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
          <Settings className="h-5 w-5" />
        </span>
        Template Mgmt
        <ChevronDown className="h-4 w-4 ml-1" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-0"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200 max-h-96 overflow-y-auto">
            {TEMPLATE_MENU_ITEMS.map((item) => (
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
