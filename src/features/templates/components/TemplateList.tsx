"use client";

import React from "react";
import { db } from "~/lib/db";
import { Tenant } from "@/features/tenant/models";
import { Template } from "../models";
import { startTransition } from "react";

interface TemplateListProps {
  templates: Template[];
  onEdit: (templateId: string) => void;
  onCreate: () => void;
  tenant: Tenant;
}

export default function TemplateList({ templates, onEdit, onCreate }: TemplateListProps) {
  const handleToggleActive = (template: Template) => {
    startTransition(() => {
      db.transact([
        db.tx.templates[template.id].update({
          isActive: !template.isActive,
        }),
      ]);
    });
  };

  const handleDelete = (template: Template) => {
    if (window.confirm(`Are you sure you want to delete the template "${template.name}"?`)) {
      startTransition(() => {
        db.transact([db.tx.templates[template.id].delete()]);
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">All Templates</h2>
        <button
          onClick={onCreate}
          className="px-4 py-2 bg-[#F30] text-white rounded-md hover:bg-[#E20] transition-colors"
        >
          Create New Template
        </button>
      </div>

      {templates.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates yet</h3>
          <p className="text-gray-500 mb-4">
            Create your first building template to start collecting structured data.
          </p>
          <button
            onClick={onCreate}
            className="px-4 py-2 bg-[#F30] text-white rounded-md hover:bg-[#E20] transition-colors"
          >
            Create Template
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Template Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fields
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Buildings Using
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {templates.map((template) => {
                const fieldCount = template.fields?.length || 0;
                const buildingCount = ('buildings' in template && Array.isArray(template.buildings)) ? template.buildings.length : 0;

                return (
                  <tr key={template.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{template.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{fieldCount} fields</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(template)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          template.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {template.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(template.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {buildingCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onEdit(template.id)}
                        className="text-[#F30] hover:text-[#E20] mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(template)}
                        className="text-red-600 hover:text-red-900"
                        disabled={buildingCount > 0}
                        title={buildingCount > 0 ? "Cannot delete template in use" : "Delete template"}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}