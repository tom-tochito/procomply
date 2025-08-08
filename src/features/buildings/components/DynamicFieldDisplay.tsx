"use client";

import React from "react";
import Image from "next/image";
import type { TemplateField } from "@/features/templates/models";

interface DynamicFieldDisplayProps {
  field: TemplateField;
  value: unknown;
}

export default function DynamicFieldDisplay({ field, value }: DynamicFieldDisplayProps) {
  const renderValue = () => {
    // Handle empty/null values
    if (value === null || value === undefined || value === "") {
      return <span className="text-gray-400">Not provided</span>;
    }

    switch (field.type) {
      case "text":
      case "textarea":
      case "url":
        return <span className="text-gray-900">{String(value)}</span>;

      case "number":
        return <span className="text-gray-900">{Number(value).toLocaleString()}</span>;

      case "date":
        return (
          <span className="text-gray-900">
            {new Date(String(value)).toLocaleDateString()}
          </span>
        );

      case "select":
        return <span className="text-gray-900">{String(value)}</span>;

      case "multiselect":
        return (
          <span className="text-gray-900">
            {Array.isArray(value) ? value.join(", ") : String(value)}
          </span>
        );

      case "checkbox":
        return (
          <span className={`font-medium ${value ? "text-green-600" : "text-gray-500"}`}>
            {value ? "Yes" : "No"}
          </span>
        );

      case "image":
        if (typeof value === "string" && value.startsWith("http")) {
          return (
            <Image
              src={value}
              alt={field.label}
              width={80}
              height={80}
              className="object-cover rounded-lg"
            />
          );
        }
        return <span className="text-gray-900">{String(value)}</span>;

      case "file":
        if (typeof value === "string" && value.startsWith("http")) {
          return (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7600FF] hover:text-[#6600EE] underline"
            >
              View File
            </a>
          );
        }
        return <span className="text-gray-900">{String(value)}</span>;

      default:
        return <span className="text-gray-900">{String(value)}</span>;
    }
  };

  return (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-gray-500">{field.label}</dt>
      <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{renderValue()}</dd>
    </div>
  );
}