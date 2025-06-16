"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import logo from "@/assets/images/logo-white.png";
import { generateTenantRedirectUrl } from "@/utils/tenant";
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
  Shield,
  FileCheck,
  Globe,
  Tag,
  PieChart,
  LogOut,
  X,
} from "lucide-react";

export default function Header() {
  const router = useRouter();
  const paramsHook = useParams();
  const tenant = paramsHook.tenant as string;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dataMgmtOpen, setDataMgmtOpen] = useState(false);
  const [templateMgmtOpen, setTemplateMgmtOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dataMgmtRef = useRef<HTMLDivElement>(null);
  const templateMgmtRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        mobileMenuOpen // Only listen for outside clicks if mobile menu is open
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

  const handleLogout = () => {
    router.push("/login");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    // Reset submenu states when closing the mobile menu
    setDataMgmtOpen(false);
    setTemplateMgmtOpen(false);
  };

  const toggleDataMgmtMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setDataMgmtOpen(!dataMgmtOpen);
    if (templateMgmtOpen) setTemplateMgmtOpen(false);
  };

  const toggleTemplateMgmtMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setTemplateMgmtOpen(!templateMgmtOpen);
    if (dataMgmtOpen) setDataMgmtOpen(false);
  };

  return (
    <div className="bg-black rounded-lg shadow-sm p-3 md:p-4">
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
            <div className="relative" ref={dataMgmtRef}>
              <button
                onClick={toggleDataMgmtMenu}
                className="flex items-center text-white text-sm hover:text-gray-300 transition-colors group whitespace-nowrap"
                aria-expanded={dataMgmtOpen}
                aria-haspopup="true"
              >
                <span className="inline-flex items-center justify-center mr-1.5 text-gray-400 group-hover:text-gray-300">
                  <Database className="h-5 w-5" />
                </span>
                Data Mgmt
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>

              {dataMgmtOpen && (
                <>
                  <div
                    className="fixed inset-0 z-0"
                    onClick={() => setDataMgmtOpen(false)}
                  ></div>
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
                    <Link
                      href={generateTenantRedirectUrl(
                        tenant,
                        "/data-mgmt/company"
                      )}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setDataMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <Building2 className="h-4 w-4" />
                      </span>
                      Company
                    </Link>
                    <Link
                      href={generateTenantRedirectUrl(
                        tenant,
                        "/data-mgmt/division"
                      )}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setDataMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <Menu className="h-4 w-4" />
                      </span>
                      Division
                    </Link>
                    <Link
                      href={generateTenantRedirectUrl(
                        tenant,
                        "/data-mgmt/buildings"
                      )}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setDataMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <Building2 className="h-4 w-4" />
                      </span>
                      Building
                    </Link>
                    <Link
                      href={generateTenantRedirectUrl(
                        tenant,
                        "/data-mgmt/task"
                      )}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setDataMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <ClipboardList className="h-4 w-4" />
                      </span>
                      Task
                    </Link>
                    <Link
                      href={generateTenantRedirectUrl(
                        tenant,
                        "/data-mgmt/document"
                      )}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setDataMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <FileText className="h-4 w-4" />
                      </span>
                      Document
                    </Link>
                    <Link
                      href={generateTenantRedirectUrl(
                        tenant,
                        "/data-mgmt/person"
                      )}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setDataMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <UserCircle className="h-4 w-4" />
                      </span>
                      Person
                    </Link>
                    <Link
                      href={generateTenantRedirectUrl(
                        tenant,
                        "/data-mgmt/team"
                      )}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setDataMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <Users className="h-4 w-4" />
                      </span>
                      Team
                    </Link>
                  </div>
                </>
              )}
            </div>

            <div className="relative" ref={templateMgmtRef}>
              <button
                onClick={toggleTemplateMgmtMenu}
                className="flex items-center text-white text-sm hover:text-gray-300 transition-colors group whitespace-nowrap"
                aria-expanded={templateMgmtOpen}
                aria-haspopup="true"
              >
                <span className="inline-flex items-center justify-center mr-1.5 text-gray-400 group-hover:text-gray-300">
                  <FileText className="h-5 w-5" />
                </span>
                Template Mgmt
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>

              {templateMgmtOpen && (
                <>
                  <div
                    className="fixed inset-0 z-0"
                    onClick={() => setTemplateMgmtOpen(false)}
                  ></div>
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
                    <Link
                      href={generateTenantRedirectUrl(
                        tenant,
                        "/template-mgmt/task-template"
                      )}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setTemplateMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <ClipboardList className="h-4 w-4" />
                      </span>
                      Task Template
                    </Link>
                    <Link
                      href={generateTenantRedirectUrl(
                        tenant,
                        "/template-mgmt/document-type-tmpl"
                      )}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setTemplateMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <FileText className="h-4 w-4" />
                      </span>
                      Document Type Template
                    </Link>
                    <Link
                      href={generateTenantRedirectUrl(
                        tenant,
                        "/template-mgmt/survey-type"
                      )}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setTemplateMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <ClipboardList className="h-4 w-4" />
                      </span>
                      SurveyType
                    </Link>
                    <Link
                      href={generateTenantRedirectUrl(
                        tenant,
                        "/template-mgmt/task-category"
                      )}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setTemplateMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <Tag className="h-4 w-4" />
                      </span>
                      Task Category
                    </Link>
                    <Link
                      href={generateTenantRedirectUrl(
                        tenant,
                        "/template-mgmt/risk-area"
                      )}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setTemplateMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <Shield className="h-4 w-4" />
                      </span>
                      Risk Area
                    </Link>
                    <Link
                      href={generateTenantRedirectUrl(
                        tenant,
                        "/template-mgmt/subsection"
                      )}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setTemplateMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <Menu className="h-4 w-4" />
                      </span>
                      Subsection
                    </Link>
                    <Link
                      href={generateTenantRedirectUrl(
                        tenant,
                        "/template-mgmt/legislation"
                      )}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setTemplateMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <FileCheck className="h-4 w-4" />
                      </span>
                      Legislation
                    </Link>
                    <Link
                      href={generateTenantRedirectUrl(
                        tenant,
                        "/template-mgmt/country"
                      )}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setTemplateMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <Globe className="h-4 w-4" />
                      </span>
                      Country
                    </Link>
                  </div>
                </>
              )}
            </div>

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
        <div className="relative" ref={dropdownRef}>
          <button
            className="size-8 md:size-10 bg-black rounded-full flex items-center justify-center text-white hover:bg-orange-500 transition-colors text-sm md:text-base font-medium"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="User menu"
            aria-expanded={dropdownOpen}
          >
            TT
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 py-1 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-gray-500">admin@procomply.com</p>
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

            {/* Template Management Section */}
            <div className="text-white">
              <button
                onClick={toggleTemplateMgmtMenu}
                className="flex items-center justify-between w-full py-3 px-3 mb-2 rounded hover:bg-gray-800 active:bg-gray-700 border-b border-gray-700"
                aria-expanded={templateMgmtOpen}
                aria-controls="template-mgmt-submenu"
              >
                <div className="flex items-center">
                  <span className="inline-flex items-center justify-center mr-3 text-gray-400">
                    <FileText className="h-5 w-5" />
                  </span>
                  <span className="text-base font-medium">Template Mgmt</span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transform transition-transform duration-200 ${
                    templateMgmtOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Template Management Submenu */}
              <div
                id="template-mgmt-submenu"
                className={`pl-10 pb-2 space-y-1 overflow-hidden transition-all duration-300 ${
                  templateMgmtOpen
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <Link
                  href={generateTenantRedirectUrl(
                    tenant,
                    "/template-mgmt/task-template"
                  )}
                  onClick={closeMobileMenu}
                  className="block py-2 px-2 my-1 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-800 active:bg-gray-700"
                >
                  Task Template
                </Link>
                <Link
                  href={generateTenantRedirectUrl(
                    tenant,
                    "/template-mgmt/document-type-tmpl"
                  )}
                  onClick={closeMobileMenu}
                  className="block py-2 px-2 my-1 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-800 active:bg-gray-700"
                >
                  Document Type Template
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
