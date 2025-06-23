"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import logo from "@/common/assets/images/logo/light.png";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import { db } from "~/lib/db";
import {
  Database,
  ChevronDown,
  Building2,
  Menu,
  Users,
  FileText,
  UserCircle,
  ClipboardList,
  Layout,
  PieChart,
  LogOut,
  X,
} from "lucide-react";

// Avatar Component
function UserAvatar({ user }: { user?: { email?: string; profile?: { name?: string } } }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tenant = useParams().tenant as string;
  
  // Get initials from profile name first, then email, then fallback to "UN"
  const getInitials = () => {
    if (user?.profile?.name) {
      const names = user.profile.name.trim().split(' ');
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
  
  // Close dropdown when clicking outside
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
    const { logoutAction } = await import("@/features/auth");
    await logoutAction(tenant);
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
              <p className="text-sm font-medium">{user?.profile?.name || "User"}</p>
              <p className="text-xs text-gray-500">{user?.email || "Unknown"}</p>
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

// Data Management Menu Component
function DataManagementMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const tenant = useParams().tenant as string;
  
  const menuItems: Array<{ href: `/${string}`; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { href: "/data-mgmt/company", label: "Company", icon: Building2 },
    { href: "/data-mgmt/division", label: "Division", icon: Menu },
    { href: "/data-mgmt/buildings", label: "Building", icon: Building2 },
    { href: "/data-mgmt/task", label: "Task", icon: ClipboardList },
    { href: "/data-mgmt/document", label: "Document", icon: FileText },
    { href: "/data-mgmt/person", label: "Person", icon: UserCircle },
    { href: "/data-mgmt/team", label: "Team", icon: Users },
  ];
  
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
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={generateTenantRedirectUrl(tenant, item.href)}
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

export default function Header() {
  const paramsHook = useParams();
  const pathname = usePathname();
  const tenant = paramsHook.tenant as string;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dataMgmtOpen, setDataMgmtOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  const { user } = db.useAuth();
  const { data } = db.useQuery({ 
    $users: {
      $: { where: { id: user?.id || "" } },
      profile: {}
    }
  });
  
  const userWithProfile = data?.$users?.[0];

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        mobileMenuOpen
      ) {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    const { logoutAction } = await import("@/features/auth");
    await logoutAction(tenant);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setDataMgmtOpen(false);
  };

  const toggleDataMgmtMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDataMgmtOpen(!dataMgmtOpen);
  };

  const isLoginPage = pathname.includes("/login");
  if (isLoginPage) return null;

  return (
    <div className="bg-black shadow-sm p-3 md:p-4">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">
        <div className="flex items-center gap-x-4 md:gap-x-16">
          <Link
            href={generateTenantRedirectUrl(tenant, "/dashboard")}
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-x-4 lg:gap-x-8">
            <DataManagementMenu />

            <Link
              href={generateTenantRedirectUrl(tenant, "/compliance-overview")}
              className="flex items-center text-white text-sm hover:text-gray-300 transition-colors group whitespace-nowrap"
            >
              <span className="inline-flex items-center justify-center mr-1.5 text-gray-400 group-hover:text-gray-300">
                <PieChart className="h-5 w-5" />
              </span>
              Compliance Overview
            </Link>
          </div>

          {/* Mobile Menu Button */}
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

        {/* User Profile Icon */}
        <UserAvatar user={userWithProfile} />
      </div>

      {/* Mobile Menu - Full Screen Overlay */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 bg-black bg-opacity-95 z-50 md:hidden flex flex-col overflow-y-auto"
        >
          {/* Close button at the top */}
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
            {/* Mobile menu content - simplified version */}
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

              {/* Data Management Submenu */}
              <div
                id="data-mgmt-submenu"
                className={`pl-10 pb-2 space-y-1 overflow-hidden transition-all duration-300 ${
                  dataMgmtOpen
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <Link
                  href={generateTenantRedirectUrl(tenant, "/data-mgmt/company")}
                  onClick={closeMobileMenu}
                  className="block py-2 px-2 my-1 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-800 active:bg-gray-700"
                >
                  Company
                </Link>
                <Link
                  href={generateTenantRedirectUrl(
                    tenant,
                    "/data-mgmt/division"
                  )}
                  onClick={closeMobileMenu}
                  className="block py-2 px-2 my-1 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-800 active:bg-gray-700"
                >
                  Division
                </Link>
                <Link
                  href={generateTenantRedirectUrl(
                    tenant,
                    "/data-mgmt/buildings"
                  )}
                  onClick={closeMobileMenu}
                  className="block py-2 px-2 my-1 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-800 active:bg-gray-700"
                >
                  Building
                </Link>
                <Link
                  href={generateTenantRedirectUrl(tenant, "/data-mgmt/task")}
                  onClick={closeMobileMenu}
                  className="block py-2 px-2 my-1 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-800 active:bg-gray-700"
                >
                  Task
                </Link>
                <Link
                  href={generateTenantRedirectUrl(
                    tenant,
                    "/data-mgmt/document"
                  )}
                  onClick={closeMobileMenu}
                  className="block py-2 px-2 my-1 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-800 active:bg-gray-700"
                >
                  Document
                </Link>
                <Link
                  href={generateTenantRedirectUrl(tenant, "/data-mgmt/person")}
                  onClick={closeMobileMenu}
                  className="block py-2 px-2 my-1 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-800 active:bg-gray-700"
                >
                  Person
                </Link>
                <Link
                  href={generateTenantRedirectUrl(tenant, "/data-mgmt/team")}
                  onClick={closeMobileMenu}
                  className="block py-2 px-2 my-1 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-800 active:bg-gray-700"
                >
                  Team
                </Link>
              </div>
            </div>


            {/* Direct links */}
            <Link
              href={generateTenantRedirectUrl(tenant, "/compliance-overview")}
              onClick={closeMobileMenu}
              className="flex items-center py-3 px-3 my-2 rounded hover:bg-gray-800 active:bg-gray-700 text-white border-b border-gray-700"
            >
              <span className="inline-flex items-center justify-center mr-3 text-gray-400">
                <PieChart className="h-5 w-5" />
              </span>
              <span className="text-base font-medium">Compliance Overview</span>
            </Link>

            <Link
              href={generateTenantRedirectUrl(tenant, "/dashboard")}
              onClick={closeMobileMenu}
              className="flex items-center py-3 px-3 my-2 rounded hover:bg-gray-800 active:bg-gray-700 text-white border-b border-gray-700"
            >
              <span className="inline-flex items-center justify-center mr-3 text-gray-400">
                <Layout className="h-5 w-5" />
              </span>
              <span className="text-base font-medium">Dashboard</span>
            </Link>

            {/* Logout button */}
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
      )}
    </div>
  );
}
