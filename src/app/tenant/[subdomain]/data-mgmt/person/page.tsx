"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/common/components/Header";
import { generateTenantRedirectUrl } from "@/utils/tenant";

// Mock data based on the screenshot
const mockPersons = [
  {
    id: 1,
    name: "Adrian Williams",
    company: "ASAP Comply",
    role: "Fire Risk Assessor",
    email: "adrian.williams@asapcomply.com",
    phone: "07542 823191",
    phoneMobile: "07824 618 767",
  },
  {
    id: 2,
    name: "Alexa Byrne",
    company: "Akelius",
    role: "Branch Manager - Kensington",
    email: "alexa.byrne@akelius.co.uk",
    phone: "020 7870 9641 x1002",
  },
  {
    id: 3,
    name: "Alexandra Walker",
    company: "Akelius Residential Ltd",
    role: "Head of Branch (Hampstead)",
    email: "alexandra.walker@akelius.co.uk",
    phone: "0800 014 8579",
  },
  {
    id: 4,
    name: "Alison Kelly",
    company: "ASAP Comply",
    role: "CEO",
    email: "alison.kelly@asapcomply.com",
    phone: "0151 363 2333",
  },
  {
    id: 5,
    name: "Andrew Speller",
    company: "Akelius",
    email: "andrew.speller@akelius.co.uk",
    phone: "020 3758 8353 x1013",
    phoneMobile: "07584 291 600",
  },
  {
    id: 6,
    name: "Atikah Zarar",
    company: "Akelius",
    role: "Property Administrator",
    email: "atikah.zarar@akelius.co.uk",
  },
  {
    id: 7,
    name: "Chris Tullick",
    company: "Akelius",
    role: "Property Manager",
    email: "chris.tullick@akelius.co.uk",
    phone: "07935 756430",
  },
  {
    id: 8,
    name: "Cristina Parker",
    company: "Akelius",
    role: "Branch Manager (Ealing)",
    email: "cristina.avram@akelius.co.uk",
    phone: "020 3758 8354 x1014",
    phoneMobile: "07788 247002",
  },
  {
    id: 9,
    name: "Diana Porim",
    company: "Akelius",
    role: "Property Manager (Ealing)",
    email: "diana.porim@akelius.co.uk",
    phone: "07587 610592",
  },
  {
    id: 10,
    name: "Francesca D'Souza",
    company: "Akelius",
    role: "Property Administrator (Camden)",
    email: "francesca.d'souza@akelius.co.uk",
    phone: "07741659351",
  },
  {
    id: 11,
    name: "Gary Bryan",
    company: "ASAP Comply",
    role: "Forensic Risk Assessor",
    email: "gary.brya@asapcomply.com",
    phone: "0151 363 2333",
    phoneMobile: "07796 619770",
  },
  {
    id: 12,
    name: "Hyrije Taipi",
    company: "Akelius",
    role: "Property Manager Hampstead",
    email: "Hyrije.Taipi@akelius.co.uk",
  },
];

export default function PersonPage() {
  const params = useParams();
  const subdomain = typeof params.subdomain === 'string' ? params.subdomain : (Array.isArray(params.subdomain) ? params.subdomain[0] : '');
  const [searchTerm, setSearchTerm] = useState("");

  // Filter persons based on search term
  const filteredPersons = mockPersons.filter((person) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      person.name.toLowerCase().includes(searchLower) ||
      (person.company && person.company.toLowerCase().includes(searchLower)) ||
      (person.role && person.role.toLowerCase().includes(searchLower)) ||
      (person.email && person.email.toLowerCase().includes(searchLower)) ||
      (person.phone && person.phone.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Top header with logo and user info */}
      <Header />

      {/* Page title and breadcrumbs */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Person</h1>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <Link href={generateTenantRedirectUrl(subdomain, "data-mgmt")} className="hover:text-blue-600">
            <span>Data Mgmt</span>
          </Link>
          <span className="mx-2">/</span>
          <span>Person</span>
        </div>
      </div>

      {/* Search and filter controls */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="search contacts"
            className="border rounded-md pl-3 pr-10 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            Filter by company
            <svg
              className="ml-2 -mr-0.5 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Person grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
        {filteredPersons.map((person) => (
          <div
            key={person.id}
            className="bg-white rounded-lg shadow-sm border overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-500">
                  {person.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{person.name}</div>
                  {person.role && (
                    <div className="text-sm text-gray-500">{person.role}</div>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400 mr-2"
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
                  <span>{person.company}</span>
                </div>

                {person.email && (
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{person.email}</span>
                  </div>
                )}

                {person.phone && (
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>{person.phone}</span>
                  </div>
                )}

                {person.phoneMobile && (
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{person.phoneMobile}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
