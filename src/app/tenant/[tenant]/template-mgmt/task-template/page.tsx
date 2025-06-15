"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/common/components/Header/Header";
import TaskTemplateForm from "@/components/TaskTemplateForm";
import { generateTenantRedirectUrl } from "@/utils/tenant";
import TaskTemplateTable from "@/components/TaskTemplateTable";

// Updated TaskTemplateData interface to match TaskTemplateForm.tsx
interface TaskTemplateData {
  code: string;
  name: string;
  taskCategory: string;
  type: string;
  instruction: string;
  riskArea: string;
  subsection: string;
  priority: string;
  riskLevel: string;
  statutory: string; // "Yes" or "No"
  repeatValue: string;
  repeatUnit: string;
  amberValue: string;
  amberUnit: string;
}

export default function TaskTemplatePage() {
  const paramsHook = useParams();
  const subdomain =
    typeof paramsHook.subdomain === "string"
      ? paramsHook.subdomain
      : Array.isArray(paramsHook.subdomain)
      ? paramsHook.subdomain[0]
      : "";
  const [searchTerm, setSearchTerm] = useState("");
  const [templateFormOpen, setTemplateFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<TaskTemplateData | null>(null);
  const [templates, setTemplates] = useState<TaskTemplateData[]>([
    {
      code: "TT-661439",
      name: "6 Monthly Fire Alarm Service",
      taskCategory: "Fire Safety",
      type: "Service",
      instruction: "Inspect and test the fire alarm system",
      riskArea: "Fire",
      subsection: "Inspection",
      priority: "High",
      riskLevel: "Medium",
      statutory: "Yes",
      repeatValue: "6",
      repeatUnit: "MONTHLY",
      amberValue: "1",
      amberUnit: "MONTHLY",
    },
    {
      code: "TT-412241",
      name: "6 Monthly Fire Extinguisher Service",
      taskCategory: "Fire Safety",
      type: "Service",
      instruction: "Service the fire extinguishers",
      riskArea: "Fire",
      subsection: "Fire Alarm System",
      priority: "High",
      riskLevel: "Medium",
      statutory: "Yes",
      repeatValue: "6",
      repeatUnit: "MONTHLY",
      amberValue: "2",
      amberUnit: "WEEKLY",
    },
    {
      code: "TT-395976",
      name: "Access Door Controls",
      taskCategory: "Access Control",
      type: "Inspection",
      instruction: "The door should be fixed",
      riskArea: "Health & Safety",
      subsection: "",
      priority: "High",
      riskLevel: "High",
      statutory: "Yes",
      repeatValue: "0",
      repeatUnit: "YEARLY",
      amberValue: "1",
      amberUnit: "MONTHLY",
    },
    {
      code: "TT-453827",
      name: "Access to Dry Riser",
      taskCategory: "Fire Safety",
      type: "Inspection",
      instruction: "Ensure clear access to the dry riser",
      riskArea: "Fire",
      subsection: "Fire Hazards",
      priority: "High",
      riskLevel: "Medium",
      statutory: "Yes",
      repeatValue: "0",
      repeatUnit: "YEARLY",
      amberValue: "1",
      amberUnit: "MONTHLY",
    },
    {
      code: "TT-363623",
      name: "Add Cross Sectional Drawings",
      taskCategory: "Documentation",
      type: "Administrative",
      instruction: "Add cross sectional drawings to the installation",
      riskArea: "Electrical",
      subsection: "Label",
      priority: "Medium",
      riskLevel: "Medium",
      statutory: "Yes",
      repeatValue: "0",
      repeatUnit: "",
      amberValue: "1",
      amberUnit: "YEARLY",
    },
  ]);

  // Filter templates based on search
  const filteredTemplates = templates.filter((template: TaskTemplateData) => {
    if (!searchTerm) return true;
    return (
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.riskArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.taskCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle editing a template
  const handleEditTemplate = (template: TaskTemplateData) => {
    setEditingTemplate(template);
    setTemplateFormOpen(true);
  };

  // Handle saving a template
  const handleSaveTemplate = (templateData: TaskTemplateData) => {
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
            Task Template
          </h1>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Link
              href={generateTenantRedirectUrl(subdomain, "dashboard")}
              className="hover:text-blue-600"
            >
              <span>Template Mgmt</span>
            </Link>
            <span className="mx-2">/</span>
            <span>Task Template</span>
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
          Add Task Template
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
      <TaskTemplateTable
        templates={filteredTemplates}
        onEdit={handleEditTemplate}
      />

      {/* Task Template Form Modal */}
      <TaskTemplateForm
        isOpen={templateFormOpen}
        onClose={() => {
          setTemplateFormOpen(false);
          setEditingTemplate(null);
        }}
        onSave={handleSaveTemplate}
        editData={editingTemplate || undefined}
      />
    </div>
  );
}
