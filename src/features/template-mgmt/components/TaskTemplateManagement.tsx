"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import PageHeader from "./PageHeader";
import TaskTemplateTable from "@/components/TaskTemplateTable";
import TaskTemplateForm from "@/components/TaskTemplateForm";

export interface TaskTemplate {
  id: string;
  code: string;
  name: string;
  taskCategory: string;
  type: string;
  instruction: string;
  riskArea: string;
  subsection: string;
  priority: string;
  riskLevel: string;
  statutory: boolean;
  repeatValue: number;
  repeatUnit: string;
  amberValue: number;
  amberUnit: string;
}

interface TaskTemplateManagementProps {
  initialTemplates: TaskTemplate[];
}

export default function TaskTemplateManagement({ initialTemplates }: TaskTemplateManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TaskTemplate | null>(null);
  const [templates, setTemplates] = useState<TaskTemplate[]>(initialTemplates);

  const filteredTemplates = templates.filter(
    (template) =>
      template.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.taskCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.riskArea.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (templateData: {
    code: string;
    name: string;
    taskCategory: string;
    type: string;
    instruction: string;
    riskArea: string;
    subsection: string;
    priority: string;
    riskLevel: string;
    statutory: string;
    repeatValue: string;
    repeatUnit: string;
    amberValue: string;
    amberUnit: string;
  }) => {
    // Find the full template object with id from the state
    const fullTemplate = templates.find(
      (t) => t.code === templateData.code && t.name === templateData.name
    );
    if (fullTemplate) {
      setEditingTemplate(fullTemplate);
      setFormOpen(true);
    }
  };

  const handleSave = (templateData: {
    code: string;
    name: string;
    taskCategory: string;
    type: string;
    instruction: string;
    riskArea: string;
    subsection: string;
    priority: string;
    riskLevel: string;
    statutory: string;
    repeatValue: string;
    repeatUnit: string;
    amberValue: string;
    amberUnit: string;
  }) => {
    const convertedData = {
      code: templateData.code,
      name: templateData.name,
      taskCategory: templateData.taskCategory,
      type: templateData.type,
      instruction: templateData.instruction,
      riskArea: templateData.riskArea,
      subsection: templateData.subsection,
      priority: templateData.priority,
      riskLevel: templateData.riskLevel,
      statutory: templateData.statutory === "Yes",
      repeatValue: parseInt(templateData.repeatValue) || 0,
      repeatUnit: templateData.repeatUnit,
      amberValue: parseInt(templateData.amberValue) || 0,
      amberUnit: templateData.amberUnit,
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
        title="Task Template Management"
        breadcrumb="Task Template Management"
        onAdd={() => {
          setEditingTemplate(null);
          setFormOpen(true);
        }}
        addButtonText="Add Task Template"
      />

      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search task templates..."
        />
      </div>

      <TaskTemplateTable 
        templates={filteredTemplates.map((item) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, statutory, repeatValue, amberValue, ...rest } = item;
          return {
            ...rest,
            statutory: statutory ? "Yes" : "No",
            repeatValue: repeatValue.toString(),
            amberValue: amberValue.toString(),
          };
        })} 
        onEdit={handleEdit} 
      />

      <TaskTemplateForm
        isOpen={formOpen}
        editData={editingTemplate ? {
          code: editingTemplate.code,
          name: editingTemplate.name,
          taskCategory: editingTemplate.taskCategory,
          type: editingTemplate.type,
          instruction: editingTemplate.instruction,
          riskArea: editingTemplate.riskArea,
          subsection: editingTemplate.subsection,
          priority: editingTemplate.priority,
          riskLevel: editingTemplate.riskLevel,
          statutory: editingTemplate.statutory ? "Yes" : "No",
          repeatValue: editingTemplate.repeatValue.toString(),
          repeatUnit: editingTemplate.repeatUnit,
          amberValue: editingTemplate.amberValue.toString(),
          amberUnit: editingTemplate.amberUnit
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