"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Tenant } from "@/features/tenant/models";
import { Legislation } from "../models";
import { startTransition } from "react";
import SearchBar from "./SearchBar";
import PageHeader from "./PageHeader";
import LegislationTable from "./LegislationTable";
import LegislationForm from "./LegislationForm";

interface LegislationManagementDBProps {
  tenant: Tenant;
}

export default function LegislationManagementDB({ tenant }: LegislationManagementDBProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingLegislation, setEditingLegislation] = useState<Legislation | null>(null);

  const createLegislation = useMutation(api.legislation.createLegislation);
  const updateLegislation = useMutation(api.legislation.updateLegislation);
  const deleteLegislation = useMutation(api.legislation.deleteLegislation);

  // Fetch legislation from Convex
  const legislation = useQuery(api.legislation.getLegislation, {
    tenantId: tenant._id as Id<"tenants">,
  }) || [];

  const filteredLegislation = legislation.filter(
    (item) =>
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (legislation: Legislation) => {
    setEditingLegislation(legislation);
    setFormOpen(true);
  };

  const handleSave = async (legislationData: Omit<Legislation, "_id" | "_creationTime">) => {
    try {
      if (editingLegislation) {
        // Update existing legislation
        await updateLegislation({
          legislationId: editingLegislation._id as Id<"legislation">,
          code: legislationData.code,
          title: legislationData.title,
          url: legislationData.url,
        });
      } else {
        // Create new legislation
        await createLegislation({
          code: legislationData.code,
          title: legislationData.title,
          url: legislationData.url,
          tenantId: tenant._id as Id<"tenants">,
        });
      }
      setFormOpen(false);
      setEditingLegislation(null);
    } catch (error) {
      console.error("Error saving legislation:", error);
    }
  };

  const handleDelete = async (legislation: Legislation) => {
    if (window.confirm(`Are you sure you want to delete "${legislation.title}"?`)) {
      try {
        await deleteLegislation({
          legislationId: legislation._id as Id<"legislation">,
        });
      } catch (error) {
        console.error("Error deleting legislation:", error);
      }
    }
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditingLegislation(null);
  };

  const handleAddNew = () => {
    setEditingLegislation(null);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Legislation"
        breadcrumb="Template Management / Legislation"
        onAdd={handleAddNew}
        addButtonText="Add Legislation"
      />
      
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search by code or title..."
      />

      <LegislationTable
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        legislation={filteredLegislation as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onEdit={handleEdit as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onDelete={handleDelete as any}
      />

      {formOpen && (
        <LegislationForm
          isOpen={formOpen}
          onClose={handleClose}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSave={handleSave as any}
          editData={editingLegislation ? { code: editingLegislation.code, title: editingLegislation.title, url: editingLegislation.url } : undefined}
        />
      )}
    </div>
  );
}