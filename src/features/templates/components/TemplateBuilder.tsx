"use client";

import { useState, useId } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, GripVertical, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import type { TemplateField } from "../models";

interface TemplateBuilderProps<T extends { _id: string }> {
  entity?: T;
  entityType: string;
  initialFields?: TemplateField[];
  onSave: (fields: TemplateField[]) => void;
  onCancel?: () => void;
}

interface SortableFieldProps {
  field: TemplateField;
  fieldId: string;
  index: number;
  onUpdate: (index: number, field: TemplateField) => void;
  onRemove: (index: number) => void;
}

// Helper function to slugify label to create field key
function labelToKey(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

function SortableField({ field, fieldId, index, onUpdate, onRemove }: SortableFieldProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: fieldId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleLabelChange = (newLabel: string) => {
    onUpdate(index, { 
      ...field, 
      label: newLabel,
      key: labelToKey(newLabel)
    });
  };

  return (
    <Card ref={setNodeRef} style={style} className="p-4 mb-4">
      <div className="flex gap-4">
        <div className="flex items-center cursor-move" {...attributes} {...listeners}>
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Display Label</Label>
              <Input
                value={field.label}
                onChange={(e) => handleLabelChange(e.target.value)}
                placeholder="Field Label"
              />
              <p className="text-xs text-gray-500 mt-1">Key: {field.key}</p>
            </div>
            <div>
              <Label>Field Type</Label>
              <Select
                value={field.type}
                onValueChange={(value) => onUpdate(index, { ...field, type: value as TemplateField["type"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="textarea">Text Area</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                  <SelectItem value="multiselect">Multi-Select</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="file">File</SelectItem>
                  <SelectItem value="url">URL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id={`required-${index}`}
              checked={field.required}
              onCheckedChange={(checked) => onUpdate(index, { ...field, required: checked as boolean })}
            />
            <Label htmlFor={`required-${index}`}>Required</Label>
          </div>

          {(field.type === "select" || field.type === "multiselect") && (
            <div>
              <Label>Options (comma-separated)</Label>
              <Input
                value={field.options?.join(", ") || ""}
                onChange={(e) => onUpdate(index, { 
                  ...field, 
                  options: e.target.value.split(",").map(opt => opt.trim()).filter(Boolean) 
                })}
                placeholder="Option 1, Option 2, Option 3"
              />
            </div>
          )}

          {field.type === "number" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Min Value</Label>
                <Input
                  type="number"
                  value={field.min || ""}
                  onChange={(e) => onUpdate(index, { ...field, min: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
              <div>
                <Label>Max Value</Label>
                <Input
                  type="number"
                  value={field.max || ""}
                  onChange={(e) => onUpdate(index, { ...field, max: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
            </div>
          )}

          {field.type === "textarea" && (
            <div>
              <Label>Rows</Label>
              <Input
                type="number"
                value={field.rows || 3}
                onChange={(e) => onUpdate(index, { ...field, rows: Number(e.target.value) })}
                min="1"
                max="10"
              />
            </div>
          )}

          {(field.type === "image" || field.type === "file") && (
            <div>
              <Label>Accepted File Types</Label>
              <Input
                value={field.accept || ""}
                onChange={(e) => onUpdate(index, { ...field, accept: e.target.value })}
                placeholder="e.g., .pdf,.doc,.docx or image/*"
              />
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

export function TemplateBuilder<T extends { _id: string }>({ 
  entity, 
  entityType, 
  initialFields = [], 
  onSave, 
  onCancel 
}: TemplateBuilderProps<T>) {
  const [fields, setFields] = useState<TemplateField[]>(initialFields);
  const [fieldIds, setFieldIds] = useState<string[]>(() => 
    initialFields.map((_, i) => `field-${Date.now()}-${i}`)
  );
  const fileInputId = useId();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fieldIds.indexOf(active.id as string);
      const newIndex = fieldIds.indexOf(over.id as string);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        setFields(arrayMove(fields, oldIndex, newIndex));
        setFieldIds(arrayMove(fieldIds, oldIndex, newIndex));
      }
    }
  };

  const addField = () => {
    const newField: TemplateField = {
      key: labelToKey("New Field"),
      label: "New Field",
      type: "text",
      required: false,
    };
    setFields([...fields, newField]);
    setFieldIds([...fieldIds, `field-${Date.now()}-${fields.length}`]);
  };

  const updateField = (index: number, field: TemplateField) => {
    const newFields = [...fields];
    newFields[index] = field;
    setFields(newFields);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
    setFieldIds(fieldIds.filter((_, i) => i !== index));
  };

  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter(line => line.trim());
      
      if (lines.length > 0) {
        const headers = lines[0].split(",").map(h => h.trim());
        const importedFields: TemplateField[] = headers.map(header => ({
          key: labelToKey(header),
          label: header,
          type: "text" as const,
          required: false,
        }));
        
        setFields(importedFields);
        // Reset field IDs for imported fields
        setFieldIds(importedFields.map((_, i) => `field-${Date.now()}-${i}`));
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleSave = () => {
    const validFields = fields.filter(field => field.key && field.label);
    const uniqueKeys = new Set<string>();
    const deduplicatedFields = validFields.filter(field => {
      if (uniqueKeys.has(field.key)) return false;
      uniqueKeys.add(field.key);
      return true;
    });
    
    onSave(deduplicatedFields);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <input
            id={fileInputId}
            type="file"
            accept=".csv"
            onChange={handleCsvImport}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById(fileInputId)?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Button onClick={addField}>Add Field</Button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fieldIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <SortableField
                key={fieldIds[index]}
                field={field}
                fieldId={fieldIds[index]}
                index={index}
                onUpdate={updateField}
                onRemove={removeField}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {fields.length === 0 && (
        <Card className="p-8 text-center text-gray-500">
          <p>No fields added yet. Click &quot;Add Field&quot; or import from CSV to get started.</p>
        </Card>
      )}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSave} disabled={fields.length === 0}>
          Save Template
        </Button>
      </div>
    </div>
  );
}