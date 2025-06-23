"use client";

import React, { useState, useActionState } from "react";
import { MessageSquare, Plus, Search, Calendar, User, Edit, Trash2, X, AlertCircle } from "lucide-react";
import { db } from "~/lib/db";
import { BuildingWithRelations } from "@/features/buildings/models";
import { Note } from "@/features/notes/models";
import {
  createNote,
  updateNote,
  deleteNote,
} from "@/features/notes/repository/notes.repository";
import type { FormState } from "@/common/types/form";

interface NotesTabProps {
  building: BuildingWithRelations;
}

export default function NotesTab({ building }: NotesTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  // Real-time subscription to notes
  const { data, isLoading } = db.useQuery({
    notes: {
      $: {
        where: { "building.id": building.id },
        order: { createdAt: "desc" },
      },
      building: {},
      tenant: {},
      creator: {},
    },
  });

  const notes = data?.notes || [];
  const categories = ["all", "general", "maintenance", "compliance", "other"];
  const priorities = ["all", "low", "medium", "high"];

  // Form actions
  const [addFormState, addFormAction, isAddPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      try {
        if (!building.tenant) {
          return { error: "Building has no tenant", success: false };
        }
        await createNote(building, building.tenant, {
          title: formData.get("title") as string,
          content: formData.get("content") as string,
          category: formData.get("category") as string || "general",
          priority: formData.get("priority") as string || "medium",
        });
        setShowAddModal(false);
        return { error: null, success: true };
      } catch (err) {
        return { error: err instanceof Error ? err.message : "Failed to add note", success: false };
      }
    },
    { error: null, success: false }
  );

  const [editFormState, editFormAction, isEditPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      if (!editingNote) return { error: "No note selected", success: false };
      try {
        await updateNote(editingNote.id, {
          title: formData.get("title") as string,
          content: formData.get("content") as string,
          category: formData.get("category") as string,
          priority: formData.get("priority") as string,
        });
        setEditingNote(null);
        return { error: null, success: true };
      } catch (err) {
        return { error: err instanceof Error ? err.message : "Failed to update note", success: false };
      }
    },
    { error: null, success: false }
  );

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    try {
      await deleteNote(noteId);
    } catch {
      console.error("Failed to delete note");
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || note.category === categoryFilter;
    const matchesPriority = priorityFilter === "all" || note.priority === priorityFilter;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "general": return "bg-gray-100 text-gray-800";
      case "maintenance": return "bg-blue-100 text-blue-800";
      case "compliance": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string | number) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div>
      {/* Search and filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search notes..."
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

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30] focus:border-[#F30]"
          >
            {priorities.map(priority => (
              <option key={priority} value={priority}>
                {priority === "all" ? "All Priorities" : priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </select>

          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#F30] text-white rounded-md hover:bg-[#E62E00] transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Note
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="bg-white shadow rounded-lg p-12">
          <div className="text-center">
            <p className="text-gray-500">Loading notes...</p>
          </div>
        </div>
      )}

      {/* Notes list */}
      {!isLoading && (
        <div className="space-y-4">
          {filteredNotes.map((note) => (
            <div key={note.id} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{note.title}</h3>
                  <p className="text-gray-600 mb-3 whitespace-pre-wrap">{note.content}</p>
                  
                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {note.creator?.email || "Unknown"}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(note.createdAt)}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeClass(note.category)}`}>
                      {note.category.charAt(0).toUpperCase() + note.category.slice(1)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(note.priority)}`}>
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {note.priority.charAt(0).toUpperCase() + note.priority.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button 
                    onClick={() => setEditingNote(note)}
                    className="text-gray-400 hover:text-[#F30]"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredNotes.length === 0 && (
        <div className="bg-white shadow rounded-lg p-12">
          <div className="text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">No notes found</p>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Note</h2>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    name="title"
                    required
                    disabled={isAddPending}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                  <textarea
                    name="content"
                    rows={6}
                    required
                    disabled={isAddPending}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      name="category"
                      disabled={isAddPending}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                    >
                      {categories.slice(1).map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      name="priority"
                      defaultValue="medium"
                      disabled={isAddPending}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                    >
                      {priorities.slice(1).map(priority => (
                        <option key={priority} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
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
                  {isAddPending ? "Adding..." : "Add Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Note Modal */}
      {editingNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Note</h2>
              <button
                onClick={() => setEditingNote(null)}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    name="title"
                    defaultValue={editingNote.title}
                    required
                    disabled={isEditPending}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                  <textarea
                    name="content"
                    rows={6}
                    defaultValue={editingNote.content}
                    required
                    disabled={isEditPending}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      name="category"
                      defaultValue={editingNote.category}
                      disabled={isEditPending}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                    >
                      {categories.slice(1).map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      name="priority"
                      defaultValue={editingNote.priority}
                      disabled={isEditPending}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                    >
                      {priorities.slice(1).map(priority => (
                        <option key={priority} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingNote(null)}
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