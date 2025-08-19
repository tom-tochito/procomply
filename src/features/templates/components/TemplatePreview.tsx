"use client";

import React, { useState } from "react";
import { TemplateField } from "../models";
import TemplateForm from "./TemplateForm";
import { TemplateDataDisplay } from "./TemplateDataDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

interface TemplatePreviewProps {
  fields: TemplateField[];
  templateName: string;
  entityType?: string;
}

export default function TemplatePreview({ fields, templateName, entityType = "building" }: TemplatePreviewProps) {
  const [previewValues, setPreviewValues] = useState<Record<string, unknown>>({});

  const handleFieldChange = (key: string, value: unknown) => {
    setPreviewValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (fields.length === 0) {
    return (
      <Card className="bg-gray-50 p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-500">No fields added yet</p>
        <p className="text-sm text-gray-400 mt-1">Add fields to see how your template will look</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-gray-900">
          {templateName || `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} Template`} - Preview
        </h4>
        <p className="text-sm text-gray-500 mt-1">
          Preview how your template will appear in different contexts
        </p>
      </div>

      <Tabs defaultValue="form" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">Form View</TabsTrigger>
          <TabsTrigger value="display">Display View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="form" className="mt-4">
          <div className="max-h-[600px] overflow-y-auto">
            <TemplateForm
              fields={fields}
              values={previewValues}
              onChange={handleFieldChange}
              title={`Create New ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="display" className="mt-4">
          <div className="max-h-[600px] overflow-y-auto">
            <TemplateDataDisplay
              fields={fields}
              data={previewValues}
              title={`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} Details`}
            />
          </div>
        </TabsContent>
      </Tabs>

      {Object.keys(previewValues).length > 0 && (
        <Card className="p-4 bg-gray-50">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Preview Data:</h5>
          <pre className="text-xs text-gray-600 overflow-x-auto max-h-32 overflow-y-auto bg-white p-2 rounded border">
            {JSON.stringify(previewValues, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
}