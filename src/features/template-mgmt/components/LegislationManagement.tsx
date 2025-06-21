"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import PageHeader from "./PageHeader";
import LegislationTable from "./LegislationTable";
import LegislationForm from "./LegislationForm";

export interface Legislation {
  id: string;
  code: string;
  title: string;
  url?: string;
}

interface LegislationManagementProps {
  initialLegislation: Legislation[];
}

export default function LegislationManagement({ initialLegislation }: LegislationManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingLegislation, setEditingLegislation] = useState<Legislation | null>(null);
  const [legislation, setLegislation] = useState<Legislation[]>(initialLegislation);

  const filteredLegislation = legislation.filter(
    (item) =>
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (legislationData: Omit<Legislation, "id">) => {
    // Find the full legislation object with id from the state
    const fullLegislation = legislation.find(
      (l) => l.code === legislationData.code && l.title === legislationData.title
    );
    if (fullLegislation) {
      setEditingLegislation(fullLegislation);
      setFormOpen(true);
    }
  };

  const handleSave = (legislationData: Omit<Legislation, "id">) => {
    if (editingLegislation) {
      setLegislation(
        legislation.map((l) =>
          l.id === editingLegislation.id ? { ...legislationData, id: editingLegislation.id } : l
        )
      );
    } else {
      const newLegislation = {
        ...legislationData,
        id: Date.now().toString(),
      };
      setLegislation([...legislation, newLegislation]);
    }
    setFormOpen(false);
    setEditingLegislation(null);
  };

  return (
    <>
      <PageHeader
        title="Legislation Management"
        breadcrumb="Legislation Management"
        onAdd={() => {
          setEditingLegislation(null);
          setFormOpen(true);
        }}
        addButtonText="Add Legislation"
      />

      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search legislation..."
        />
      </div>

      <LegislationTable 
        legislations={filteredLegislation.map((item) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...rest } = item;
          return rest;
        })} 
        onEdit={handleEdit} 
      />

      <LegislationForm
        isOpen={formOpen}
        editData={editingLegislation ? { 
          code: editingLegislation.code, 
          title: editingLegislation.title, 
          url: editingLegislation.url 
        } : undefined}
        onSave={handleSave}
        onClose={() => {
          setFormOpen(false);
          setEditingLegislation(null);
        }}
      />
    </>
  );
}