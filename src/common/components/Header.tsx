"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import logo from "@/assets/images/logo-white.png";

export default function Header() {
  const router = useRouter();
  const params = useParams();
  const domain = params.domain;
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
          <Link href={`/${domain}/dashboard`} className="flex-shrink-0">
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12a3 3 0 106 0 3 3 0 00-6 0z"
                    />
                  </svg>
                </span>
                Data Mgmt
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
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

              {dataMgmtOpen && (
                <>
                  <div
                    className="fixed inset-0 z-0"
                    onClick={() => setDataMgmtOpen(false)}
                  ></div>
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
                    <Link
                      href={`/${domain}/data-mgmt/company`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setDataMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </span>
                      Company
                    </Link>
                    <Link
                      href={`/${domain}/data-mgmt/division`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setDataMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 10h16M4 14h16M4 18h16"
                          />
                        </svg>
                      </span>
                      Division
                    </Link>
                    <Link
                      href={`/${domain}/buildings`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setDataMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </span>
                      Building
                    </Link>
                    <Link
                      href={`/${domain}/data-mgmt/task`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setDataMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </span>
                      Task
                    </Link>
                    <Link
                      href={`/${domain}/data-mgmt/document`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setDataMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </span>
                      Document
                    </Link>
                    <Link
                      href={`/${domain}/data-mgmt/person`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setDataMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </span>
                      Person
                    </Link>
                    <Link
                      href={`/${domain}/data-mgmt/team`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setDataMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </span>
                Template Mgmt
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
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

              {templateMgmtOpen && (
                <>
                  <div
                    className="fixed inset-0 z-0"
                    onClick={() => setTemplateMgmtOpen(false)}
                  ></div>
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
                    <Link
                      href={`/${domain}/template-mgmt/task-template`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setTemplateMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </span>
                      Task Template
                    </Link>
                    <Link
                      href={`/${domain}/template-mgmt/document-type-tmpl`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setTemplateMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </span>
                      Document Type Template
                    </Link>
                    <Link
                      href={`/${domain}/template-mgmt/survey-type`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setTemplateMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </span>
                      SurveyType
                    </Link>
                    <Link
                      href={`/${domain}/template-mgmt/task-category`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setTemplateMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                      </span>
                      Task Category
                    </Link>
                    <Link
                      href={`/${domain}/template-mgmt/risk-area`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setTemplateMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </span>
                      Risk Area
                    </Link>
                    <Link
                      href={`/${domain}/template-mgmt/subsection`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setTemplateMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 10h16M4 14h16M4 18h16"
                          />
                        </svg>
                      </span>
                      Subsection
                    </Link>
                    <Link
                      href={`/${domain}/template-mgmt/legislation`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setTemplateMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                          />
                        </svg>
                      </span>
                      Legislation
                    </Link>
                    <Link
                      href={`/${domain}/template-mgmt/country`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setTemplateMgmtOpen(false)}
                    >
                      <span className="inline-flex items-center justify-center mr-2 text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </span>
                      Country
                    </Link>
                  </div>
                </>
              )}
            </div>

            <Link
              href={`/${domain}/compliance-overview`}
              className="flex items-center text-white text-sm hover:text-gray-300 transition-colors group whitespace-nowrap"
            >
              <span className="inline-flex items-center justify-center mr-1.5 text-gray-400 group-hover:text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  mobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12a3 3 0 106 0 3 3 0 00-6 0z"
                      />
                    </svg>
                  </span>
                  <span className="text-base font-medium">Data Mgmt</span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transform transition-transform duration-200 ${
                    dataMgmtOpen ? "rotate-180" : ""
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
                  href={`/${domain}/data-mgmt/company`}
                  onClick={closeMobileMenu}
                  className="block py-2 px-2 my-1 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-800 active:bg-gray-700"
                >
                  Company
                </Link>
                <Link
                  href={`/${domain}/data-mgmt/division`}
                  onClick={closeMobileMenu}
                  className="block py-2 px-2 my-1 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-800 active:bg-gray-700"
                >
                  Division
                </Link>
                <Link
                  href={`/${domain}/buildings`}
                  onClick={closeMobileMenu}
                  className="block py-2 px-2 my-1 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-800 active:bg-gray-700"
                >
                  Building
                </Link>
                <Link
                  href={`/${domain}/data-mgmt/task`}
                  onClick={closeMobileMenu}
                  className="block py-2 px-2 my-1 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-800 active:bg-gray-700"
                >
                  Task
                </Link>
                <Link
                  href={`/${domain}/data-mgmt/document`}
                  onClick={closeMobileMenu}
                  className="block py-2 px-2 my-1 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-800 active:bg-gray-700"
                >
                  Document
                </Link>
                <Link
                  href={`/${domain}/data-mgmt/person`}
                  onClick={closeMobileMenu}
                  className="block py-2 px-2 my-1 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-800 active:bg-gray-700"
                >
                  Person
                </Link>
                <Link
                  href={`/${domain}/data-mgmt/team`}
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
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
                  href={`/${domain}/template-mgmt/task-template`}
                  onClick={closeMobileMenu}
                  className="block py-2 px-2 my-1 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-800 active:bg-gray-700"
                >
                  Task Template
                </Link>
                <Link
                  href={`/${domain}/template-mgmt/document-type-tmpl`}
                  onClick={closeMobileMenu}
                  className="block py-2 px-2 my-1 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-800 active:bg-gray-700"
                >
                  Document Type Template
                </Link>
              </div>
            </div>

            {/* Direct links */}
            <Link
              href={`/${domain}/compliance-overview`}
              onClick={closeMobileMenu}
              className="flex items-center py-3 px-3 my-2 rounded hover:bg-gray-800 active:bg-gray-700 text-white border-b border-gray-700"
            >
              <span className="inline-flex items-center justify-center mr-3 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </span>
              <span className="text-base font-medium">Compliance Overview</span>
            </Link>

            <Link
              href={`/${domain}/dashboard`}
              onClick={closeMobileMenu}
              className="flex items-center py-3 px-3 my-2 rounded hover:bg-gray-800 active:bg-gray-700 text-white border-b border-gray-700"
            >
              <span className="inline-flex items-center justify-center mr-3 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3"
                  />
                </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="text-base font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
