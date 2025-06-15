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
  progressFilters: {
    inProgressFilter: boolean;
    setInProgressFilter: (value: boolean) => void;
    inboxFilter: boolean;
    setInboxFilter: (value: boolean) => void;
    futureFilter: boolean;
    setFutureFilter: (value: boolean) => void;
    completedFilter: boolean;
    setCompletedFilter: (value: boolean) => void;
    onHoldFilter: boolean;
    setOnHoldFilter: (value: boolean) => void;
  };
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
  progressFilters,
}: TaskFiltersProps) {
  const {
    inProgressFilter,
    setInProgressFilter,
    inboxFilter,
    setInboxFilter,
    futureFilter,
    setFutureFilter,
    completedFilter,
    setCompletedFilter,
    onHoldFilter,
    setOnHoldFilter,
  } = progressFilters;

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

      {/* Progress filters */}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inProgressFilter}
            onChange={(e) => setInProgressFilter(e.target.checked)}
            className="w-4 h-4 text-[#F30] bg-white border-gray-300 rounded focus:ring-2 focus:ring-[#F30] focus:ring-offset-0 checked:bg-[#F30] checked:border-[#F30] checked:hover:bg-[#E62E00] checked:hover:border-[#E62E00] checked:focus:bg-[#F30] checked:focus:border-[#F30]"
          />
          <span className="ml-2 text-sm text-gray-700">In Progress</span>
        </label>
        <label className="flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inboxFilter}
            onChange={(e) => setInboxFilter(e.target.checked)}
            className="w-4 h-4 text-[#F30] bg-white border-gray-300 rounded focus:ring-2 focus:ring-[#F30] focus:ring-offset-0 checked:bg-[#F30] checked:border-[#F30] checked:hover:bg-[#E62E00] checked:hover:border-[#E62E00] checked:focus:bg-[#F30] checked:focus:border-[#F30]"
          />
          <span className="ml-2 text-sm text-gray-700">Inbox</span>
        </label>
        <label className="flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            checked={futureFilter}
            onChange={(e) => setFutureFilter(e.target.checked)}
            className="w-4 h-4 text-[#F30] bg-white border-gray-300 rounded focus:ring-2 focus:ring-[#F30] focus:ring-offset-0 checked:bg-[#F30] checked:border-[#F30] checked:hover:bg-[#E62E00] checked:hover:border-[#E62E00] checked:focus:bg-[#F30] checked:focus:border-[#F30]"
          />
          <span className="ml-2 text-sm text-gray-700">Future</span>
        </label>
        <label className="flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            checked={completedFilter}
            onChange={(e) => setCompletedFilter(e.target.checked)}
            className="w-4 h-4 text-[#F30] bg-white border-gray-300 rounded focus:ring-2 focus:ring-[#F30] focus:ring-offset-0 checked:bg-[#F30] checked:border-[#F30] checked:hover:bg-[#E62E00] checked:hover:border-[#E62E00] checked:focus:bg-[#F30] checked:focus:border-[#F30]"
          />
          <span className="ml-2 text-sm text-gray-700">Completed</span>
        </label>
        <label className="flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            checked={onHoldFilter}
            onChange={(e) => setOnHoldFilter(e.target.checked)}
            className="w-4 h-4 text-[#F30] bg-white border-gray-300 rounded focus:ring-2 focus:ring-[#F30] focus:ring-offset-0 checked:bg-[#F30] checked:border-[#F30] checked:hover:bg-[#E62E00] checked:hover:border-[#E62E00] checked:focus:bg-[#F30] checked:focus:border-[#F30]"
          />
          <span className="ml-2 text-sm text-gray-700">On Hold</span>
        </label>
      </div>
    </div>
  );
}