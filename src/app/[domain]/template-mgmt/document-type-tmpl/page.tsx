"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/common/components/Header";
import DocumentTypeTemplateForm from "@/components/DocumentTypeTemplateForm";

export default function DocumentTypeTemplatePage() {
  const params = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [templateFormOpen, setTemplateFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templates, setTemplates] = useState([
    {
      code: "FDIR",
      description: "6 Monthly Fire Door Inspection",
      title: "6 Monthly Fire Door Inspection",
      statutory: "Yes",
      category: "Fire",
      subCategory: "Inspection",
      repeatValue: "6",
      repeatUnit: "MONTHLY",
    },
    {
      code: "AC-SR",
      description: "Air Conditioning Service Record",
      title: "Air Conditioning Service Record",
      statutory: "No",
      category: "Miscellaneous",
      subCategory: "Service Record",
      repeatValue: "1",
      repeatUnit: "YEARLY",
    },
    {
      code: "FDIRALL",
      description: "ALL Fire Door Inspection Report",
      title: "ALL Fire Door Inspection Report",
      statutory: "Yes",
      category: "Fire",
      subCategory: "Inspection",
      repeatValue: "1",
      repeatUnit: "YEARLY",
    },
    {
      code: "ANSUL",
      description: "Ansul Test Records",
      title: "Ansul Test Record",
      statutory: "Yes",
      category: "Fire",
      subCategory: "Test Record",
      repeatValue: "1",
      repeatUnit: "YEARLY",
    },
    {
      code: "REG-APP",
      description: "Appliances Register",
      title: "Appliances Register",
      statutory: "Yes",
      category: "Electrical",
      subCategory: "Register",
      repeatValue: "0",
      repeatUnit: "YEARLY",
    },
    {
      code: "ASB-2MP",
      description: "Asbestos Combined Management and Refurbishment survey",
      title: "Combined Asbestos Survey",
      statutory: "Yes",
      category: "Asbestos",
      subCategory: "Assessment",
      repeatValue: "0",
      repeatUnit: "YEARLY",
    },
    {
      code: "ASB-CCERT",
      description: "Asbestos Completion Certificate",
      title: "Asbestos Completion Certificate",
      statutory: "Yes",
      category: "Asbestos",
      subCategory: "Certificate",
      repeatValue: "0",
      repeatUnit: "YEARLY",
    },
    {
      code: "ASB-DS",
      description: "Asbestos Demolition Survey",
      title: "Asbestos Demolition Survey",
      statutory: "Yes",
      category: "Asbestos",
      subCategory: "Survey",
      repeatValue: "0",
      repeatUnit: "YEARLY",
    },
    {
      code: "ASB-PLN",
      description: "Asbestos Management Plan",
      title: "Asbestos Management Plan",
      statutory: "No",
      category: "Asbestos",
      subCategory: "Management Plan",
      repeatValue: "0",
      repeatUnit: "MONTHLY",
    },
    {
      code: "ASB-SRY",
      description: "Asbestos Management Survey",
      title: "Asbestos Management Survey",
      statutory: "Yes",
      category: "Asbestos",
      subCategory: "Survey",
      repeatValue: "0",
      repeatUnit: "YEARLY",
    },
    {
      code: "ASB-RS",
      description: "Asbestos Refurbishment Survey",
      title: "Asbestos Refurbishment Survey",
      statutory: "Yes",
      category: "Asbestos",
      subCategory: "Survey",
      repeatValue: "0",
      repeatUnit: "YEARLY",
    },
  ]);

  // Filter templates based on search
  const filteredTemplates = templates.filter((template) => {
    if (!searchTerm) return true;
    return (
      template.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle editing a template
  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setTemplateFormOpen(true);
  };

  // Handle saving a template
  const handleSaveTemplate = (templateData) => {
    if (editingTemplate) {
      // Update existing template
      setTemplates(
        templates.map((t) => (t.code === templateData.code ? templateData : t))
      );
    } else {
      // Add new template
      setTemplates([...templates, templateData]);
    }
    setTemplateFormOpen(false);
    setEditingTemplate(null);
  };

  return (
    <div className="p-3 md:p-6 space-y-6 md:space-y-8 bg-gray-50 min-h-screen">
      {/* Top header with logo and user info */}
      <Header />

      {/* Page title and breadcrumbs */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Document Type Tmpl
          </h1>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Link
              href={`/${params.domain}/dashboard`}
              className="hover:text-blue-600"
            >
              <span>Template Mgmt</span>
            </Link>
            <span className="mx-2">/</span>
            <span>Document Type Tmpl</span>
          </div>
        </div>

        {/* Add template button */}
        <button
          className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          onClick={() => {
            setEditingTemplate(null); // Reset editing state
            setTemplateFormOpen(true); // Open form
          }}
        >
          Add Document Type
        </button>
      </div>

      {/* Search and filters */}
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

      {/* Template table */}
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
                  Description
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
                  Statutory
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sub Category
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Repeat Value
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Repeat Unit
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
              {filteredTemplates.map((template) => (
                <tr
                  key={template.code}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.code}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.description}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.title}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.statutory}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.category}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.subCategory}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.repeatValue}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.repeatUnit}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      onClick={() => handleEditTemplate(template)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Type Template Form Modal */}
      <DocumentTypeTemplateForm
        isOpen={templateFormOpen}
        onClose={() => {
          setTemplateFormOpen(false);
          setEditingTemplate(null);
        }}
        onSave={handleSaveTemplate}
        editData={editingTemplate}
      />
    </div>
  );
}
