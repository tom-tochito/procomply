"use client";

import React, { useState } from "react";
import { TemplateField } from "../models";
import TemplateForm from "./TemplateForm";

interface TemplatePreviewProps {
  fields: TemplateField[];
  templateName: string;
}

export default function TemplatePreview({ fields, templateName }: TemplatePreviewProps) {
  const [previewValues, setPreviewValues] = useState<Record<string, unknown>>({});

  const handleFieldChange = (key: string, value: unknown) => {
    setPreviewValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (fields.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-500">No fields added yet</p>
        <p className="text-sm text-gray-400 mt-1">Add fields to see how your template will look</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="mb-4">
        <h4 className="font-medium text-gray-900">
          {templateName || "Building Template"} - Preview
        </h4>
        <p className="text-sm text-gray-500 mt-1">
          This is how your template will appear when creating a new building
        </p>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <TemplateForm
          fields={fields}
          values={previewValues}
          onChange={handleFieldChange}
        />
      </div>

      {Object.keys(previewValues).length > 0 && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Preview Data:</h5>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify(previewValues, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}