"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/common/components/Header";
import TaskTemplateForm from "@/components/TaskTemplateForm";

export default function TaskTemplatePage() {
  const params = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [templateFormOpen, setTemplateFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templates, setTemplates] = useState([
    {
      code: "TT-661439",
      name: "6 Monthly Fire Alarm Service",
      observation: "6 monthly service to the fire alarm system",
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
      observation: "No records of service found",
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
      observation: "The door is not closing properly",
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
      observation: "There is a blockage to the dry riser",
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
      observation: "This installation requires cross sectional drawings",
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
  const filteredTemplates = templates.filter((template) => {
    if (!searchTerm) return true;
    return (
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.riskArea.toLowerCase().includes(searchTerm.toLowerCase())
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
            Task Template
          </h1>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Link
              href={`/${params.domain}/dashboard`}
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
                  Name
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Observation
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Instruction
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Risk Area
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Subsection
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Priority
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Risk Level
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
                  Amber Value
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amber Unit
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
              {filteredTemplates.map((template, index) => (
                <tr
                  key={template.code}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.code}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {template.observation}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {template.instruction}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.riskArea}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.subsection}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.priority}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.riskLevel}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.statutory}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.repeatValue}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.repeatUnit}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.amberValue}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.amberUnit}
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

      {/* Task Template Form Modal */}
      <TaskTemplateForm
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
