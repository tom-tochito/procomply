"use client";

import React from "react";

interface TaskStatusFiltersProps {
  filters: {
    inProgress: boolean;
    inbox: boolean;
    future: boolean;
    completed: boolean;
    onHold: boolean;
  };
  onChange: (filter: keyof TaskStatusFiltersProps['filters'], value: boolean) => void;
  counts?: {
    inProgress?: number;
    inbox?: number;
    future?: number;
    completed?: number;
    onHold?: number;
  };
}

export default function TaskStatusFilters({ filters, onChange, counts = {} }: TaskStatusFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <button
        onClick={() => onChange('inProgress', !filters.inProgress)}
        className={`px-4 py-2 rounded-lg border transition-all cursor-pointer ${
          filters.inProgress 
            ? 'bg-blue-50 border-blue-300 text-blue-700' 
            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
        }`}
      >
        <span className="font-medium">In Progress</span>
        {counts.inProgress !== undefined && (
          <span className="ml-2 text-sm">({counts.inProgress})</span>
        )}
      </button>
      
      <button
        onClick={() => onChange('inbox', !filters.inbox)}
        className={`px-4 py-2 rounded-lg border transition-all cursor-pointer ${
          filters.inbox 
            ? 'bg-orange-50 border-orange-300 text-orange-700' 
            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
        }`}
      >
        <span className="font-medium">Inbox</span>
        {counts.inbox !== undefined && (
          <span className="ml-2 text-sm">({counts.inbox})</span>
        )}
      </button>
      
      <button
        onClick={() => onChange('future', !filters.future)}
        className={`px-4 py-2 rounded-lg border transition-all cursor-pointer ${
          filters.future 
            ? 'bg-purple-50 border-purple-300 text-purple-700' 
            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
        }`}
      >
        <span className="font-medium">Future</span>
        {counts.future !== undefined && (
          <span className="ml-2 text-sm">({counts.future})</span>
        )}
      </button>
      
      <button
        onClick={() => onChange('completed', !filters.completed)}
        className={`px-4 py-2 rounded-lg border transition-all cursor-pointer ${
          filters.completed 
            ? 'bg-green-50 border-green-300 text-green-700' 
            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
        }`}
      >
        <span className="font-medium">Completed</span>
        {counts.completed !== undefined && (
          <span className="ml-2 text-sm">({counts.completed})</span>
        )}
      </button>
      
      <button
        onClick={() => onChange('onHold', !filters.onHold)}
        className={`px-4 py-2 rounded-lg border transition-all cursor-pointer ${
          filters.onHold 
            ? 'bg-gray-100 border-gray-400 text-gray-700' 
            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
        }`}
      >
        <span className="font-medium">On Hold</span>
        {counts.onHold !== undefined && (
          <span className="ml-2 text-sm">({counts.onHold})</span>
        )}
      </button>
    </div>
  );
}