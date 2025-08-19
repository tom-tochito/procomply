"use client";

import { formatTimestamp } from "@/common/utils/date";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle } from "lucide-react";
import type { TemplateField } from "../models";

interface TemplateViewerProps {
  fields: TemplateField[];
  data: Record<string, unknown>;
  title?: string;
}

export function TemplateViewer({ fields, data, title }: TemplateViewerProps) {
  const renderFieldValue = (field: TemplateField, value: unknown) => {
    if (value === undefined || value === null || value === "") {
      return <span className="text-gray-400">Not provided</span>;
    }

    switch (field.type) {
      case "checkbox":
        return value ? (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        ) : (
          <XCircle className="h-5 w-5 text-gray-400" />
        );
      
      case "date":
        return <span>{typeof value === 'number' ? formatTimestamp(value) : String(value)}</span>;
      
      case "select":
      case "multiselect":
        if (Array.isArray(value)) {
          return (
            <div className="flex flex-wrap gap-1">
              {value.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {item}
                </span>
              ))}
            </div>
          );
        }
        return <span>{String(value)}</span>;
      
      case "textarea":
        return (
          <div className="whitespace-pre-wrap text-sm">
            {String(value)}
          </div>
        );
      
      case "url":
        return (
          <a
            href={String(value)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {String(value)}
          </a>
        );
      
      case "number":
        return <span>{typeof value === 'number' ? value.toLocaleString() : String(value)}</span>;
      
      default:
        return <span>{String(value)}</span>;
    }
  };

  return (
    <Card className="p-6">
      {title && (
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">
          {title}
        </h3>
      )}
      
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.key} className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Label className="text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="md:col-span-2">
              {renderFieldValue(field, data[field.key])}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}