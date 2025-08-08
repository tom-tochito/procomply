"use client";

import React, { useState } from "react";
import { db } from "~/lib/db";
import { Tenant } from "@/features/tenant/models";
import TemplateList from "./TemplateList";
import TemplateBuilder from "./TemplateBuilder";

interface TemplateManagementProps {
  tenant: Tenant;
}

export default function TemplateManagement({ tenant }: TemplateManagementProps) {
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch templates with buildings relation
  const { data: templates } = db.useQuery({
    templates: {
      $: {
        where: {
          tenant: tenant.id,
          type: "general",
        },
        include: {
          buildings: true,
        },
      },
    },
  });

  const handleEdit = (templateId: string) => {
    setEditingTemplateId(templateId);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingTemplateId(null);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingTemplateId(null);
  };

  const editingTemplate = editingTemplateId
    ? templates?.templates?.find((t) => t.id === editingTemplateId)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Template Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create and manage templates for collecting structured data across your organization.
          </p>
        </div>

        {isCreating || editingTemplateId ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              {isCreating ? "Create New Template" : `Edit Template: ${editingTemplate?.name}`}
            </h2>
            <TemplateBuilder
              tenant={tenant}
              templateId={editingTemplateId}
              onBack={handleCancel}
              templateType="general"
            />
          </div>
        ) : (
          <TemplateList
            templates={templates?.templates || []}
            onEdit={handleEdit}
            onCreate={handleCreate}
            tenant={tenant}
          />
        )}
      </div>
    </div>
  );
}