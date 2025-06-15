"use client";

import React, { useState } from "react";
import { Plus, Search, User } from "lucide-react";
import ContactCard, { Contact } from "@/features/common/components/ContactCard";

interface ContactsTabProps {
  buildingId: string;
}

export default function ContactsTab({ }: ContactsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [contacts] = useState<Contact[]>([
    {
      id: "1",
      name: "John Smith",
      role: "Building Manager",
      company: "ProComply Ltd",
      email: "john.smith@procomply.com",
      phone: "+44 20 1234 5678",
      mobile: "+44 7700 900123",
      address: "123 Main St, London, UK",
      isPrimary: true,
      category: "internal"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      role: "Fire Safety Officer",
      company: "Fire Safety Solutions",
      email: "sarah@firesafety.com",
      phone: "+44 20 2345 6789",
      mobile: "+44 7700 900456",
      isPrimary: false,
      category: "contractor"
    },
    {
      id: "3",
      name: "Emergency Services",
      role: "24/7 Emergency Contact",
      company: "Emergency Response Team",
      email: "emergency@response.com",
      phone: "+44 20 999 9999",
      isPrimary: false,
      category: "emergency"
    },
    {
      id: "4",
      name: "Mike Wilson",
      role: "Electrical Contractor",
      company: "Wilson Electrical Ltd",
      email: "mike@wilsonelectrical.com",
      phone: "+44 20 3456 7890",
      mobile: "+44 7700 900789",
      address: "456 Electric Ave, London, UK",
      isPrimary: false,
      category: "contractor"
    },
    {
      id: "5",
      name: "Emma Davis",
      role: "Compliance Officer",
      company: "ProComply Ltd",
      email: "emma.davis@procomply.com",
      phone: "+44 20 4567 8901",
      isPrimary: false,
      category: "internal"
    }
  ]);

  const categories = ["all", "internal", "contractor", "emergency", "supplier", "other"];

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.role && contact.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || contact.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });


  return (
    <div>
      {/* Search and filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-0 sm:min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30] focus:border-[#F30]"
              />
            </div>
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

          <button className="px-3 sm:px-4 py-2 bg-[#F30] text-white rounded-md hover:bg-[#E62E00] transition-colors flex items-center gap-2 text-sm sm:text-base">
            <Plus className="h-4 w-4" />
            Add Contact
          </button>
        </div>
      </div>

      {/* Contacts grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredContacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="bg-white shadow rounded-lg p-12">
          <div className="text-center">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">No contacts found</p>
          </div>
        </div>
      )}
    </div>
  );
}