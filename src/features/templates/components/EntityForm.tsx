"use client";

import React, { useState, useEffect } from "react";
import { db } from "~/lib/db";
import TemplateForm from "./TemplateForm";
import { TemplateType, getBuiltinFieldsByType } from "../models";

interface EntityFormProps {
  entityType: TemplateType;
  templateId?: string | null;
  initialValues?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => void;
  onCancel: () => void;
  readOnly?: boolean;
}

export default function EntityForm({
  entityType,
  templateId,
  initialValues = {},
  onSubmit,
  onCancel,
  readOnly = false,
}: EntityFormProps) {
  const [values, setValues] = useState<Record<string, unknown>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get built-in fields for this entity type
  const builtinFields = getBuiltinFieldsByType(entityType);

  // Fetch template if provided
  const { data: templateData } = db.useQuery(
    templateId
      ? {
          templates: {
            $: {
              where: { id: templateId },
              limit: 1,
            },
          },
        }
      : null
  );

  const template = templateData?.templates?.[0];
  const templateFields = template?.fields || [];

  // Combine built-in and template fields
  const allFields = [...builtinFields, ...templateFields];

  // Initialize values for built-in fields
  useEffect(() => {
    const initialData: Record<string, unknown> = { ...initialValues };
    
    // Set default values for built-in fields if not provided
    builtinFields.forEach((field) => {
      if (!(field.key in initialData)) {
        if (field.type === "select" && field.options?.length) {
          // Set first option as default for required selects
          if (field.required) {
            initialData[field.key] = field.options[0];
          }
        } else if (field.type === "checkbox") {
          initialData[field.key] = false;
        } else if (field.type === "multiselect") {
          initialData[field.key] = [];
        }
      }
    });

    setValues(initialData);
  }, [templateId, builtinFields, initialValues]);

  const handleChange = (key: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Clear error when field is changed
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    allFields.forEach((field) => {
      if (field.required && !values[field.key]) {
        newErrors[field.key] = `${field.label} is required`;
      }

      // Additional validation based on field type
      if (values[field.key]) {
        if (field.type === "number") {
          const numValue = Number(values[field.key]);
          if (field.min !== undefined && numValue < field.min) {
            newErrors[field.key] = `${field.label} must be at least ${field.min}`;
          }
          if (field.max !== undefined && numValue > field.max) {
            newErrors[field.key] = `${field.label} must be at most ${field.max}`;
          }
        }
        if (field.type === "url") {
          try {
            new URL(String(values[field.key]));
          } catch {
            newErrors[field.key] = `${field.label} must be a valid URL`;
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Separate built-in and template field values
      const builtinData: Record<string, unknown> = {};
      const templateData: Record<string, unknown> = {};

      Object.entries(values).forEach(([key, value]) => {
        if (builtinFields.some((f) => f.key === key)) {
          builtinData[key] = value;
        } else {
          templateData[key] = value;
        }
      });

      onSubmit({
        ...builtinData,
        data: templateData, // Template data goes in the 'data' field
        template: templateId,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Built-in Fields Section */}
      {builtinFields.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Required Information
          </h3>
          <TemplateForm
            fields={builtinFields}
            values={values}
            onChange={handleChange}
            errors={errors}
            readOnly={readOnly}
          />
        </div>
      )}

      {/* Template Fields Section */}
      {templateFields.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Additional Information
          </h3>
          <TemplateForm
            fields={templateFields}
            values={values}
            onChange={handleChange}
            errors={errors}
            readOnly={readOnly}
          />
        </div>
      )}

      {/* No template selected message */}
      {!templateId && entityType !== "general" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-800">
            No template selected. Only required fields are shown.
            Select a template to add custom fields.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      {!readOnly && (
        <div className="flex justify-end gap-x-3 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7600FF]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-[#7600FF] border border-transparent rounded-md shadow-sm hover:bg-[#6600CC] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7600FF]"
          >
            Save
          </button>
        </div>
      )}
    </form>
  );
}