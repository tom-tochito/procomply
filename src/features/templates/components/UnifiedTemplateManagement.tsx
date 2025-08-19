"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";
import { toast } from "sonner";
import { Template, TemplateField } from "../models";
import { SimpleTemplateBuilder } from "./SimpleTemplateBuilder";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Building2, ClipboardList } from "lucide-react";

interface UnifiedTemplateManagementProps {
  tenantId: string;
  entityType: "building" | "task";
}

const ENTITY_CONFIG = {
  building: {
    title: "Building Templates",
    icon: Building2,
    color: "bg-blue-100 text-blue-700",
  },
  task: {
    title: "Task Templates", 
    icon: ClipboardList,
    color: "bg-green-100 text-green-700",
  },
};

export default function UnifiedTemplateManagement({ 
  tenantId, 
  entityType 
}: UnifiedTemplateManagementProps) {
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState("");
  const [templateFields, setTemplateFields] = useState<TemplateField[]>([]);

  const config = ENTITY_CONFIG[entityType];
  const Icon = config.icon;

  // Fetch existing templates
  const templates = useQuery(api.templates.getTemplates, {
    tenantId: tenantId as Id<"tenants">,
    entity: entityType,
  });

  // Mutations
  const createTemplate = useMutation(api.templates.createTemplate);
  const updateTemplate = useMutation(api.templates.updateTemplate);
  const deleteTemplate = useMutation(api.templates.deleteTemplate);

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }

    if (templateFields.length === 0) {
      toast.error("Please add at least one field");
      return;
    }

    try {
      if (editingTemplate) {
        await updateTemplate({
          templateId: editingTemplate as Id<"templates">,
          tenantId: tenantId as Id<"tenants">,
          name: templateName,
          entity: entityType,
          fields: templateFields,
        });
        toast.success("Template updated successfully");
      } else {
        await createTemplate({
          tenantId: tenantId as Id<"tenants">,
          name: templateName,
          type: entityType,
          entity: entityType,
          fields: templateFields,
        });
        toast.success("Template created successfully");
      }

      setIsCreateMode(false);
      setEditingTemplate(null);
      setTemplateName("");
      setTemplateFields([]);
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to save template");
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm("Are you sure you want to delete this template?")) {
      return;
    }

    try {
      await deleteTemplate({
        templateId: templateId as Id<"templates">,
        tenantId: tenantId as Id<"tenants">,
      });
      toast.success("Template deleted successfully");
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Failed to delete template");
    }
  };

  const startEdit = (template: Template) => {
    setEditingTemplate(template._id);
    setTemplateName(template.name);
    setTemplateFields(template.fields);
    setIsCreateMode(true);
  };

  const cancelEdit = () => {
    setIsCreateMode(false);
    setEditingTemplate(null);
    setTemplateName("");
    setTemplateFields([]);
  };

  if (isCreateMode) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Icon className="h-5 w-5" />
              {editingTemplate ? "Edit Template" : `Create ${entityType} Template`}
            </h2>
            <Button variant="outline" onClick={cancelEdit}>
              Cancel
            </Button>
          </div>

          <div className="mb-6">
            <Label htmlFor="templateName">Template Name</Label>
            <Input
              id="templateName"
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder={`e.g., ${entityType === "building" ? "Commercial Building" : "Maintenance Task"} Template`}
              className="mt-1"
            />
          </div>

          <SimpleTemplateBuilder
            initialFields={templateFields}
            onSave={(fields) => {
              setTemplateFields(fields);
              handleSaveTemplate();
            }}
            onCancel={cancelEdit}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Icon className="h-7 w-7" />
          {config.title}
        </h1>
        <Button onClick={() => setIsCreateMode(true)}>
          Create Template
        </Button>
      </div>

      {!templates ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F30] mx-auto"></div>
        </div>
      ) : templates.length === 0 ? (
        <Card className="p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates yet</h3>
          <p className="text-gray-500 mb-4">
            Create your first {entityType} template to get started.
          </p>
          <Button onClick={() => setIsCreateMode(true)}>
            Create Template
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {templates.map((template) => (
            <Card key={template._id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {template.fields.length} field{template.fields.length !== 1 ? "s" : ""}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {template.fields.slice(0, 5).map((field) => (
                      <span
                        key={field.key}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
                      >
                        {field.label}
                      </span>
                    ))}
                    {template.fields.length > 5 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{template.fields.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(template)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template._id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}