"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "@/assets/images/logo-white.png";

export default function Header() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="flex justify-between items-center bg-black/90 p-4 rounded-lg shadow-sm">
      <div className="flex items-center space-x-6">
        <Link href="/dashboard">
          <Image src={logo} alt="ProComply" />
        </Link>
        <Link
          href="/buildings"
          className="text-white text-sm hover:text-gray-300 transition-colors"
        >
          Buildings
        </Link>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          className="size-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-label="User menu"
        >
          A
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
  );
}
