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
    <div className="flex flex-wrap gap-4 mb-4">
      <label className="flex items-center cursor-pointer select-none">
        <input
          type="checkbox"
          checked={filters.inProgress}
          onChange={(e) => onChange('inProgress', e.target.checked)}
          className="w-4 h-4 text-[#F30] bg-white border-gray-300 rounded focus:ring-2 focus:ring-[#F30] focus:ring-offset-0 checked:bg-[#F30] checked:border-[#F30] checked:hover:bg-[#E62E00] checked:hover:border-[#E62E00] checked:focus:bg-[#F30] checked:focus:border-[#F30]"
        />
        <span className="ml-2 text-sm text-gray-700">
          In Progress
          {counts.inProgress !== undefined && (
            <span className="ml-1 text-xs text-gray-500">({counts.inProgress})</span>
          )}
        </span>
      </label>
      
      <label className="flex items-center cursor-pointer select-none">
        <input
          type="checkbox"
          checked={filters.inbox}
          onChange={(e) => onChange('inbox', e.target.checked)}
          className="w-4 h-4 text-[#F30] bg-white border-gray-300 rounded focus:ring-2 focus:ring-[#F30] focus:ring-offset-0 checked:bg-[#F30] checked:border-[#F30] checked:hover:bg-[#E62E00] checked:hover:border-[#E62E00] checked:focus:bg-[#F30] checked:focus:border-[#F30]"
        />
        <span className="ml-2 text-sm text-gray-700">
          Inbox
          {counts.inbox !== undefined && (
            <span className="ml-1 text-xs text-gray-500">({counts.inbox})</span>
          )}
        </span>
      </label>
      
      <label className="flex items-center cursor-pointer select-none">
        <input
          type="checkbox"
          checked={filters.future}
          onChange={(e) => onChange('future', e.target.checked)}
          className="w-4 h-4 text-[#F30] bg-white border-gray-300 rounded focus:ring-2 focus:ring-[#F30] focus:ring-offset-0 checked:bg-[#F30] checked:border-[#F30] checked:hover:bg-[#E62E00] checked:hover:border-[#E62E00] checked:focus:bg-[#F30] checked:focus:border-[#F30]"
        />
        <span className="ml-2 text-sm text-gray-700">
          Future
          {counts.future !== undefined && (
            <span className="ml-1 text-xs text-gray-500">({counts.future})</span>
          )}
        </span>
      </label>
      
      <label className="flex items-center cursor-pointer select-none">
        <input
          type="checkbox"
          checked={filters.completed}
          onChange={(e) => onChange('completed', e.target.checked)}
          className="w-4 h-4 text-[#F30] bg-white border-gray-300 rounded focus:ring-2 focus:ring-[#F30] focus:ring-offset-0 checked:bg-[#F30] checked:border-[#F30] checked:hover:bg-[#E62E00] checked:hover:border-[#E62E00] checked:focus:bg-[#F30] checked:focus:border-[#F30]"
        />
        <span className="ml-2 text-sm text-gray-700">
          Completed
          {counts.completed !== undefined && (
            <span className="ml-1 text-xs text-gray-500">({counts.completed})</span>
          )}
        </span>
      </label>
      
      <label className="flex items-center cursor-pointer select-none">
        <input
          type="checkbox"
          checked={filters.onHold}
          onChange={(e) => onChange('onHold', e.target.checked)}
          className="w-4 h-4 text-[#F30] bg-white border-gray-300 rounded focus:ring-2 focus:ring-[#F30] focus:ring-offset-0 checked:bg-[#F30] checked:border-[#F30] checked:hover:bg-[#E62E00] checked:hover:border-[#E62E00] checked:focus:bg-[#F30] checked:focus:border-[#F30]"
        />
        <span className="ml-2 text-sm text-gray-700">
          On Hold
          {counts.onHold !== undefined && (
            <span className="ml-1 text-xs text-gray-500">({counts.onHold})</span>
          )}
        </span>
      </label>
    </div>
  );
}