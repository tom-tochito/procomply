"use client";

import React, { useState } from "react";
import { db } from "~/lib/db";
import { Tenant } from "@/features/tenant/models";
import TemplateBuilder from "./TemplateBuilder";
import TemplateList from "./TemplateList";

interface BuildingTemplateManagementProps {
  tenant: Tenant;
}

export default function BuildingTemplateManagement({ tenant }: BuildingTemplateManagementProps) {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);

  // Fetch building templates
  const { data: templatesData, isLoading } = db.useQuery({
    templates: {
      $: {
        where: {
          "tenant.id": tenant.id,
          type: "building",
        },
        order: {
          createdAt: "desc",
        },
      },
    },
  });

  const templates = templatesData?.templates || [];

  const handleEdit = (templateId: string) => {
    setEditingTemplate(templateId);
    setActiveTab("create");
  };

  const handleCreate = () => {
    setEditingTemplate(null);
    setActiveTab("create");
  };

  const handleBack = () => {
    setEditingTemplate(null);
    setActiveTab("list");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading templates...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Building Templates</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage templates for building data collection
          </p>
        </div>

        {activeTab === "list" ? (
          <TemplateList
            templates={templates}
            onEdit={handleEdit}
            onCreate={handleCreate}
            tenant={tenant}
          />
        ) : (
          <TemplateBuilder
            tenant={tenant}
            templateId={editingTemplate}
            onBack={handleBack}
            templateType="building"
          />
        )}
      </div>
    </div>
  );
}