"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Tenant } from "@/features/tenant/models";
import { startTransition } from "react";
import SearchBar from "./SearchBar";
import PageHeader from "./PageHeader";
import Table from "@/common/components/Table/Table";
import { ColumnDef } from "@tanstack/react-table";

interface GenericEntity {
  _id: string;
  _creationTime: number;
  code: string;
  description: string;
  isActive?: boolean;
  createdAt: number;
  updatedAt: number;
}

interface GenericTemplateManagementProps {
  tenant: Tenant;
  entityName: string;
  entityNamePlural: string;
  entityType: "riskAreas" | "subsections" | "surveyTypes" | "taskCategories";
}

export default function GenericTemplateManagement({
  tenant,
  entityName,
  entityNamePlural,
  entityType,
}: GenericTemplateManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<GenericEntity | null>(null);
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const createEntity = useMutation(api.templateEntities.createTemplateEntity);
  const updateEntity = useMutation(api.templateEntities.updateTemplateEntity);
  const deleteEntity = useMutation(api.templateEntities.deleteTemplateEntity);

  // Fetch entities from Convex
  const entities = (useQuery(api.templateEntities.getTemplateEntities, {
    entityType,
    tenantId: tenant._id as Id<"tenants">,
  }) || []) as GenericEntity[];

  const filteredEntities = entities.filter(
    (entity) =>
      entity.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (entity: GenericEntity) => {
    setEditingEntity(entity);
    setCode(entity.code);
    setDescription(entity.description);
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim() || !description.trim()) {
      alert("Code and description are required");
      return;
    }

    try {
      if (editingEntity) {
        // Update existing entity
        await updateEntity({
          entityType,
          entityId: editingEntity._id,
          code: code.trim(),
          description: description.trim(),
        });
      } else {
        // Create new entity
        await createEntity({
          entityType,
          code: code.trim(),
          description: description.trim(),
          tenantId: tenant._id as Id<"tenants">,
        });
      }
      handleClose();
    } catch (error) {
      console.error("Error saving entity:", error);
    }
  };

  const handleDelete = async (entity: GenericEntity) => {
    if (window.confirm(`Are you sure you want to delete "${entity.description}"?`)) {
      try {
        await deleteEntity({
          entityType,
          entityId: entity._id,
        });
      } catch (error) {
        console.error("Error deleting entity:", error);
      }
    }
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditingEntity(null);
    setCode("");
    setDescription("");
  };

  const handleAddNew = () => {
    setEditingEntity(null);
    setCode("");
    setDescription("");
    setFormOpen(true);
  };

  const columns: ColumnDef<GenericEntity>[] = [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900">{getValue() as string}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            onClick={() => handleEdit(row.original)}
          >
            Edit
          </button>
          <button
            className="text-red-600 hover:text-red-800 text-sm font-medium"
            onClick={() => handleDelete(row.original)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={entityName}
        breadcrumb={`Template Management / ${entityName}`}
        onAdd={handleAddNew}
        addButtonText={`Add ${entityName}`}
      />
      
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search by code or description..."
      />

      <Table
        columns={columns}
        data={filteredEntities}
        emptyMessage={`No ${entityNamePlural.toLowerCase()} found matching your search`}
        showPagination={filteredEntities.length > 10}
      />

      {formOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleClose}
            />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingEntity ? `Edit ${entityName}` : `Add New ${entityName}`}
              </h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label
                    htmlFor="code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7600FF] focus:ring-[#7600FF] sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7600FF] focus:ring-[#7600FF] sm:text-sm"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7600FF]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-[#7600FF] border border-transparent rounded-md shadow-sm hover:bg-[#6600CC] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7600FF]"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}