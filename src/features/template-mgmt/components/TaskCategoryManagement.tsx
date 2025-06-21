"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import PageHeader from "./PageHeader";
import TaskCategoryTable from "./TaskCategoryTable";
import TaskCategoryForm from "./TaskCategoryForm";

export interface TaskCategory {
  id: string;
  code: string;
  description: string;
}

interface TaskCategoryManagementProps {
  initialCategories: TaskCategory[];
}

export default function TaskCategoryManagement({ initialCategories }: TaskCategoryManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TaskCategory | null>(null);
  const [categories, setCategories] = useState<TaskCategory[]>(initialCategories);

  const filteredCategories = categories.filter(
    (category) =>
      category.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (categoryData: Omit<TaskCategory, "id">) => {
    // Find the full category object with id from the state
    const fullCategory = categories.find(
      (c) => c.code === categoryData.code && c.description === categoryData.description
    );
    if (fullCategory) {
      setEditingCategory(fullCategory);
      setFormOpen(true);
    }
  };

  const handleSave = (categoryData: Omit<TaskCategory, "id">) => {
    if (editingCategory) {
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id ? { ...categoryData, id: editingCategory.id } : c
        )
      );
    } else {
      const newCategory = {
        ...categoryData,
        id: Date.now().toString(),
      };
      setCategories([...categories, newCategory]);
    }
    setFormOpen(false);
    setEditingCategory(null);
  };

  return (
    <>
      <PageHeader
        title="Task Category Management"
        breadcrumb="Task Category Management"
        onAdd={() => {
          setEditingCategory(null);
          setFormOpen(true);
        }}
        addButtonText="Add Task Category"
      />

      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search task categories..."
        />
      </div>

      <TaskCategoryTable 
        categories={filteredCategories.map((item) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...rest } = item;
          return rest;
        })} 
        onEdit={handleEdit} 
      />

      <TaskCategoryForm
        isOpen={formOpen}
        editData={editingCategory ? { code: editingCategory.code, description: editingCategory.description } : undefined}
        onSave={handleSave}
        onClose={() => {
          setFormOpen(false);
          setEditingCategory(null);
        }}
      />
    </>
  );
}