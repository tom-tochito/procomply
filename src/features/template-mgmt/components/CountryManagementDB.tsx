"use client";

import React, { useState } from "react";
import { db } from "~/lib/db";
import { id } from "@instantdb/react";
import { Tenant } from "@/features/tenant/models";
import { Country } from "../models";
import { getCurrentTimestamp } from "@/common/utils/date";
import { startTransition } from "react";
import SearchBar from "./SearchBar";
import PageHeader from "./PageHeader";
import CountryTable from "./CountryTable";
import CountryForm from "./CountryForm";

interface CountryManagementDBProps {
  tenant: Tenant;
}

export default function CountryManagementDB({ tenant }: CountryManagementDBProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);

  // Fetch countries from InstantDB
  const { data } = db.useQuery({
    countries: {
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

  const countries = data?.countries || [];

  const filteredCountries = countries.filter(
    (country) =>
      country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (country: Country) => {
    setEditingCountry(country);
    setFormOpen(true);
  };

  const handleSave = (countryData: Omit<Country, "id">) => {
    startTransition(() => {
      if (editingCountry) {
        // Update existing country
        db.transact([
          db.tx.countries[editingCountry.id].update({
            code: countryData.code,
            description: countryData.description,
            updatedAt: getCurrentTimestamp(),
          }),
        ]);
      } else {
        // Create new country
        const newCountryId = id();
        db.transact([
          db.tx.countries[newCountryId]
            .update({
              code: countryData.code,
              description: countryData.description,
              isActive: true,
              createdAt: getCurrentTimestamp(),
              updatedAt: getCurrentTimestamp(),
            })
            .link({ tenant: tenant.id }),
        ]);
      }
    });
    setFormOpen(false);
    setEditingCountry(null);
  };

  const handleDelete = (country: Country) => {
    if (window.confirm(`Are you sure you want to delete "${country.description}"?`)) {
      startTransition(() => {
        db.transact([db.tx.countries[country.id].delete()]);
      });
    }
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditingCountry(null);
  };

  const handleAddNew = () => {
    setEditingCountry(null);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Country"
        breadcrumb="Template Management / Country"
        onAdd={handleAddNew}
        addButtonText="Add Country"
      />
      
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search by code or description..."
      />

      <CountryTable
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        countries={filteredCountries as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onEdit={handleEdit as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onDelete={handleDelete as any}
      />

      {formOpen && (
        <CountryForm
          isOpen={formOpen}
          onClose={handleClose}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSave={handleSave as any}
          editData={editingCountry ? { code: editingCountry.code, description: editingCountry.description } : undefined}
        />
      )}
    </div>
  );
}