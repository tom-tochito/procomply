"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import PageHeader from "./PageHeader";
import RiskAreaTable from "./RiskAreaTable";
import RiskAreaForm from "./RiskAreaForm";

export interface RiskArea {
  id: string;
  code: string;
  description: string;
}

interface RiskAreaManagementProps {
  initialRiskAreas: RiskArea[];
}

export default function RiskAreaManagement({ initialRiskAreas }: RiskAreaManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingRiskArea, setEditingRiskArea] = useState<RiskArea | null>(null);
  const [riskAreas, setRiskAreas] = useState<RiskArea[]>(initialRiskAreas);

  const filteredRiskAreas = riskAreas.filter(
    (area) =>
      area.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (riskAreaData: Omit<RiskArea, "id">) => {
    // Find the full risk area object with id from the state
    const fullRiskArea = riskAreas.find(
      (a) => a.code === riskAreaData.code && a.description === riskAreaData.description
    );
    if (fullRiskArea) {
      setEditingRiskArea(fullRiskArea);
      setFormOpen(true);
    }
  };

  const handleSave = (riskAreaData: Omit<RiskArea, "id">) => {
    if (editingRiskArea) {
      setRiskAreas(
        riskAreas.map((a) =>
          a.id === editingRiskArea.id ? { ...riskAreaData, id: editingRiskArea.id } : a
        )
      );
    } else {
      const newRiskArea = {
        ...riskAreaData,
        id: Date.now().toString(),
      };
      setRiskAreas([...riskAreas, newRiskArea]);
    }
    setFormOpen(false);
    setEditingRiskArea(null);
  };

  return (
    <>
      <PageHeader
        title="Risk Area Management"
        breadcrumb="Risk Area Management"
        onAdd={() => {
          setEditingRiskArea(null);
          setFormOpen(true);
        }}
        addButtonText="Add Risk Area"
      />

      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search risk areas..."
        />
      </div>

      <RiskAreaTable 
        riskAreas={filteredRiskAreas.map((item) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...rest } = item;
          return rest;
        })} 
        onEdit={handleEdit} 
      />

      <RiskAreaForm
        isOpen={formOpen}
        editData={editingRiskArea ? { code: editingRiskArea.code, description: editingRiskArea.description } : undefined}
        onSave={handleSave}
        onClose={() => {
          setFormOpen(false);
          setEditingRiskArea(null);
        }}
      />
    </>
  );
}