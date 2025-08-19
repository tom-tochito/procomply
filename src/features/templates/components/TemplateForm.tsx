"use client";

import React from "react";
import { TemplateField } from "../models";
import { dateInputToTimestamp, timestampToDateInput } from "@/common/utils/date";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface TemplateFormProps {
  fields: TemplateField[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  errors?: Record<string, string>;
  readOnly?: boolean;
  title?: string;
}

const shouldSpanTwoColumns = (field: TemplateField): boolean => {
  return ["textarea", "multiselect", "image", "file"].includes(field.type);
};

export default function TemplateForm({
  fields,
  values,
  onChange,
  errors = {},
  readOnly = false,
  title,
}: TemplateFormProps) {
  const renderField = (field: TemplateField) => {
    const value = values[field.key] || "";
    const fieldError = errors[field.key];

    switch (field.type) {
      case "text":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.key}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.helpText && (
              <p className="text-sm text-gray-500">{field.helpText}</p>
            )}
            <Input
              id={field.key}
              type="text"
              value={String(value)}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              disabled={readOnly}
              required={field.required}
              className={fieldError ? "border-red-500" : ""}
            />
            {fieldError && (
              <p className="text-sm text-red-600">{fieldError}</p>
            )}
          </div>
        );

      case "textarea":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.key}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.helpText && (
              <p className="text-sm text-gray-500">{field.helpText}</p>
            )}
            <Textarea
              id={field.key}
              value={String(value)}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={field.rows || 3}
              disabled={readOnly}
              required={field.required}
              className={fieldError ? "border-red-500" : ""}
            />
            {fieldError && (
              <p className="text-sm text-red-600">{fieldError}</p>
            )}
          </div>
        );

      case "number":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.key}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.helpText && (
              <p className="text-sm text-gray-500">{field.helpText}</p>
            )}
            <Input
              id={field.key}
              type="number"
              value={String(value)}
              onChange={(e) => onChange(field.key, e.target.value ? Number(e.target.value) : "")}
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              disabled={readOnly}
              required={field.required}
              className={fieldError ? "border-red-500" : ""}
            />
            {fieldError && (
              <p className="text-sm text-red-600">{fieldError}</p>
            )}
          </div>
        );

      case "date":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.key}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.helpText && (
              <p className="text-sm text-gray-500">{field.helpText}</p>
            )}
            <Input
              id={field.key}
              type="date"
              value={value ? timestampToDateInput(Number(value)) : ""}
              onChange={(e) => onChange(field.key, e.target.value ? dateInputToTimestamp(e.target.value) : null)}
              disabled={readOnly}
              required={field.required}
              className={fieldError ? "border-red-500" : ""}
            />
            {fieldError && (
              <p className="text-sm text-red-600">{fieldError}</p>
            )}
          </div>
        );

      case "select":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.key}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.helpText && (
              <p className="text-sm text-gray-500">{field.helpText}</p>
            )}
            <Select
              value={String(value)}
              onValueChange={(v) => onChange(field.key, v)}
              disabled={readOnly}
              required={field.required}
            >
              <SelectTrigger className={fieldError ? "border-red-500" : ""}>
                <SelectValue placeholder={field.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldError && (
              <p className="text-sm text-red-600">{fieldError}</p>
            )}
          </div>
        );

      case "multiselect":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.key}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.helpText && (
              <p className="text-sm text-gray-500">{field.helpText}</p>
            )}
            <select
              id={field.key}
              multiple
              value={Array.isArray(value) ? value : []}
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
                onChange(field.key, selectedOptions);
              }}
              className={`w-full rounded-md border ${fieldError ? "border-red-500" : "border-gray-300"} px-3 py-2 text-sm focus:border-[#F30] focus:outline-none focus:ring-1 focus:ring-[#F30] disabled:cursor-not-allowed disabled:opacity-50`}
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
            {fieldError && (
              <p className="text-sm text-red-600">{fieldError}</p>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.key}
                checked={!!value}
                onCheckedChange={(checked) => onChange(field.key, checked)}
                disabled={readOnly}
                required={field.required}
              />
              <Label htmlFor={field.key} className="text-sm font-normal cursor-pointer">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            {field.helpText && (
              <p className="text-sm text-gray-500 ml-6">{field.helpText}</p>
            )}
            {fieldError && (
              <p className="text-sm text-red-600 ml-6">{fieldError}</p>
            )}
          </div>
        );

      case "url":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.key}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.helpText && (
              <p className="text-sm text-gray-500">{field.helpText}</p>
            )}
            <Input
              id={field.key}
              type="url"
              value={String(value)}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              disabled={readOnly}
              required={field.required}
              className={fieldError ? "border-red-500" : ""}
            />
            {fieldError && (
              <p className="text-sm text-red-600">{fieldError}</p>
            )}
          </div>
        );

      case "image":
      case "file":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.key}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.helpText && (
              <p className="text-sm text-gray-500">{field.helpText}</p>
            )}
            <Input
              id={field.key}
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onChange(field.key, file);
                }
              }}
              accept={field.accept}
              disabled={readOnly}
              required={field.required && !value}
              className={fieldError ? "border-red-500" : ""}
            />
            {value && typeof value === "string" && (
              <p className="text-sm text-gray-500">Current: {value}</p>
            )}
            {fieldError && (
              <p className="text-sm text-red-600">{fieldError}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Sort fields to optimize grid layout
  const sortedFields = [...fields].sort((a, b) => {
    const aSpans = shouldSpanTwoColumns(a);
    const bSpans = shouldSpanTwoColumns(b);
    if (aSpans && !bSpans) return 1;
    if (!aSpans && bSpans) return -1;
    return 0;
  });

  return (
    <Card className="p-6 overflow-hidden">
      {title && (
        <h3 className="text-lg font-semibold mb-6">{title}</h3>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {sortedFields.map((field) => {
          const spanColumns = shouldSpanTwoColumns(field);
          
          return (
            <div
              key={field.key}
              className={spanColumns ? "md:col-span-2" : ""}
            >
              {renderField(field)}
            </div>
          );
        })}
      </div>
    </Card>
  );
}