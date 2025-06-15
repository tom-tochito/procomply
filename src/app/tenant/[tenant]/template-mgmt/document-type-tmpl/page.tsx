"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/common/components/Header";
import DocumentTypeTemplateForm from "@/components/DocumentTypeTemplateForm";
import { generateTenantRedirectUrl } from "@/utils/tenant";
import DocumentTypeTemplateTable from "@/components/DocumentTypeTemplateTable";

// Define the DocumentTypeTemplateData interface
interface DocumentTypeTemplateData {
  code: string;
  description: string;
  title: string;
  statutory: string; // "Yes" or "No"
  category: string;
  subCategory: string;
  repeatValue: string;
  repeatUnit: string;
}

export default function DocumentTypeTemplatePage() {
  const paramsHook = useParams();
  const subdomain = typeof paramsHook.subdomain === 'string' ? paramsHook.subdomain : (Array.isArray(paramsHook.subdomain) ? paramsHook.subdomain[0] : '');
  const [searchTerm, setSearchTerm] = useState("");
  const [templateFormOpen, setTemplateFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<DocumentTypeTemplateData | null>(null); // Type editingTemplate
  const [templates, setTemplates] = useState<DocumentTypeTemplateData[]>([
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
  const filteredTemplates = templates.filter(
    (template: DocumentTypeTemplateData) => {
      // Type template
      if (!searchTerm) return true;
      return (
        template.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  );

  // Handle editing a template
  const handleEditTemplate = (template: DocumentTypeTemplateData) => {
    // Type template
    setEditingTemplate(template);
    setTemplateFormOpen(true);
  };

  // Handle saving a template
  const handleSaveTemplate = (templateData: DocumentTypeTemplateData) => {
    // Type templateData
    if (editingTemplate) {
      // Update existing template
      setTemplates(
        templates.map((t: DocumentTypeTemplateData) =>
          t.code === templateData.code ? templateData : t
        ) // Type t
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
              href={generateTenantRedirectUrl(subdomain, "dashboard")}
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
      <DocumentTypeTemplateTable
        templates={filteredTemplates}
        onEdit={handleEditTemplate}
      />

      {/* Document Type Template Form Modal */}
      <DocumentTypeTemplateForm
        isOpen={templateFormOpen}
        onClose={() => {
          setTemplateFormOpen(false);
          setEditingTemplate(null);
        }}
        onSave={handleSaveTemplate}
        editData={editingTemplate || undefined} // Handle null for editData
      />
    </div>
  );
}
