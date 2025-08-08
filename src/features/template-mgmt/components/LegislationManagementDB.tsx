"use client";

import React, { useState } from "react";
import { db } from "~/lib/db";
import { id } from "@instantdb/react";
import { Tenant } from "@/features/tenant/models";
import { Legislation } from "../models";
import { getCurrentTimestamp } from "@/common/utils/date";
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

  // Fetch legislation from InstantDB
  const { data } = db.useQuery({
    legislation: {
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

  const legislation = data?.legislation || [];

  const filteredLegislation = legislation.filter(
    (item) =>
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (legislation: Legislation) => {
    setEditingLegislation(legislation);
    setFormOpen(true);
  };

  const handleSave = (legislationData: Omit<Legislation, "id">) => {
    startTransition(() => {
      if (editingLegislation) {
        // Update existing legislation
        db.transact([
          db.tx.legislation[editingLegislation.id].update({
            code: legislationData.code,
            title: legislationData.title,
            url: legislationData.url || null,
            updatedAt: getCurrentTimestamp(),
          }),
        ]);
      } else {
        // Create new legislation
        const newLegislationId = id();
        db.transact([
          db.tx.legislation[newLegislationId]
            .update({
              code: legislationData.code,
              title: legislationData.title,
              url: legislationData.url || null,
              isActive: true,
              createdAt: getCurrentTimestamp(),
              updatedAt: getCurrentTimestamp(),
            })
            .link({ tenant: tenant.id }),
        ]);
      }
    });
    setFormOpen(false);
    setEditingLegislation(null);
  };

  const handleDelete = (legislation: Legislation) => {
    if (window.confirm(`Are you sure you want to delete "${legislation.title}"?`)) {
      startTransition(() => {
        db.transact([db.tx.legislation[legislation.id].delete()]);
      });
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