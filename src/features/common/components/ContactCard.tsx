"use client";

import React from "react";
import { Phone, Mail, MapPin, User, Building } from "lucide-react";

export interface Contact {
  id: string | number;
  name: string;
  role?: string;
  company?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  isPrimary?: boolean;
  category?: "internal" | "contractor" | "emergency" | "supplier" | "other";
}

interface ContactCardProps {
  contact: Contact;
  showCategory?: boolean;
  showPrimaryBadge?: boolean;
}

export default function ContactCard({ 
  contact, 
  showCategory = true,
  showPrimaryBadge = true 
}: ContactCardProps) {
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
    <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-gray-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">{contact.name}</h3>
            {contact.role && (
              <p className="text-sm text-gray-500">{contact.role}</p>
            )}
          </div>
        </div>
        {showPrimaryBadge && contact.isPrimary && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F30] text-white">
            Primary
          </span>
        )}
      </div>

      <div className="space-y-3">
        {contact.company && (
          <div className="flex items-center text-sm">
            <Building className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-600">{contact.company}</span>
          </div>
        )}
        
        {contact.email && (
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 text-gray-400 mr-2" />
            <a href={`mailto:${contact.email}`} className="text-[#F30] hover:text-[#E62E00] break-all">
              {contact.email}
            </a>
          </div>
        )}
        
        {contact.phone && (
          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 text-gray-400 mr-2" />
            <a href={`tel:${contact.phone}`} className="text-gray-600 hover:text-gray-900">
              {contact.phone}
            </a>
          </div>
        )}
        
        {contact.mobile && (
          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 text-gray-400 mr-2" />
            <a href={`tel:${contact.mobile}`} className="text-gray-600 hover:text-gray-900">
              {contact.mobile} (Mobile)
            </a>
          </div>
        )}
        
        {contact.address && (
          <div className="flex items-start text-sm">
            <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
            <span className="text-gray-600">{contact.address}</span>
          </div>
        )}
      </div>

      {showCategory && contact.category && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeClass(contact.category)}`}>
            {contact.category.charAt(0).toUpperCase() + contact.category.slice(1)}
          </span>
        </div>
      )}
    </div>
  );
}