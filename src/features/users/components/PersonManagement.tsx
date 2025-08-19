"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import PersonSearch from "./PersonSearch";
import ContactCard, { Contact } from "@/features/contacts/components/ContactCard";
import AddPersonModal from "@/features/users/components/AddPersonModal";
import { Plus, User } from "lucide-react";
import type { Doc } from "~/convex/_generated/dataModel";

interface PersonManagementProps {
  tenant: Doc<"tenants">;
}

export default function PersonManagement({ tenant }: PersonManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch data from Convex
  const users = useQuery(api.users.getUsers, { tenantId: tenant._id }) || [];
  const companies = useQuery(api.companies.getCompanies, { tenantId: tenant._id }) || [];

  // const categories = ["all", "internal", "contractor", "emergency", "supplier", "other"];

  // Transform users to Contact format
  const persons: Contact[] = users
    .filter((user: { _id: string; email: string; name?: string; phone?: string; phoneMobile?: string; companyId?: string } | null) => user !== null)
    .map((user: { _id: string; email: string; name?: string; phone?: string; phoneMobile?: string; companyId?: string }) => ({
      id: user._id,
      name: user.name || user.email || "Unknown",
      email: user.email || "",
      phone: user.phone || "",
      mobile: user.phoneMobile || "",
      company: companies.find(c => c._id === user.companyId)?.name || "",
      category: "internal" as const // Default category, could be stored in user profile
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <PersonSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#F30] text-white rounded-lg hover:bg-[#E02D00] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Person
        </button>
      </div>

      {filteredPersons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <User className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No persons found</h3>
          <p className="text-gray-500 text-center max-w-md">
            {searchTerm 
              ? `No persons match "${searchTerm}". Try adjusting your search.`
              : "Get started by adding your first person."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPersons.map((person) => (
            <ContactCard
              key={person.id}
              contact={person}
            />
          ))}
        </div>
      )}

      {isAddModalOpen && (
        <AddPersonModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          tenant={tenant}
          companies={companies}
        />
      )}
    </div>
  );
}