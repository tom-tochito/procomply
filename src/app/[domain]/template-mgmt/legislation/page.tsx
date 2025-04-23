"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/common/components/Header";
import LegislationForm from "@/components/LegislationForm";

export default function LegislationPage() {
  const params = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [legislations, setLegislations] = useState([
    {
      code: "ACOP L8",
      title: "Approved Code of Practice L8 Legionnaires' disease",
      url: "http://www.hse.gov.uk/pubns/priced/l8.pdf",
    },
    {
      code: "BS 1710:2014",
      title: "BS 1710:2014",
      url: "",
    },
    {
      code: "BS 5266",
      title: "BS 5266 Emergency Lighting Code of Practice",
      url: "https://shop.bsigroup.com/ProductDetail/?pid=000000000030331489",
    },
    {
      code: "BS 5499",
      title: "BS 5499",
      url: "",
    },
    {
      code: "BS6651:1992",
      title: "BS6651:1992",
      url: "",
    },
    {
      code: "BS 8300",
      title: "BS 8300 - Design of Buildings and their Approaches",
      url: "https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/887172/roadmap-implementation-2020-v2.pdf",
    },
    {
      code: "BS 9999",
      title:
        "BS 9999 -Fire Safety in the Design, Management & Use of Buildings",
      url: "",
    },
    {
      code: "BA 1984",
      title: "Building Act 1984",
      url: "http://www.legislation.gov.uk/ukpga/1984/55",
    },
    {
      code: "Building Regulations Part A",
      title: "Building Regulations – Part A",
      url: "",
    },
    {
      code: "BA 2003 (Scotland)",
      title: "Building (Scotland) Act 2003",
      url: "http://www.hmso.gov.uk/legislation/scotland/acts2003/20030008.htm",
    },
    {
      code: "CDM 2015",
      title: "Construction (Design and Management) Regulations 2015",
      url: "",
    },
  ]);

  // Filter legislations based on search
  const filteredLegislations = legislations.filter((item) => {
    if (!searchTerm) return true;
    return (
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle editing a legislation
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  // Handle saving a legislation
  const handleSave = (data) => {
    if (editingItem) {
      // Update existing item
      setLegislations(
        legislations.map((item) =>
          item.code === editingItem.code ? data : item
        )
      );
    } else {
      // Add new item
      setLegislations([...legislations, data]);
    }
    setFormOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="p-3 md:p-6 space-y-6 md:space-y-8 bg-gray-50 min-h-screen">
      {/* Top header with logo and user info */}
      <Header />

      {/* Page title and breadcrumbs */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Legislation
          </h1>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Link
              href={`/${params.domain}/dashboard`}
              className="hover:text-blue-600"
            >
              <span>Template Mgmt</span>
            </Link>
            <span className="mx-2">/</span>
            <span>Legislation</span>
          </div>
        </div>

        {/* Add button */}
        <button
          className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          onClick={() => {
            setEditingItem(null); // Reset editing state
            setFormOpen(true); // Open form
          }}
        >
          Add Legislation
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-md shadow-sm p-4 mb-6">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="search"
            className="border rounded-md pl-3 pr-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      </div>

      {/* Table */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Code
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  URL
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLegislations.map((item) => (
                <tr
                  key={item.code}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.code}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.title}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {item.url}
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLegislations.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-sm text-gray-500 italic"
                  >
                    No legislation found matching your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      <LegislationForm
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
        editData={editingItem}
      />
    </div>
  );
}
