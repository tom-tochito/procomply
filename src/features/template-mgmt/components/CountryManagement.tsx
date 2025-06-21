"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import PageHeader from "./PageHeader";
import CountryTable from "./CountryTable";
import CountryForm from "./CountryForm";

export interface Country {
  id: string;
  code: string;
  description: string;
}

interface CountryManagementProps {
  initialCountries: Country[];
}

export default function CountryManagement({ initialCountries }: CountryManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [countries, setCountries] = useState<Country[]>(initialCountries);

  const filteredCountries = countries.filter(
    (country) =>
      country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (countryData: Omit<Country, "id">) => {
    // Find the full country object with id from the state
    const fullCountry = countries.find(
      (c) => c.code === countryData.code && c.description === countryData.description
    );
    if (fullCountry) {
      setEditingCountry(fullCountry);
      setFormOpen(true);
    }
  };

  const handleSave = (countryData: Omit<Country, "id">) => {
    if (editingCountry) {
      setCountries(
        countries.map((c) =>
          c.id === editingCountry.id ? { ...countryData, id: editingCountry.id } : c
        )
      );
    } else {
      const newCountry = {
        ...countryData,
        id: Date.now().toString(),
      };
      setCountries([...countries, newCountry]);
    }
    setFormOpen(false);
    setEditingCountry(null);
  };

  return (
    <>
      <PageHeader
        title="Country Management"
        breadcrumb="Country Management"
        onAdd={() => {
          setEditingCountry(null);
          setFormOpen(true);
        }}
        addButtonText="Add Country"
      />

      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search countries..."
        />
      </div>

      <CountryTable 
        countries={filteredCountries.map((item) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...rest } = item;
          return rest;
        })} 
        onEdit={handleEdit} 
      />

      <CountryForm
        isOpen={formOpen}
        editData={editingCountry ? { code: editingCountry.code, description: editingCountry.description } : undefined}
        onSave={handleSave}
        onClose={() => {
          setFormOpen(false);
          setEditingCountry(null);
        }}
      />
    </>
  );
}