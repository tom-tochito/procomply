"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import PageHeader from "./PageHeader";
import SubsectionTable from "./SubsectionTable";
import SubsectionForm from "./SubsectionForm";

export interface Subsection {
  id: string;
  code: string;
  description: string;
}

interface SubsectionManagementProps {
  initialSubsections: Subsection[];
}

export default function SubsectionManagement({ initialSubsections }: SubsectionManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingSubsection, setEditingSubsection] = useState<Subsection | null>(null);
  const [subsections, setSubsections] = useState<Subsection[]>(initialSubsections);

  const filteredSubsections = subsections.filter(
    (subsection) =>
      subsection.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subsection.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (subsectionData: Omit<Subsection, "id">) => {
    // Find the full subsection object with id from the state
    const fullSubsection = subsections.find(
      (s) => s.code === subsectionData.code && s.description === subsectionData.description
    );
    if (fullSubsection) {
      setEditingSubsection(fullSubsection);
      setFormOpen(true);
    }
  };

  const handleSave = (subsectionData: Omit<Subsection, "id">) => {
    if (editingSubsection) {
      setSubsections(
        subsections.map((s) =>
          s.id === editingSubsection.id ? { ...subsectionData, id: editingSubsection.id } : s
        )
      );
    } else {
      const newSubsection = {
        ...subsectionData,
        id: Date.now().toString(),
      };
      setSubsections([...subsections, newSubsection]);
    }
    setFormOpen(false);
    setEditingSubsection(null);
  };

  return (
    <>
      <PageHeader
        title="Subsection Management"
        breadcrumb="Subsection Management"
        onAdd={() => {
          setEditingSubsection(null);
          setFormOpen(true);
        }}
        addButtonText="Add Subsection"
      />

      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search subsections..."
        />
      </div>

      <SubsectionTable 
        subsections={filteredSubsections.map((item) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...rest } = item;
          return rest;
        })} 
        onEdit={handleEdit} 
      />

      <SubsectionForm
        isOpen={formOpen}
        editData={editingSubsection ? { code: editingSubsection.code, description: editingSubsection.description } : undefined}
        onSave={handleSave}
        onClose={() => {
          setFormOpen(false);
          setEditingSubsection(null);
        }}
      />
    </>
  );
}