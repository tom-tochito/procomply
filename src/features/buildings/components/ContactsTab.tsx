"use client";

import React, { useState, useActionState } from "react";
import { Plus, Search, User, X, Trash2 } from "lucide-react";
import ContactCard from "@/features/common/components/ContactCard";
import { db } from "~/lib/db";
import { BuildingWithRelations } from "@/features/buildings/models";
import { Contact } from "@/features/contacts/models";
import {
  createContact,
  updateContact,
  deleteContact,
} from "@/features/contacts/repository/contacts.repository";
import type { FormState } from "@/common/types/form";

interface ContactsTabProps {
  building: BuildingWithRelations;
}

export default function ContactsTab({ building }: ContactsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  
  // Real-time subscription to contacts
  const { data, isLoading } = db.useQuery({
    contacts: {
      $: {
        where: { "building.id": building.id },
        order: { isPrimary: "desc", createdAt: "desc" },
      },
      building: {},
      tenant: {},
      creator: {},
    },
  });

  const contacts = data?.contacts || [];
  const departments = ["all", "Management", "Maintenance", "Security", "Compliance", "Emergency", "Other"];

  // Form actions
  const [addFormState, addFormAction, isAddPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      try {
        if (!building.tenant) {
          return { error: "Building has no tenant", success: false };
        }
        await createContact(building, building.tenant, {
          name: formData.get("name") as string,
          role: formData.get("role") as string || undefined,
          email: formData.get("email") as string || undefined,
          phone: formData.get("phone") as string || undefined,
          mobile: formData.get("mobile") as string || undefined,
          department: formData.get("department") as string || undefined,
          notes: formData.get("notes") as string || undefined,
          isPrimary: formData.get("isPrimary") === "true",
        });
        setShowAddModal(false);
        return { error: null, success: true };
      } catch (err) {
        return { error: err instanceof Error ? err.message : "Failed to add contact", success: false };
      }
    },
    { error: null, success: false }
  );

  const [editFormState, editFormAction, isEditPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      if (!editingContact) return { error: "No contact selected", success: false };
      try {
        await updateContact(editingContact.id, {
          name: formData.get("name") as string,
          role: formData.get("role") as string || undefined,
          email: formData.get("email") as string || undefined,
          phone: formData.get("phone") as string || undefined,
          mobile: formData.get("mobile") as string || undefined,
          department: formData.get("department") as string || undefined,
          notes: formData.get("notes") as string || undefined,
          isPrimary: formData.get("isPrimary") === "true",
        });
        setEditingContact(null);
        return { error: null, success: true };
      } catch (err) {
        return { error: err instanceof Error ? err.message : "Failed to update contact", success: false };
      }
    },
    { error: null, success: false }
  );

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;
    try {
      await deleteContact(contactId);
    } catch {
      console.error("Failed to delete contact");
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.role && contact.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment = departmentFilter === "all" || contact.department === departmentFilter;
    return matchesSearch && matchesDepartment;
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
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30] focus:border-[#F30]"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {dept === "all" ? "All Departments" : dept}
              </option>
            ))}
          </select>

          <button 
            onClick={() => setShowAddModal(true)}
            className="px-3 sm:px-4 py-2 bg-[#F30] text-white rounded-md hover:bg-[#E62E00] transition-colors flex items-center gap-2 text-sm sm:text-base"
          >
            <Plus className="h-4 w-4" />
            Add Contact
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="bg-white shadow rounded-lg p-12">
          <div className="text-center">
            <p className="text-gray-500">Loading contacts...</p>
          </div>
        </div>
      )}

      {/* Contacts grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredContacts.map((contact) => (
            <div key={contact.id} className="relative group">
              <ContactCard 
                contact={{
                  ...contact,
                  company: contact.department,
                  category: contact.department?.toLowerCase() === "emergency" ? "emergency" : 
                          contact.department?.toLowerCase() === "maintenance" ? "contractor" : "internal"
                }} 
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setEditingContact(contact)}
                  className="p-1 bg-white rounded shadow-md hover:bg-gray-100 mr-1"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteContact(contact.id)}
                  className="p-1 bg-white rounded shadow-md hover:bg-gray-100"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredContacts.length === 0 && (
        <div className="bg-white shadow rounded-lg p-12">
          <div className="text-center">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">No contacts found</p>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Contact</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form action={addFormAction}>
              {addFormState.error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{addFormState.error}</div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    name="name"
                    required
                    disabled={isAddPending}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    name="role"
                    disabled={isAddPending}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    name="department"
                    disabled={isAddPending}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                  >
                    <option value="">Select Department</option>
                    {departments.slice(1).map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    disabled={isAddPending}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    name="phone"
                    type="tel"
                    disabled={isAddPending}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                  <input
                    name="mobile"
                    type="tel"
                    disabled={isAddPending}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    rows={3}
                    disabled={isAddPending}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    name="isPrimary"
                    type="checkbox"
                    value="true"
                    disabled={isAddPending}
                    className="h-4 w-4 text-[#F30] focus:ring-[#F30] border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Primary Contact</label>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={isAddPending}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddPending}
                  className="px-4 py-2 bg-[#F30] text-white rounded-md hover:bg-[#E62E00] disabled:opacity-50"
                >
                  {isAddPending ? "Adding..." : "Add Contact"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Contact Modal */}
      {editingContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Contact</h2>
              <button
                onClick={() => setEditingContact(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form action={editFormAction}>
              {editFormState.error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{editFormState.error}</div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    name="name"
                    defaultValue={editingContact.name}
                    required
                    disabled={isEditPending}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    name="role"
                    defaultValue={editingContact.role || ""}
                    disabled={isEditPending}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    name="department"
                    defaultValue={editingContact.department || ""}
                    disabled={isEditPending}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                  >
                    <option value="">Select Department</option>
                    {departments.slice(1).map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={editingContact.email || ""}
                    disabled={isEditPending}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    name="phone"
                    type="tel"
                    defaultValue={editingContact.phone || ""}
                    disabled={isEditPending}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                  <input
                    name="mobile"
                    type="tel"
                    defaultValue={editingContact.mobile || ""}
                    disabled={isEditPending}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    rows={3}
                    defaultValue={editingContact.notes || ""}
                    disabled={isEditPending}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    name="isPrimary"
                    type="checkbox"
                    value="true"
                    defaultChecked={editingContact.isPrimary}
                    disabled={isEditPending}
                    className="h-4 w-4 text-[#F30] focus:ring-[#F30] border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Primary Contact</label>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingContact(null)}
                  disabled={isEditPending}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditPending}
                  className="px-4 py-2 bg-[#F30] text-white rounded-md hover:bg-[#E62E00] disabled:opacity-50"
                >
                  {isEditPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}