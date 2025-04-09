"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "@/assets/images/logo-white.png";

export default function Header() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dataMgmtOpen, setDataMgmtOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dataMgmtRef = useRef<HTMLDivElement>(null);

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
        dataMgmtRef.current &&
        !dataMgmtRef.current.contains(event.target as Node)
      ) {
        setDataMgmtOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="bg-black rounded-lg shadow-sm p-4">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">
        <div className="flex items-center gap-x-16">
          <Link href="/dashboard" className="flex-shrink-0">
            <Image src={logo} alt="ProComply" width={120} height={24} className="w-auto h-6" priority />
          </Link>
          
          <div className="flex items-center gap-x-8">
            <div className="relative" ref={dataMgmtRef}>
              <button
                onClick={() => setDataMgmtOpen(!dataMgmtOpen)}
                className="flex items-center text-white text-sm hover:text-gray-300 transition-colors group whitespace-nowrap"
              >
                <span className="inline-flex items-center justify-center mr-1.5 text-gray-400 group-hover:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12a3 3 0 106 0 3 3 0 00-6 0z" />
                  </svg>
                </span>
                Data Mgmt
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {dataMgmtOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
                  <Link
                    href="/buildings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Buildings
                  </Link>
                  <Link
                    href="/data-management"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Data Management
                  </Link>
                </div>
              )}
            </div>
            
            <Link
              href="/template-management"
              className="flex items-center text-white text-sm hover:text-gray-300 transition-colors group whitespace-nowrap"
            >
              <span className="inline-flex items-center justify-center mr-1.5 text-gray-400 group-hover:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
              Template Mgmt
            </Link>
            
            <Link
              href="/compliance-overview"
              className="flex items-center text-white text-sm hover:text-gray-300 transition-colors group whitespace-nowrap"
            >
              <span className="inline-flex items-center justify-center mr-1.5 text-gray-400 group-hover:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </span>
              Compliance Overview
            </Link>
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            className="size-10 bg-black rounded-full flex items-center justify-center text-white hover:bg-orange-500 transition-colors text-base font-medium"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="User menu"
          >
            TT
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
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
          )}
        </div>
      </div>
    </div>
  );
}
