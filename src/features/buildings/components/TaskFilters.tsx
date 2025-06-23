"use client";

import React from "react";

interface TaskFiltersProps {
  taskSearchTerm: string;
  setTaskSearchTerm: (value: string) => void;
  filterByTeam: string;
  setFilterByTeam: (value: string) => void;
  filterByAssignee: string;
  setFilterByAssignee: (value: string) => void;
  uniqueTeams: string[];
  uniqueAssignees: string[];
  onAddNewTask: () => void;
}

export default function TaskFilters({
  taskSearchTerm,
  setTaskSearchTerm,
  filterByTeam,
  setFilterByTeam,
  filterByAssignee,
  setFilterByAssignee,
  uniqueTeams,
  uniqueAssignees,
  onAddNewTask,
}: TaskFiltersProps) {

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search tasks..."
            value={taskSearchTerm}
            onChange={(e) => setTaskSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30] focus:border-[#F30]"
          />
        </div>

        {/* Team filter */}
        <select
          value={filterByTeam}
          onChange={(e) => setFilterByTeam(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30] focus:border-[#F30]"
        >
          <option value="">All Teams</option>
          {uniqueTeams.map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>

        {/* Assignee filter */}
        <select
          value={filterByAssignee}
          onChange={(e) => setFilterByAssignee(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30] focus:border-[#F30]"
        >
          <option value="">All Assignees</option>
          {uniqueAssignees.map(assignee => (
            <option key={assignee} value={assignee}>{assignee}</option>
          ))}
        </select>

        {/* Add task button */}
        <button
          onClick={onAddNewTask}
          className="px-4 py-2 bg-[#F30] text-white rounded-md hover:bg-[#E62E00] transition-colors"
        >
          Add Task
        </button>
      </div>
    </div>
  );
}