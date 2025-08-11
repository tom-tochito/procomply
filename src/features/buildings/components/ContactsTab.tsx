"use client";

import React, { useState } from "react";
import { Plus, Search, User, X, Trash2 } from "lucide-react";
import ContactCard from "@/features/contacts/components/ContactCard";
import { BuildingWithRelations } from "@/features/buildings/models";
import { Contact } from "@/features/contacts/models";

interface ContactsTabProps {
  building: BuildingWithRelations;
}

export default function ContactsTab({ building }: ContactsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // TODO: Migrate to Convex - for now using placeholder data
  const contacts: Contact[] = [];
  const isLoading = false;

  const departments = Array.from(
    new Set(contacts.map((c) => c.department || "Other"))
  );

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      searchTerm === "" ||
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.role?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      departmentFilter === "all" ||
      (contact.department || "Other") === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement with Convex
    console.log("Form submit not implemented");
  };

  const handleDelete = async (contactId: string) => {
    // TODO: Implement with Convex
    console.log("Delete not implemented");
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingContact(null);
    setError(null);
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Contacts</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#7600FF] text-white rounded-lg hover:bg-[#6000CC] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Contact
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7600FF] focus:border-transparent"
            />
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7600FF] focus:border-transparent"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-48">
          <div className="text-gray-500">Loading contacts...</div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredContacts.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <User className="h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-500">
            {searchTerm || departmentFilter !== "all"
              ? "No contacts found matching your filters"
              : "No contacts added yet"}
          </p>
          {!searchTerm && departmentFilter === "all" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 text-[#7600FF] hover:text-[#6000CC] font-medium"
            >
              Add your first contact
            </button>
          )}
        </div>
      )}

      {/* Contacts Grid */}
      {!isLoading && filteredContacts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <ContactCard
              key={contact._id}
              contact={{
                id: contact._id,
                name: contact.name || '',
                role: contact.role,
                company: contact.department,  // Map department to company
                email: contact.email,
                phone: contact.phone,
                mobile: contact.mobile,
                isPrimary: contact.isPrimary
              }}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingContact ? "Edit Contact" : "Add New Contact"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingContact?.name}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7600FF] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    defaultValue={editingContact?.role}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7600FF] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingContact?.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7600FF] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={editingContact?.phone}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7600FF] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    defaultValue={editingContact?.mobile}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7600FF] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    defaultValue={editingContact?.department}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7600FF] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    defaultValue={editingContact?.notes}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7600FF] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isPrimary"
                      defaultChecked={editingContact?.isPrimary ?? false}
                      className="rounded border-gray-300 text-[#7600FF] focus:ring-[#7600FF]"
                    />
                    <span className="text-sm text-gray-700">
                      Primary Contact
                    </span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[#7600FF] text-white py-2 px-4 rounded-lg hover:bg-[#6000CC] disabled:opacity-50"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : editingContact
                      ? "Update Contact"
                      : "Add Contact"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}