"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import PageHeader from "./PageHeader";
import DocumentTypeTemplateTable from "@/components/DocumentTypeTemplateTable";
import DocumentTypeTemplateForm from "@/components/DocumentTypeTemplateForm";

export interface DocumentTypeTemplate {
  id: string;
  code: string;
  description: string;
  title: string;
  statutory: boolean;
  category: string;
  subCategory: string;
  repeatValue: number;
  repeatUnit: string;
}

interface DocumentTypeTemplateManagementProps {
  initialTemplates: DocumentTypeTemplate[];
}

export default function DocumentTypeTemplateManagement({ 
  initialTemplates
}: DocumentTypeTemplateManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTypeTemplate | null>(null);
  const [templates, setTemplates] = useState<DocumentTypeTemplate[]>(initialTemplates);

  const filteredTemplates = templates.filter(
    (template) =>
      template.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (templateData: {
    code: string;
    description: string;
    title: string;
    statutory: string;
    category: string;
    subCategory: string;
    repeatValue: string;
    repeatUnit: string;
  }) => {
    // Find the full template object with id from the state
    const fullTemplate = templates.find(
      (t) => t.code === templateData.code && t.description === templateData.description
    );
    if (fullTemplate) {
      setEditingTemplate(fullTemplate);
      setFormOpen(true);
    }
  };

  const handleSave = (templateData: {
    code: string;
    description: string;
    title: string;
    statutory: string;
    category: string;
    subCategory: string;
    repeatValue: string;
    repeatUnit: string;
  }) => {
    const convertedData = {
      code: templateData.code,
      description: templateData.description,
      title: templateData.title,
      statutory: templateData.statutory === "Yes",
      category: templateData.category,
      subCategory: templateData.subCategory,
      repeatValue: parseInt(templateData.repeatValue) || 0,
      repeatUnit: templateData.repeatUnit,
    };
    
    if (editingTemplate) {
      setTemplates(
        templates.map((t) =>
          t.id === editingTemplate.id ? { ...convertedData, id: editingTemplate.id } : t
        )
      );
    } else {
      const newTemplate = {
        ...convertedData,
        id: Date.now().toString(),
      };
      setTemplates([...templates, newTemplate]);
    }
    setFormOpen(false);
    setEditingTemplate(null);
  };

  return (
    <>
      <PageHeader
        title="Document Type Template Management"
        breadcrumb="Document Type Template Management"
        onAdd={() => {
          setEditingTemplate(null);
          setFormOpen(true);
        }}
        addButtonText="Add Document Type Template"
      />

      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search document type templates..."
        />
      </div>

      <DocumentTypeTemplateTable 
        templates={filteredTemplates.map((item) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, statutory, repeatValue, ...rest } = item;
          return {
            ...rest,
            statutory: statutory ? "Yes" : "No",
            repeatValue: repeatValue.toString(),
          };
        })} 
        onEdit={handleEdit} 
      />

      <DocumentTypeTemplateForm
        isOpen={formOpen}
        editData={editingTemplate ? {
          code: editingTemplate.code,
          description: editingTemplate.description,
          title: editingTemplate.title,
          statutory: editingTemplate.statutory ? "Yes" : "No",
          category: editingTemplate.category,
          subCategory: editingTemplate.subCategory,
          repeatValue: editingTemplate.repeatValue.toString(),
          repeatUnit: editingTemplate.repeatUnit
        } : undefined}
        onSave={handleSave}
        onClose={() => {
          setFormOpen(false);
          setEditingTemplate(null);
        }}
      />
    </>
  );
}