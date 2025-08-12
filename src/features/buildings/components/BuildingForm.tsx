"use client";

import React, { useActionState, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";
import type { Building, BuildingWithDivision, BuildingWithTemplate } from "@/features/buildings/models";
import type { Division } from "@/features/divisions/models";
import type { TemplateField } from "@/features/templates/models";
import DynamicFieldRenderer from "./DynamicFieldRenderer";

interface BuildingFormProps {
  building?: Building | BuildingWithDivision | BuildingWithTemplate;
  divisions?: Division[];
  tenant: { id: string; name: string; slug: string };
  onSubmit: (prevState: { error: string | null; success: boolean }, formData: FormData) => Promise<{ error: string | null; success: boolean }>;
  onCancel: () => void;
}

export default function BuildingForm({ building, divisions, tenant, onSubmit, onCancel }: BuildingFormProps) {
  const [state, formAction, isPending] = useActionState(onSubmit, {
    error: null,
    success: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(
    building?.image || null
  );
  
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    (building as BuildingWithTemplate)?.template?._id || ""
  );
  const [templateData, setTemplateData] = useState<Record<string, unknown>>(
    building?.templateData || {}
  );

  // Fetch templates for the current tenant
  const templates = useQuery(api.templates.getTemplates, { 
    tenantId: tenant.id as Id<"tenants">,
    entity: "building" 
  }) || [];
  const selectedTemplate = templates.find(t => t._id === selectedTemplateId);

  // Update template data when template changes
  useEffect(() => {
    if (!building && selectedTemplateId) {
      // Clear template data when changing templates on new building
      setTemplateData({});
    }
  }, [selectedTemplateId, building]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFieldChange = (fieldKey: string, value: unknown) => {
    setTemplateData(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  const handleSubmit = async (formData: FormData) => {
    // Add template ID and template data to form data
    if (selectedTemplateId) {
      formData.append("templateId", selectedTemplateId);
      formData.append("templateData", JSON.stringify(templateData));
    }
    
    return formAction(formData);
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {state.error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
          {state.error}
        </div>
      )}

      {/* Template Selection - Only show for new buildings */}
      {!building && (
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">Select Template</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Building Template *
              </label>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                disabled={isPending}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
                required
              >
                <option value="">Select a template</option>
                {templates.map((template) => (
                  <option key={template._id} value={template._id}>
                    {template.name}
                  </option>
                ))}
              </select>
              {templates.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  No templates found. Please create a template first in Template Management.
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Templates define which fields are available for this building
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Basic Information Section */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Building Name *
            </label>
            <input
              type="text"
              name="name"
              defaultValue={building?.name}
              required
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Division
            </label>
            <select
              name="divisionId"
              defaultValue={(building && 'divisionEntity' in building) ? building.divisionEntity?._id : building?.division || ""}
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            >
              <option value="">Select a division</option>
              {divisions?.map((division) => (
                <option key={division._id} value={division._id}>
                  {division.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Building Image Section */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold mb-4">Building Image</h3>
        
        {imagePreview && (
          <div className="mb-4 relative inline-block">
            <Image
              src={imagePreview}
              alt="Building preview"
              width={200}
              height={150}
              className="rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Image
          </label>
          <input
            ref={fileInputRef}
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
          />
          <p className="text-xs text-gray-500 mt-1">
            Recommended: 16:9 aspect ratio, max 5MB
          </p>
        </div>
      </div>

      {/* Template Fields */}
      {selectedTemplate && selectedTemplate.fields && selectedTemplate.fields.length > 0 && (
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedTemplate.fields.map((field: TemplateField) => (
              <div key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                <DynamicFieldRenderer
                  field={field}
                  value={templateData[field.key]}
                  onChange={(value) => handleFieldChange(field.key, value)}
                  disabled={isPending}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Template Selected Notice */}
      {!building && !selectedTemplateId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Select a Template</h3>
              <p className="mt-1 text-sm text-blue-700">
                Please select a template above to see additional fields for this building.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending || (!building && !selectedTemplateId)}
          className="px-4 py-2 bg-[#F30] text-white rounded-md hover:bg-[#D30] disabled:opacity-50"
        >
          {isPending ? "Saving..." : building ? "Update Building" : "Create Building"}
        </button>
      </div>
    </form>
  );
}