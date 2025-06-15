"use client";

import React, { useState } from "react";
import { MessageSquare, Plus, Search, Tag, Calendar, User, Edit, Trash2 } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isPinned: boolean;
  category: "general" | "maintenance" | "safety" | "compliance" | "other";
}

interface NotesTabProps {
  buildingId: string;
}

export default function NotesTab({ buildingId }: NotesTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [notes] = useState<Note[]>([
    {
      id: "1",
      title: "Fire Alarm Testing Schedule",
      content: "Fire alarm testing scheduled for the first Monday of every month at 10 AM. All tenants have been notified. Testing duration approximately 30 minutes.",
      author: "John Smith",
      createdAt: "2024-03-15T10:00:00",
      updatedAt: "2024-03-15T10:00:00",
      tags: ["fire-safety", "testing", "monthly"],
      isPinned: true,
      category: "safety"
    },
    {
      id: "2",
      title: "Roof Repair Completed",
      content: "Roof repair work completed on the east wing. Contractor confirmed all leaks have been fixed. 5-year warranty provided. Invoice #INV-2024-156 filed.",
      author: "Sarah Johnson",
      createdAt: "2024-03-10T14:30:00",
      updatedAt: "2024-03-10T14:30:00",
      tags: ["maintenance", "roof", "completed"],
      isPinned: false,
      category: "maintenance"
    },
    {
      id: "3",
      title: "Annual Compliance Review",
      content: "Annual compliance review scheduled for April 15th. All documentation must be prepared by April 1st. Key areas: fire safety, water safety, asbestos management.",
      author: "Emma Davis",
      createdAt: "2024-03-08T09:00:00",
      updatedAt: "2024-03-08T09:00:00",
      tags: ["compliance", "annual-review", "important"],
      isPinned: true,
      category: "compliance"
    },
    {
      id: "4",
      title: "Tenant Feedback - Lighting",
      content: "Multiple tenants reported flickering lights in the main corridor. Electrician scheduled for inspection on March 20th.",
      author: "Mike Wilson",
      createdAt: "2024-03-05T16:45:00",
      updatedAt: "2024-03-05T16:45:00",
      tags: ["tenant-feedback", "electrical", "pending"],
      isPinned: false,
      category: "maintenance"
    }
  ]);

  const categories = ["all", "general", "maintenance", "safety", "compliance", "other"];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || note.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "general": return "bg-gray-100 text-gray-800";
      case "maintenance": return "bg-blue-100 text-blue-800";
      case "safety": return "bg-red-100 text-red-800";
      case "compliance": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
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

          <button className="px-4 py-2 bg-[#F30] text-white rounded-md hover:bg-[#E62E00] transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Note
          </button>
        </div>
      </div>

      {/* Notes list */}
      <div className="space-y-4">
        {filteredNotes.map((note) => (
          <div key={note.id} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {note.isPinned && (
                    <span className="text-[#F30]">📌</span>
                  )}
                  <h3 className="text-lg font-medium text-gray-900">{note.title}</h3>
                </div>
                <p className="text-gray-600 mb-3">{note.content}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {note.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Metadata */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {note.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(note.createdAt)}
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeClass(note.category)}`}>
                    {note.category.charAt(0).toUpperCase() + note.category.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button className="text-gray-400 hover:text-[#F30]">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-gray-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="bg-white shadow rounded-lg p-12">
          <div className="text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">No notes found</p>
          </div>
        </div>
      )}
    </div>
  );
}