"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import PersonSearch from "./PersonSearch";
import ContactCard, { Contact } from "@/features/contacts/components/ContactCard";
import AddPersonModal from "@/features/user/components/AddPersonModal";
import { Plus, User } from "lucide-react";

export default function PersonManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch data from Convex
  const users = useQuery(api.users.getUsers, {}) || [];
  const tenant = useQuery(api.tenants.getCurrentTenant, {});
  const companies = useQuery(api.companies.getCompanies, {}) || [];

  const categories = ["all", "internal", "contractor", "emergency", "supplier", "other"];

  // Transform users to Contact format
  const persons: Contact[] = users
    .filter(user => user !== null)
    .map(user => ({
      id: user._id,
      name: user.profile?.name || user.email || "Unknown",
      email: user.email || "",
      phone: user.profile?.phone || "",
      phoneMobile: user.profile?.phoneMobile || "",
      company: companies.find(c => c._id === user.profile?.companyId)?.name || "",
      category: "internal" // Default category, could be stored in user profile
    }));

  const filteredPersons = persons.filter((person) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      !searchTerm ||
      person.name.toLowerCase().includes(searchLower) ||
      (person.email?.toLowerCase().includes(searchLower) || false) ||
      (person.company?.toLowerCase().includes(searchLower) || false);
    
    const matchesCategory = 
      categoryFilter === "all" || 
      person.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  if (!tenant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search, Filter and Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
          <div className="w-full sm:w-auto sm:flex-1 max-w-md">
            <PersonSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
          
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7600FF] focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#7600FF] hover:bg-[#6600e5] rounded-md transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Person
        </button>
      </div>

      {/* Persons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPersons.length > 0 ? (
          filteredPersons.map((person) => (
            <ContactCard key={person.id} contact={person} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
            <User className="h-12 w-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No persons found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Add Person Modal */}
      <AddPersonModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        tenant={tenant}
        companies={companies}
      />
    </div>
  );
}