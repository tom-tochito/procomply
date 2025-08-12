"use client";

import React from "react";
import type { TemplateField } from "@/features/templates/models";

interface DynamicFieldRendererProps {
  field: TemplateField;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
}

export default function DynamicFieldRenderer({
  field,
  value,
  onChange,
  disabled = false,
}: DynamicFieldRendererProps) {
  const renderField = () => {
    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            value={String(value || "")}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
          />
        );

      case "textarea":
        return (
          <textarea
            value={String(value || "")}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            disabled={disabled}
            rows={field.rows || 4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={value !== null && value !== undefined ? Number(value) : ""}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
            placeholder={field.placeholder}
            required={field.required}
            disabled={disabled}
            min={field.min}
            max={field.max}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
          />
        );

      case "date":
        return (
          <input
            type="date"
            value={String(value || "")}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
          />
        );

      case "select":
        return (
          <select
            value={String(value || "")}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
          >
            <option value="">{field.placeholder || "Select an option"}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "multiselect":
        return (
          <select
            multiple
            value={Array.isArray(value) ? value : []}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions).map(
                (option) => option.value
              );
              onChange(selectedOptions);
            }}
            required={field.required}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            size={Math.min(field.options?.length || 4, 6)}
          >
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
              required={field.required}
              disabled={disabled}
              className="h-4 w-4 text-[#F30] focus:ring-[#F30] border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              {field.placeholder || field.label}
            </span>
          </label>
        );

      case "url":
        return (
          <input
            type="url"
            value={String(value || "")}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || "https://example.com"}
            required={field.required}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
          />
        );

      case "image":
      case "file":
        return (
          <div className="space-y-2">
            {(() => {
              if (value && typeof value === "string") {
                return (
                  <div className="text-sm text-gray-600">
                    Current: {value.split("/").pop()}
                  </div>
                );
              }
              return null;
            })()}
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // In a real implementation, you'd handle file upload here
                  // For now, we'll just store the file name
                  onChange(file.name);
                }
              }}
              accept={field.accept}
              required={field.required && !value}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>
        );

      default:
        return (
          <div className="text-sm text-gray-500">
            Unsupported field type: {field.type}
          </div>
        );
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </label>
      {renderField()}
      {field.helpText && (
        <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
      )}
    </div>
  );
}