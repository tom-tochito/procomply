"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import PageHeader from "./PageHeader";
import SurveyTypeTable from "@/components/SurveyTypeTable";
import SurveyTypeForm from "@/components/SurveyTypeForm";

export interface SurveyType {
  id: string;
  name: string;
  description: string;
}

interface SurveyTypeManagementProps {
  initialSurveyTypes: SurveyType[];
}

export default function SurveyTypeManagement({ initialSurveyTypes }: SurveyTypeManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingSurveyType, setEditingSurveyType] = useState<SurveyType | null>(null);
  const [surveyTypes, setSurveyTypes] = useState<SurveyType[]>(initialSurveyTypes);

  const filteredSurveyTypes = surveyTypes.filter(
    (type) =>
      type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (surveyTypeData: Omit<SurveyType, "id">) => {
    // Find the full survey type object with id from the state
    const fullSurveyType = surveyTypes.find(
      (t) => t.name === surveyTypeData.name && t.description === surveyTypeData.description
    );
    if (fullSurveyType) {
      setEditingSurveyType(fullSurveyType);
      setFormOpen(true);
    }
  };

  const handleSave = (surveyTypeData: Omit<SurveyType, "id">) => {
    if (editingSurveyType) {
      setSurveyTypes(
        surveyTypes.map((t) =>
          t.id === editingSurveyType.id ? { ...surveyTypeData, id: editingSurveyType.id } : t
        )
      );
    } else {
      const newSurveyType = {
        ...surveyTypeData,
        id: Date.now().toString(),
      };
      setSurveyTypes([...surveyTypes, newSurveyType]);
    }
    setFormOpen(false);
    setEditingSurveyType(null);
  };

  return (
    <>
      <PageHeader
        title="Survey Type Management"
        breadcrumb="Survey Type Management"
        onAdd={() => {
          setEditingSurveyType(null);
          setFormOpen(true);
        }}
        addButtonText="Add Survey Type"
      />

      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search survey types..."
        />
      </div>

      <SurveyTypeTable 
        surveyTypes={filteredSurveyTypes.map((item) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...rest } = item;
          return rest;
        })} 
        onEdit={handleEdit} 
      />

      <SurveyTypeForm
        isOpen={formOpen}
        editData={editingSurveyType ? { name: editingSurveyType.name, description: editingSurveyType.description } : undefined}
        onSave={handleSave}
        onClose={() => {
          setFormOpen(false);
          setEditingSurveyType(null);
        }}
      />
    </>
  );
}