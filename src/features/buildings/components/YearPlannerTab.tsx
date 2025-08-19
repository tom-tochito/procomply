"use client";

import React, { useState, useActionState } from "react";
import { Calendar, Plus, X, Clock, CheckCircle, XCircle, FileText } from "lucide-react";
// import { useQuery, useMutation } from "convex/react";
// import { api } from "~/convex/_generated/api";
import { BuildingWithRelations } from "@/features/buildings/models";
import { YearPlannerEvent } from "@/features/year-planner/models";
// import {
//   createYearPlannerEvent,
//   updateYearPlannerEvent,
//   deleteYearPlannerEvent,
// } from "@/features/year-planner/repository/year-planner.repository";
import type { FormState } from "@/common/types/form";

interface YearPlannerTabProps {
  building: BuildingWithRelations;
}

export default function YearPlannerTab({ }: YearPlannerTabProps) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<YearPlannerEvent | null>(null);
  const [viewMode, setViewMode] = useState<"planner" | "list">("planner");
  
  // TODO: Migrate to Convex - yearPlannerEvents functions not yet created
  const events: YearPlannerEvent[] = [];
  const isLoading = false;
  // Form actions
  const [addFormState, addFormAction, isAddPending] = useActionState(
    async (): Promise<FormState> => {
      // TODO: Implement with Convex mutations
      return { error: "Not implemented" as string | null, success: false };
    },
    { error: null, success: false }
  );

  const [editFormState, editFormAction, isEditPending] = useActionState(
    async (): Promise<FormState> => {
      if (!editingEvent) return { error: "No event selected" as string | null, success: false };
      // TODO: Implement with Convex mutations
      return { error: "Not implemented" as string | null, success: false };
    },
    { error: null, success: false }
  );

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    // TODO: Implement with Convex mutations
    console.error("Delete event not implemented", eventId);
  };

  const eventTypes = ["inspection", "maintenance", "compliance", "meeting", "training", "other"];
  const eventStatuses = ["scheduled", "completed", "cancelled"];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "inspection": return "bg-blue-100 text-blue-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";
      case "compliance": return "bg-green-100 text-green-800";
      case "meeting": return "bg-purple-100 text-purple-800";
      case "training": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "cancelled": return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    event.eventType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string | number) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  return (
    <div className="space-y-4">
      {/* Search and controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="search tasks"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-md pl-3 pr-10 py-2 w-full"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setViewMode(viewMode === "planner" ? "list" : "planner")}
            className="px-4 py-2 border rounded-md bg-white hover:bg-gray-50"
          >
            {viewMode === "planner" ? "List View" : "Planner View"}
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#F30] text-white rounded-md hover:bg-[#E62E00] transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Event
          </button>
          <div className="relative">
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border rounded-md bg-white hover:bg-gray-50 appearance-none pr-10"
            >
              {[2024, 2025, 2026].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-600 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="bg-white shadow rounded-lg p-12">
          <div className="text-center">
            <p className="text-gray-500">Loading events...</p>
          </div>
        </div>
      )}

      {/* List View */}
      {!isLoading && viewMode === "list" && (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{event.title}</div>
                        {event.description && (
                          <div className="text-sm text-gray-500">{event.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(event.eventType)}`}>
                        {event.eventType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <div>{formatDate(event.startDate)}</div>
                        {event.endDate && (
                          <div className="text-gray-500">to {formatDate(event.endDate)}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(event.status)}
                        <span className="text-sm">{event.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingEvent(event)}
                          className="text-gray-600 hover:text-[#F30]"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="text-gray-600 hover:text-red-600"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="py-3 px-4 border-t text-center sm:text-right text-sm text-gray-700">
            <strong>TOTAL EVENTS: {filteredEvents.length}</strong>
          </div>
        </div>
      )}

      {/* Planner View - Simplified Calendar */}
      {!isLoading && viewMode === "planner" && (
        <div className="bg-white rounded-lg border p-4">
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium text-sm text-gray-700 py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="text-center py-4 text-gray-500">
            Calendar view coming soon. Use List View to manage events.
          </div>
        </div>
      )}

      {!isLoading && filteredEvents.length === 0 && (
        <div className="bg-white shadow rounded-lg p-12">
          <div className="text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">No events found</p>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Event</h2>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    disabled={isAddPending}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type *</label>
                  <select
                    name="eventType"
                    required
                    disabled={isAddPending}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                  >
                    <option value="">Select Type</option>
                    {eventTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                    <input
                      name="startDate"
                      type="date"
                      required
                      disabled={isAddPending}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      name="endDate"
                      type="date"
                      disabled={isAddPending}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    name="allDay"
                    type="checkbox"
                    value="true"
                    disabled={isAddPending}
                    className="h-4 w-4 text-[#F30] focus:ring-[#F30] border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">All Day Event</label>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    name="reminder"
                    type="checkbox"
                    value="true"
                    disabled={isAddPending}
                    className="h-4 w-4 text-[#F30] focus:ring-[#F30] border-gray-300 rounded"
                  />
                  <label className="text-sm text-gray-700">Send Reminder</label>
                  <input
                    name="reminderDays"
                    type="number"
                    min="1"
                    max="30"
                    placeholder="Days before"
                    disabled={isAddPending}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                  />
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
                  {isAddPending ? "Adding..." : "Add Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Event</h2>
              <button
                onClick={() => setEditingEvent(null)}
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
                    defaultValue={editingEvent.title}
                    required
                    disabled={isEditPending}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={editingEvent.description || ""}
                    disabled={isEditPending}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type *</label>
                  <select
                    name="eventType"
                    defaultValue={editingEvent.eventType}
                    required
                    disabled={isEditPending}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                  >
                    {eventTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                    <input
                      name="startDate"
                      type="date"
                      defaultValue={new Date(editingEvent.startDate).toISOString().split('T')[0]}
                      required
                      disabled={isEditPending}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      name="endDate"
                      type="date"
                      defaultValue={editingEvent.endDate ? new Date(editingEvent.endDate).toISOString().split('T')[0] : ""}
                      disabled={isEditPending}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue={editingEvent.status}
                    disabled={isEditPending}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                  >
                    {eventStatuses.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    name="allDay"
                    type="checkbox"
                    value="true"
                    defaultChecked={editingEvent.allDay}
                    disabled={isEditPending}
                    className="h-4 w-4 text-[#F30] focus:ring-[#F30] border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">All Day Event</label>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    name="reminder"
                    type="checkbox"
                    value="true"
                    defaultChecked={editingEvent.reminder}
                    disabled={isEditPending}
                    className="h-4 w-4 text-[#F30] focus:ring-[#F30] border-gray-300 rounded"
                  />
                  <label className="text-sm text-gray-700">Send Reminder</label>
                  <input
                    name="reminderDays"
                    type="number"
                    min="1"
                    max="30"
                    defaultValue={editingEvent.reminderDays || ""}
                    placeholder="Days before"
                    disabled={isEditPending}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30]"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
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