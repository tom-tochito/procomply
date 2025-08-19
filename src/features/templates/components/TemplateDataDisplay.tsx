"use client";

import { Card } from "@/components/ui/card";
import type { TemplateField } from "../models";
import { formatTimestamp } from "@/common/utils/date";
import { CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TemplateDataDisplayProps {
  fields: TemplateField[];
  data: Record<string, unknown>;
  title?: string;
}

interface FieldDisplayProps {
  field: TemplateField;
  value: unknown;
  spanColumns?: boolean;
}

const shouldSpanTwoColumns = (field: TemplateField): boolean => {
  return ["textarea", "multiselect", "image", "file"].includes(field.type);
};

function FieldDisplay({ field, value, spanColumns = false }: FieldDisplayProps) {
  const renderValue = () => {
    if (value === null || value === undefined || value === "") {
      return <span className="text-gray-400">—</span>;
    }

    switch (field.type) {
      case "checkbox":
        return value ? (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        ) : (
          <XCircle className="h-5 w-5 text-gray-400" />
        );
      
      case "date":
        return <span>{formatTimestamp(Number(value))}</span>;
      
      case "select":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{String(value)}</span>;
      
      case "multiselect":
        return (
          <div className="flex flex-wrap gap-1">
            {(Array.isArray(value) ? value : [value]).map((item, index) => (
              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {item}
              </span>
            ))}
          </div>
        );
      
      case "url":
        return (
          <Link href={String(value)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
            {String(value)}
          </Link>
        );
      
      case "image":
        return (
          <div className="relative w-full max-w-xs h-48 rounded-lg overflow-hidden bg-gray-100">
            {typeof value === "string" && value ? (
              <Image src={value} alt={field.label} fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">No image</div>
            )}
          </div>
        );
      
      case "file":
        return typeof value === "string" && value ? (
          <Link href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
            View File
          </Link>
        ) : (
          <span className="text-gray-400">No file</span>
        );
      
      case "textarea":
        return <p className="whitespace-pre-wrap text-sm">{String(value)}</p>;
      
      case "number":
        return <span className="font-mono">{String(value)}</span>;
      
      default:
        return <span>{String(value)}</span>;
    }
  };

  return (
    <div className={`space-y-1 ${spanColumns ? "col-span-2" : ""}`}>
      <dt className="text-sm font-medium text-gray-600">{field.label}</dt>
      <dd className="text-base text-gray-900">{renderValue()}</dd>
    </div>
  );
}

export function TemplateDataDisplay({ fields, data, title }: TemplateDataDisplayProps) {
  const sortedFields = [...fields].sort((a, b) => {
    // Sort fields to optimize grid layout - single column fields first
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
      
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {sortedFields.map((field) => {
          const value = data[field.key];
          const spanColumns = shouldSpanTwoColumns(field);
          
          return (
            <FieldDisplay
              key={field.key}
              field={field}
              value={value}
              spanColumns={spanColumns}
            />
          );
        })}
      </dl>
    </Card>
  );
}