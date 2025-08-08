"use client";

import React, { useState } from "react";
import { db } from "~/lib/db";
import { id } from "@instantdb/react";
import { Tenant } from "@/features/tenant/models";
import { getCurrentTimestamp } from "@/common/utils/date";
import { startTransition } from "react";
import SearchBar from "./SearchBar";
import PageHeader from "./PageHeader";
import Table from "@/common/components/Table/Table";
import { ColumnDef } from "@tanstack/react-table";

interface GenericEntity {
  id: string;
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

  // Fetch entities from InstantDB
  const { data } = db.useQuery({
    [entityType]: {
      $: {
        where: {
          "tenant.id": tenant.id,
        },
        order: {
          code: "asc",
        },
      },
    },
  });

  const entities = (data?.[entityType] || []) as GenericEntity[];

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim() || !description.trim()) {
      alert("Code and description are required");
      return;
    }

    startTransition(() => {
      if (editingEntity) {
        // Update existing entity
        db.transact([
          db.tx[entityType][editingEntity.id].update({
            code: code.trim(),
            description: description.trim(),
            updatedAt: getCurrentTimestamp(),
          }),
        ]);
      } else {
        // Create new entity
        const newEntityId = id();
        db.transact([
          db.tx[entityType][newEntityId]
            .update({
              code: code.trim(),
              description: description.trim(),
              isActive: true,
              createdAt: getCurrentTimestamp(),
              updatedAt: getCurrentTimestamp(),
            })
            .link({ tenant: tenant.id }),
        ]);
      }
    });
    handleClose();
  };

  const handleDelete = (entity: GenericEntity) => {
    if (window.confirm(`Are you sure you want to delete "${entity.description}"?`)) {
      startTransition(() => {
        db.transact([db.tx[entityType][entity.id].delete()]);
      });
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