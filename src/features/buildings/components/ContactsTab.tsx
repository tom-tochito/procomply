"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, User, Building, Plus, Search } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  mobile?: string;
  address?: string;
  isPrimary: boolean;
  category: "internal" | "contractor" | "emergency" | "supplier" | "other";
}

interface ContactsTabProps {
  buildingId: string;
}

export default function ContactsTab({ buildingId }: ContactsTabProps) {
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
      contact.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || contact.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "internal": return "bg-blue-100 text-blue-800";
      case "contractor": return "bg-green-100 text-green-800";
      case "emergency": return "bg-red-100 text-red-800";
      case "supplier": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
          <div key={contact.id} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">{contact.name}</h3>
                  <p className="text-sm text-gray-500">{contact.role}</p>
                </div>
              </div>
              {contact.isPrimary && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F30] text-white">
                  Primary
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Building className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-600">{contact.company}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                <a href={`mailto:${contact.email}`} className="text-[#F30] hover:text-[#E62E00]">
                  {contact.email}
                </a>
              </div>
              
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-600">{contact.phone}</span>
              </div>
              
              {contact.mobile && (
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">{contact.mobile} (Mobile)</span>
                </div>
              )}
              
              {contact.address && (
                <div className="flex items-start text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                  <span className="text-gray-600">{contact.address}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeClass(contact.category)}`}>
                {contact.category.charAt(0).toUpperCase() + contact.category.slice(1)}
              </span>
            </div>
          </div>
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