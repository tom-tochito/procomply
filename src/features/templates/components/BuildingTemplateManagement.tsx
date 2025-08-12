"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";
import { toast } from "sonner";
import { TemplateField } from "../models";
import TemplateBuilder from "./TemplateBuilder";
import TemplatePreview from "./TemplatePreview";

interface BuildingTemplateManagementProps {
  tenantId: string;
}

export default function BuildingTemplateManagement({ tenantId }: BuildingTemplateManagementProps) {
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState("");
  const [templateFields, setTemplateFields] = useState<TemplateField[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch existing templates
  const templates = useQuery(api.templates.getTemplates, {
    tenantId: tenantId as Id<"tenants">,
    entity: "building",
  });

  // Mutations
  const createTemplate = useMutation(api.templates.createTemplate);
  const updateTemplate = useMutation(api.templates.updateTemplate);
  const deleteTemplate = useMutation(api.templates.deleteTemplate);

  const handleCreateTemplate = async () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }

    if (templateFields.length === 0) {
      toast.error("Please add at least one field");
      return;
    }

    try {
      await createTemplate({
        tenantId: tenantId as Id<"tenants">,
        name: templateName,
        type: "building",
        entity: "building",
        fields: templateFields,
      });

      toast.success("Template created successfully");
      setIsCreateMode(false);
      setTemplateName("");
      setTemplateFields([]);
    } catch (error) {
      console.error("Error creating template:", error);
      toast.error("Failed to create template");
    }
  };

  const handleUpdateTemplate = async () => {
    if (!editingTemplate || !templateName.trim()) return;

    try {
      await updateTemplate({
        templateId: editingTemplate as Id<"templates">,
        tenantId: tenantId as Id<"tenants">,
        name: templateName,
        fields: templateFields,
      });

      toast.success("Template updated successfully");
      setEditingTemplate(null);
      setTemplateName("");
      setTemplateFields([]);
    } catch (error) {
      console.error("Error updating template:", error);
      toast.error("Failed to update template");
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm("Are you sure you want to delete this template? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteTemplate({
        templateId: templateId as Id<"templates">,
        tenantId: tenantId as Id<"tenants">,
      });

      toast.success("Template deleted successfully");
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Failed to delete template. It may be in use by existing buildings.");
    }
  };

  const startEdit = (template: any) => {
    setEditingTemplate(template._id);
    setTemplateName(template.name);
    setTemplateFields(template.fields);
    setIsCreateMode(true);
  };

  const cancelEdit = () => {
    setIsCreateMode(false);
    setEditingTemplate(null);
    setTemplateName("");
    setTemplateFields([]);
    setShowPreview(false);
  };

  if (isCreateMode) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {editingTemplate ? "Edit Template" : "Create Building Template"}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                {showPreview ? "Hide Preview" : "Show Preview"}
              </button>
              <button
                onClick={cancelEdit}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="templateName" className="block text-sm font-medium text-gray-700 mb-1">
              Template Name
            </label>
            <input
              id="templateName"
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g., Commercial Building Template"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Template Fields</h3>
              <TemplateBuilder
                fields={templateFields}
                onChange={setTemplateFields}
              />
            </div>

            {showPreview && (
              <div>
                <h3 className="text-lg font-medium mb-4">Preview</h3>
                <TemplatePreview
                  fields={templateFields}
                  templateName={templateName}
                />
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
              disabled={!templateName.trim() || templateFields.length === 0}
              className="px-4 py-2 bg-[#F30] text-white rounded-md hover:bg-[#D30] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingTemplate ? "Update Template" : "Create Template"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Building Templates</h1>
        <button
          onClick={() => setIsCreateMode(true)}
          className="px-4 py-2 bg-[#F30] text-white rounded-md hover:bg-[#D30]"
        >
          Create Template
        </button>
      </div>

      {!templates ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F30] mx-auto"></div>
        </div>
      ) : templates.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates yet</h3>
          <p className="text-gray-500 mb-4">Create your first building template to get started.</p>
          <button
            onClick={() => setIsCreateMode(true)}
            className="px-4 py-2 bg-[#F30] text-white rounded-md hover:bg-[#D30]"
          >
            Create Template
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {templates.map((template) => (
            <div key={template._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {template.fields.length} field{template.fields.length !== 1 ? "s" : ""}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {template.fields.slice(0, 5).map((field) => (
                      <span
                        key={field.key}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {field.label}
                      </span>
                    ))}
                    {template.fields.length > 5 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{template.fields.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => startEdit(template)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template._id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}