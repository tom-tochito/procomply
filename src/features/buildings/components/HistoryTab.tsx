"use client";

import React, { useState } from "react";
import { Clock, User, FileText, CheckCircle, AlertTriangle, Info, Filter } from "lucide-react";

interface HistoryEvent {
  id: string;
  type: "task" | "document" | "inspection" | "maintenance" | "compliance" | "system";
  action: string;
  description: string;
  user: string;
  timestamp: string;
  details?: any;
  severity: "info" | "success" | "warning" | "error";
}

interface HistoryTabProps {
  buildingId: string;
}

export default function HistoryTab({ buildingId }: HistoryTabProps) {
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState("week");
  const [history] = useState<HistoryEvent[]>([
    {
      id: "1",
      type: "compliance",
      action: "Certificate Updated",
      description: "Fire Safety Certificate renewed for 2024",
      user: "John Smith",
      timestamp: "2024-03-15T10:30:00",
      severity: "success",
      details: { certificateId: "FS-2024-001", validUntil: "2025-03-15" }
    },
    {
      id: "2",
      type: "task",
      action: "Task Completed",
      description: "Monthly fire alarm test completed successfully",
      user: "Sarah Johnson",
      timestamp: "2024-03-14T14:00:00",
      severity: "success",
      details: { taskId: "TSK-456", duration: "30 minutes" }
    },
    {
      id: "3",
      type: "inspection",
      action: "Inspection Failed",
      description: "Emergency lighting inspection identified 3 faulty units",
      user: "Mike Wilson",
      timestamp: "2024-03-13T11:15:00",
      severity: "warning",
      details: { units: ["Floor 2 - North", "Floor 3 - East", "Basement"] }
    },
    {
      id: "4",
      type: "document",
      action: "Document Uploaded",
      description: "Asbestos survey report uploaded",
      user: "Emma Davis",
      timestamp: "2024-03-12T09:45:00",
      severity: "info",
      details: { fileName: "Asbestos_Survey_2024.pdf", size: "2.4MB" }
    },
    {
      id: "5",
      type: "maintenance",
      action: "Work Order Created",
      description: "Roof repair work order created for east wing leak",
      user: "Tom Brown",
      timestamp: "2024-03-10T16:30:00",
      severity: "warning",
      details: { workOrderId: "WO-789", priority: "High" }
    },
    {
      id: "6",
      type: "system",
      action: "Access Granted",
      description: "New user added to building management team",
      user: "System",
      timestamp: "2024-03-08T13:00:00",
      severity: "info",
      details: { newUser: "Lisa Chen", role: "Compliance Officer" }
    },
    {
      id: "7",
      type: "task",
      action: "Task Overdue",
      description: "Water temperature monitoring task is overdue",
      user: "System",
      timestamp: "2024-03-07T00:00:00",
      severity: "error",
      details: { taskId: "TSK-123", dueDate: "2024-03-06" }
    }
  ]);

  const eventTypes = ["all", "task", "document", "inspection", "maintenance", "compliance", "system"];
  const dateRanges = [
    { value: "today", label: "Today" },
    { value: "week", label: "Last 7 days" },
    { value: "month", label: "Last 30 days" },
    { value: "quarter", label: "Last 3 months" },
    { value: "year", label: "Last year" }
  ];

  const filterByDate = (event: HistoryEvent) => {
    const eventDate = new Date(event.timestamp);
    const now = new Date();
    const diffInDays = (now.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24);

    switch (dateRange) {
      case "today": return diffInDays < 1;
      case "week": return diffInDays < 7;
      case "month": return diffInDays < 30;
      case "quarter": return diffInDays < 90;
      case "year": return diffInDays < 365;
      default: return true;
    }
  };

  const filteredHistory = history.filter(event => {
    const matchesType = filterType === "all" || event.type === filterType;
    const matchesDate = filterByDate(event);
    return matchesType && matchesDate;
  });

  const getEventIcon = (type: string, severity: string) => {
    switch (severity) {
      case "success": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "error": return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "task": return "bg-blue-100 text-blue-800";
      case "document": return "bg-purple-100 text-purple-800";
      case "inspection": return "bg-yellow-100 text-yellow-800";
      case "maintenance": return "bg-orange-100 text-orange-800";
      case "compliance": return "bg-green-100 text-green-800";
      case "system": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30] focus:border-[#F30]"
          >
            {eventTypes.map(type => (
              <option key={type} value={type}>
                {type === "all" ? "All Events" : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30] focus:border-[#F30]"
          >
            {dateRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          <div className="flex-1 flex items-center justify-end text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            Showing {filteredHistory.length} events
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="space-y-8">
            {filteredHistory.map((event, index) => (
              <div key={event.id} className="relative">
                {index !== filteredHistory.length - 1 && (
                  <span className="absolute left-5 top-10 -bottom-8 w-0.5 bg-gray-200" />
                )}
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
                    {getEventIcon(event.type, event.severity)}
                  </div>
                  
                  <div className="flex-1 pb-8">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{event.action}</h4>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                          {event.type}
                        </span>
                      </div>
                      
                      {event.details && (
                        <div className="mt-3 text-sm text-gray-500 bg-white rounded p-3">
                          {Object.entries(event.details).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                              <span className="font-medium">
                                {Array.isArray(value) ? value.join(', ') : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {event.user}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTimestamp(event.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {filteredHistory.length === 0 && (
        <div className="bg-white shadow rounded-lg p-12">
          <div className="text-center">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">No history events found</p>
          </div>
        </div>
      )}
    </div>
  );
}