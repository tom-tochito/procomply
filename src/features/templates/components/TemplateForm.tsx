"use client";

import React from "react";
import { TemplateField } from "../models";
import { dateInputToTimestamp, timestampToDateInput } from "@/common/utils/date";

interface TemplateFormProps {
  fields: TemplateField[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  errors?: Record<string, string>;
  readOnly?: boolean;
}

export default function TemplateForm({
  fields,
  values,
  onChange,
  errors = {},
  readOnly = false,
}: TemplateFormProps) {
  const renderField = (field: TemplateField) => {
    const value = values[field.key] || "";

    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            id={field.key}
            value={String(value)}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F30] focus:ring-[#F30] sm:text-sm disabled:bg-gray-100"
            disabled={readOnly}
            required={field.required}
          />
        );

      case "textarea":
        return (
          <textarea
            id={field.key}
            value={String(value)}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F30] focus:ring-[#F30] sm:text-sm disabled:bg-gray-100"
            disabled={readOnly}
            required={field.required}
          />
        );

      case "number":
        return (
          <input
            type="number"
            id={field.key}
            value={String(value)}
            onChange={(e) => onChange(field.key, e.target.value ? Number(e.target.value) : "")}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F30] focus:ring-[#F30] sm:text-sm disabled:bg-gray-100"
            disabled={readOnly}
            required={field.required}
          />
        );

      case "date":
        return (
          <input
            type="date"
            id={field.key}
            value={value ? timestampToDateInput(Number(value)) : ""}
            onChange={(e) => onChange(field.key, e.target.value ? dateInputToTimestamp(e.target.value) : null)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F30] focus:ring-[#F30] sm:text-sm disabled:bg-gray-100"
            disabled={readOnly}
            required={field.required}
          />
        );

      case "select":
        return (
          <select
            id={field.key}
            value={String(value)}
            onChange={(e) => onChange(field.key, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F30] focus:ring-[#F30] sm:text-sm disabled:bg-gray-100"
            disabled={readOnly}
            required={field.required}
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
            id={field.key}
            multiple
            value={Array.isArray(value) ? value : []}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
              onChange(field.key, selectedOptions);
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F30] focus:ring-[#F30] sm:text-sm disabled:bg-gray-100"
            disabled={readOnly}
            required={field.required}
            size={4}
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
          <div className="mt-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                id={field.key}
                checked={!!value}
                onChange={(e) => onChange(field.key, e.target.checked)}
                className="rounded border-gray-300 text-[#F30] shadow-sm focus:border-[#F30] focus:ring-[#F30] disabled:bg-gray-100"
                disabled={readOnly}
                required={field.required}
              />
              <span className="ml-2 text-sm text-gray-600">{field.placeholder || "Check to enable"}</span>
            </label>
          </div>
        );

      case "url":
        return (
          <input
            type="url"
            id={field.key}
            value={String(value)}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F30] focus:ring-[#F30] sm:text-sm disabled:bg-gray-100"
            disabled={readOnly}
            required={field.required}
          />
        );

      case "image":
      case "file":
        return (
          <div className="mt-1">
            <input
              type="file"
              id={field.key}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onChange(field.key, file);
                }
              }}
              accept={field.accept}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#F30] file:text-white hover:file:bg-[#D30] disabled:opacity-50"
              disabled={readOnly}
              required={field.required && !value}
            />
            {value && typeof value === "string" && (
              <p className="mt-1 text-sm text-gray-500">Current: {value}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <div key={field.key}>
          <label htmlFor={field.key} className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {field.helpText && (
            <p className="mt-1 text-sm text-gray-500">{field.helpText}</p>
          )}
          {renderField(field)}
          {errors[field.key] && (
            <p className="mt-1 text-sm text-red-600">{errors[field.key]}</p>
          )}
        </div>
      ))}
    </div>
  );
}