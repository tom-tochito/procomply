"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Tenant } from "@/features/tenant/models";
import { Country } from "../models";
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

  const createCountry = useMutation(api.countries.createCountry);
  const updateCountry = useMutation(api.countries.updateCountry);
  const deleteCountry = useMutation(api.countries.deleteCountry);

  // Fetch countries from Convex
  const countries = useQuery(api.countries.getCountries, {
    tenantId: tenant._id as Id<"tenants">,
  }) || [];

  const filteredCountries = countries.filter(
    (country) =>
      country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (country: Country) => {
    setEditingCountry(country);
    setFormOpen(true);
  };

  const handleSave = async (countryData: Omit<Country, "_id" | "_creationTime">) => {
    try {
      if (editingCountry) {
        // Update existing country
        await updateCountry({
          countryId: editingCountry._id as Id<"countries">,
          code: countryData.code,
          name: countryData.name,
        });
      } else {
        // Create new country
        await createCountry({
          code: countryData.code,
          name: countryData.name,
          tenantId: tenant._id as Id<"tenants">,
        });
      }
      setFormOpen(false);
      setEditingCountry(null);
    } catch (error) {
      console.error("Error saving country:", error);
    }
  };

  const handleDelete = async (country: Country) => {
    if (window.confirm(`Are you sure you want to delete "${country.name}"?`)) {
      try {
        await deleteCountry({
          countryId: country._id as Id<"countries">,
        });
      } catch (error) {
        console.error("Error deleting country:", error);
      }
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
        placeholder="Search by code or name..."
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
          editData={editingCountry ? { code: editingCountry.code, name: editingCountry.name } : undefined}
        />
      )}
    </div>
  );
}