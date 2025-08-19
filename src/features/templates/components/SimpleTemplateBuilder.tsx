"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import type { TemplateField } from "../models";

interface SimpleTemplateBuilderProps {
  initialFields?: TemplateField[];
  onSave: (fields: TemplateField[]) => void;
  onCancel?: () => void;
}

// Helper function to slugify label to create field key
function labelToKey(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

export function SimpleTemplateBuilder({ initialFields = [], onSave, onCancel }: SimpleTemplateBuilderProps) {
  const [fields, setFields] = useState<TemplateField[]>(initialFields);

  const handleAddField = () => {
    const newField: TemplateField = {
      key: `field_${Date.now()}`,
      label: "",
      type: "text",
      required: false,
    };
    setFields([...fields, newField]);
  };

  const handleUpdateField = (index: number, field: TemplateField) => {
    const newFields = [...fields];
    newFields[index] = field;
    setFields(newFields);
  };

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleLabelChange = (index: number, newLabel: string) => {
    handleUpdateField(index, { 
      ...fields[index], 
      label: newLabel,
      key: labelToKey(newLabel) || fields[index].key
    });
  };

  const handleSave = () => {
    // Validate fields
    const validFields = fields.filter(f => f.label.trim());
    if (validFields.length === 0) {
      alert("Please add at least one field with a label");
      return;
    }
    onSave(validFields);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Template Fields</h3>
        <Button onClick={handleAddField} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Field
        </Button>
      </div>

      {fields.map((field, index) => (
        <Card key={index} className="p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Field Label</Label>
                <Input
                  value={field.label}
                  onChange={(e) => handleLabelChange(index, e.target.value)}
                  placeholder="e.g., Building Name"
                />
              </div>
              <div>
                <Label>Field Type</Label>
                <Select
                  value={field.type}
                  onValueChange={(value) => handleUpdateField(index, { ...field, type: value as TemplateField["type"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="textarea">Text Area</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="select">Dropdown</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {field.type === "select" && (
              <div>
                <Label>Options (comma separated)</Label>
                <Input
                  value={field.options?.join(", ") || ""}
                  onChange={(e) => handleUpdateField(index, { 
                    ...field, 
                    options: e.target.value.split(",").map(s => s.trim()).filter(Boolean) 
                  })}
                  placeholder="e.g., Option 1, Option 2, Option 3"
                />
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={field.required}
                  onCheckedChange={(checked) => handleUpdateField(index, { ...field, required: !!checked })}
                />
                <Label className="cursor-pointer">Required field</Label>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveField(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSave}>
          Save Template
        </Button>
      </div>
    </div>
  );
}