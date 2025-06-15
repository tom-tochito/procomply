"use client";

import React, { useState } from "react";
import PersonSearch from "./PersonSearch";
import ContactCard, { Contact } from "@/features/common/components/ContactCard";
import { Plus, User } from "lucide-react";

interface PersonManagementProps {
  initialPersons: Contact[];
  tenant: string;
}

export default function PersonManagement({
  initialPersons,
}: PersonManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = ["all", "internal", "contractor", "emergency", "supplier", "other"];

  const filteredPersons = initialPersons.filter((person) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      person.name.toLowerCase().includes(searchLower) ||
      (person.company && person.company.toLowerCase().includes(searchLower)) ||
      (person.role && person.role.toLowerCase().includes(searchLower)) ||
      (person.email && person.email.toLowerCase().includes(searchLower)) ||
      (person.phone && person.phone.toLowerCase().includes(searchLower));
    
    const matchesCategory = categoryFilter === "all" || person.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* Search and filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-0 sm:min-w-[300px]">
            <PersonSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30] focus:border-[#F30]"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <button className="px-3 sm:px-4 py-2 bg-[#F30] text-white rounded-md hover:bg-[#E62E00] transition-colors flex items-center gap-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#F30] focus:ring-offset-2">
            <Plus className="h-4 w-4" />
            Add Person
          </button>
        </div>
      </div>

      {/* Contacts grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredPersons.map((person) => (
          <ContactCard 
            key={person.id} 
            contact={person} 
            showCategory={person.category !== undefined}
            showPrimaryBadge={false}
          />
        ))}
      </div>

      {filteredPersons.length === 0 && (
        <div className="bg-white shadow rounded-lg p-12">
          <div className="text-center">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">No contacts found</p>
          </div>
        </div>
      )}
    </>
  );
}