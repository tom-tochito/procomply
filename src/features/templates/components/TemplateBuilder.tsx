"use client";

import React, { useState } from "react";
import { TemplateField } from "../models";

interface TemplateBuilderProps {
  fields: TemplateField[];
  onChange: (fields: TemplateField[]) => void;
}

const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Text Area" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "select", label: "Dropdown" },
  { value: "multiselect", label: "Multi-Select" },
  { value: "checkbox", label: "Checkbox" },
  { value: "url", label: "URL" },
  { value: "image", label: "Image" },
  { value: "file", label: "File" },
];

export default function TemplateBuilder({ fields, onChange }: TemplateBuilderProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [newField, setNewField] = useState<Partial<TemplateField>>({
    type: "text",
    required: false,
  });

  const addField = () => {
    if (!newField.label?.trim() || !newField.key?.trim()) {
      return;
    }

    const field: TemplateField = {
      key: newField.key.replace(/\s+/g, "_").toLowerCase(),
      label: newField.label,
      type: newField.type as TemplateField["type"],
      required: newField.required || false,
      placeholder: newField.placeholder,
      helpText: newField.helpText,
      options: newField.options,
      min: newField.min,
      max: newField.max,
      rows: newField.rows,
      accept: newField.accept,
    };

    onChange([...fields, field]);
    setNewField({ type: "text", required: false });
  };

  const updateField = (index: number, updates: Partial<TemplateField>) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], ...updates };
    onChange(updatedFields);
  };

  const removeField = (index: number) => {
    onChange(fields.filter((_, i) => i !== index));
  };

  const moveField = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fields.length) return;

    const updatedFields = [...fields];
    [updatedFields[index], updatedFields[newIndex]] = [updatedFields[newIndex], updatedFields[index]];
    onChange(updatedFields);
  };

  return (
    <div className="space-y-4">
      {/* Existing Fields */}
      {fields.map((field, index) => (
        <div key={field.key} className="border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div className="font-medium">{field.label}</div>
              <div className="text-sm text-gray-500">
                Key: {field.key} | Type: {field.type}
                {field.required && " | Required"}
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => moveField(index, "up")}
                disabled={index === 0}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={() => moveField(index, "down")}
                disabled={index === fields.length - 1}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button
                onClick={() => setEditingField(editingField === field.key ? null : field.key)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={() => removeField(index)}
                className="p-1 text-red-400 hover:text-red-600"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {editingField === field.key && (
            <div className="mt-3 space-y-2 border-t pt-3">
              <input
                type="text"
                value={field.label}
                onChange={(e) => updateField(index, { label: e.target.value })}
                placeholder="Field Label"
                className="w-full px-2 py-1 text-sm border rounded"
              />
              <input
                type="text"
                value={field.placeholder || ""}
                onChange={(e) => updateField(index, { placeholder: e.target.value })}
                placeholder="Placeholder Text"
                className="w-full px-2 py-1 text-sm border rounded"
              />
              <input
                type="text"
                value={field.helpText || ""}
                onChange={(e) => updateField(index, { helpText: e.target.value })}
                placeholder="Help Text"
                className="w-full px-2 py-1 text-sm border rounded"
              />
              
              {(field.type === "select" || field.type === "multiselect") && (
                <textarea
                  value={field.options?.join("\n") || ""}
                  onChange={(e) => updateField(index, { options: e.target.value.split("\n").filter(Boolean) })}
                  placeholder="Options (one per line)"
                  className="w-full px-2 py-1 text-sm border rounded"
                  rows={3}
                />
              )}

              {field.type === "number" && (
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={field.min || ""}
                    onChange={(e) => updateField(index, { min: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Min"
                    className="flex-1 px-2 py-1 text-sm border rounded"
                  />
                  <input
                    type="number"
                    value={field.max || ""}
                    onChange={(e) => updateField(index, { max: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Max"
                    className="flex-1 px-2 py-1 text-sm border rounded"
                  />
                </div>
              )}

              {field.type === "textarea" && (
                <input
                  type="number"
                  value={field.rows || 3}
                  onChange={(e) => updateField(index, { rows: Number(e.target.value) })}
                  placeholder="Rows"
                  className="w-full px-2 py-1 text-sm border rounded"
                />
              )}

              {(field.type === "image" || field.type === "file") && (
                <input
                  type="text"
                  value={field.accept || ""}
                  onChange={(e) => updateField(index, { accept: e.target.value })}
                  placeholder="Accept (e.g., image/*, .pdf)"
                  className="w-full px-2 py-1 text-sm border rounded"
                />
              )}
            </div>
          )}
        </div>
      ))}

      {/* Add New Field */}
      <div className="border-2 border-dashed rounded-lg p-4">
        <h4 className="font-medium mb-3">Add New Field</h4>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={newField.label || ""}
              onChange={(e) => setNewField({ ...newField, label: e.target.value })}
              placeholder="Field Label"
              className="px-3 py-2 border rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
            <input
              type="text"
              value={newField.key || ""}
              onChange={(e) => setNewField({ ...newField, key: e.target.value })}
              placeholder="Field Key (no spaces)"
              className="px-3 py-2 border rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              value={newField.type}
              onChange={(e) => setNewField({ ...newField, type: e.target.value as TemplateField["type"] })}
              className="px-3 py-2 border rounded-md focus:ring-[#F30] focus:border-[#F30]"
            >
              {FIELD_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newField.required || false}
                onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                className="mr-2 rounded border-gray-300 text-[#F30] focus:ring-[#F30]"
              />
              <span className="text-sm">Required</span>
            </label>
          </div>

          <button
            onClick={addField}
            disabled={!newField.label?.trim() || !newField.key?.trim()}
            className="w-full px-4 py-2 bg-[#F30] text-white rounded-md hover:bg-[#D30] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Field
          </button>
        </div>
      </div>
    </div>
  );
}