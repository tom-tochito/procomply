"use client";

import React, { useState, useEffect } from "react";
import { Task } from "@/data/tasks";

interface TaskTableProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  columnsMenuOpen: boolean;
  setColumnsMenuOpen: (open: boolean) => void;
}

const initialVisibleColumns = {
  description: true,
  riskArea: true,
  priority: true,
  riskLevel: true,
  dueDate: true,
  team: true,
  assignee: true,
  progress: true,
  latestNote: true,
  groups: true,
  actions: true,
};

type VisibleColumnsState = typeof initialVisibleColumns;

export default function TaskTable({
  tasks,
  onTaskClick,
  columnsMenuOpen,
  setColumnsMenuOpen,
}: TaskTableProps) {
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumnsState>(
    initialVisibleColumns
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.columns-menu') && !target.closest('[onclick*="setColumnsMenuOpen"]')) {
        setColumnsMenuOpen(false);
      }
    };

    if (columnsMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [columnsMenuOpen, setColumnsMenuOpen]);

  useEffect(() => {
    const handleResponsiveColumns = () => {
      if (window.innerWidth < 640) {
        setVisibleColumns({
          description: true,
          riskArea: false,
          priority: true,
          riskLevel: false,
          dueDate: true,
          team: false,
          assignee: false,
          progress: true,
          latestNote: false,
          groups: false,
          actions: true,
        });
      } else if (window.innerWidth < 1024) {
        setVisibleColumns({
          description: true,
          riskArea: true,
          priority: true,
          riskLevel: true,
          dueDate: true,
          team: true,
          assignee: false,
          progress: true,
          latestNote: false,
          groups: false,
          actions: true,
        });
      } else {
        setVisibleColumns({
          description: true,
          riskArea: true,
          priority: true,
          riskLevel: true,
          dueDate: true,
          team: true,
          assignee: true,
          progress: true,
          latestNote: true,
          groups: true,
          actions: true,
        });
      }
    };

    handleResponsiveColumns();
    window.addEventListener("resize", handleResponsiveColumns);
    return () => window.removeEventListener("resize", handleResponsiveColumns);
  }, []);

  const toggleColumnVisibility = (column: keyof VisibleColumnsState) => {
    setVisibleColumns((prevState) => ({
      ...prevState,
      [column]: !prevState[column],
    }));
  };

  const renderBadge = (level: string) => {
    const bgColor =
      level === "H"
        ? "bg-red-500"
        : level === "M"
        ? "bg-yellow-500"
        : "bg-blue-500";
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full ${bgColor} text-white w-6 h-6 text-xs font-medium`}
      >
        {level}
      </span>
    );
  };

  const renderDateBadge = (date: string) => {
    return (
      <span className="inline-block rounded-md bg-red-100 text-red-800 px-2 py-1 text-xs font-medium">
        {date}
      </span>
    );
  };

  const toggleTaskComplete = (taskId: string | number) => {
    console.log(`Toggling completion status of task ${taskId}`);
  };

  return (
    <>
      <div className="mb-6">
        <div className="block md:hidden">
          <select
            className="w-full border rounded-md px-3 py-2 bg-white"
            onChange={(e) => alert(`Selected tab: ${e.target.value}`)}
          >
            <option value="in-progress">In Progress (107)</option>
            <option value="inbox">Inbox (157 + 43)</option>
            <option value="future">Future (377)</option>
            <option value="completed">Completed (10238)</option>
            <option value="on-hold-requested">On Hold Requested</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>

        <div className="hidden md:flex space-x-2">
          <div className="flex items-center px-3 py-2 bg-white rounded-md border border-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            In Progress
            <span className="ml-2 bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs">
              107
            </span>
          </div>
          <div className="flex items-center px-3 py-2 bg-white rounded-md border border-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Inbox
            <span className="ml-2 bg-red-500 text-white px-1.5 py-0.5 rounded text-xs">
              157
            </span>
            <span className="ml-1 bg-yellow-500 text-white px-1.5 py-0.5 rounded text-xs">
              43
            </span>
          </div>
          <div className="flex items-center px-3 py-2 bg-white rounded-md border border-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Future
            <span className="ml-2 bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs">
              377
            </span>
          </div>
          <div className="flex items-center px-3 py-2 bg-white rounded-md border border-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Completed
            <span className="ml-2 bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs">
              10238
            </span>
          </div>
          <div className="flex items-center px-3 py-2 bg-white rounded-md border border-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            On Hold Requested
          </div>
          <div className="flex items-center px-3 py-2 bg-white rounded-md border border-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            On Hold
          </div>
        </div>
      </div>

      {columnsMenuOpen && (
        <div className="columns-menu absolute right-48 top-40 w-48 bg-white rounded-md shadow-lg z-20 py-1 border border-gray-200">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
            Toggle columns
          </div>
          <div className="p-2 max-h-60 overflow-y-auto">
            <label className="flex items-center p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={visibleColumns.description}
                onChange={() => toggleColumnVisibility("description")}
                className="mr-2"
                disabled
              />
              <span className="text-sm">Description</span>
            </label>
            <label className="flex items-center p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={visibleColumns.riskArea}
                onChange={() => toggleColumnVisibility("riskArea")}
                className="mr-2"
              />
              <span className="text-sm">Risk Area</span>
            </label>
            <label className="flex items-center p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={visibleColumns.priority}
                onChange={() => toggleColumnVisibility("priority")}
                className="mr-2"
              />
              <span className="text-sm">Priority</span>
            </label>
            <label className="flex items-center p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={visibleColumns.riskLevel}
                onChange={() => toggleColumnVisibility("riskLevel")}
                className="mr-2"
              />
              <span className="text-sm">Risk Level</span>
            </label>
            <label className="flex items-center p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={visibleColumns.dueDate}
                onChange={() => toggleColumnVisibility("dueDate")}
                className="mr-2"
              />
              <span className="text-sm">Due Date</span>
            </label>
            <label className="flex items-center p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={visibleColumns.team}
                onChange={() => toggleColumnVisibility("team")}
                className="mr-2"
              />
              <span className="text-sm">Team</span>
            </label>
            <label className="flex items-center p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={visibleColumns.assignee}
                onChange={() => toggleColumnVisibility("assignee")}
                className="mr-2"
              />
              <span className="text-sm">Assignee</span>
            </label>
            <label className="flex items-center p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={visibleColumns.progress}
                onChange={() => toggleColumnVisibility("progress")}
                className="mr-2"
              />
              <span className="text-sm">Progress</span>
            </label>
            <label className="flex items-center p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={visibleColumns.latestNote}
                onChange={() => toggleColumnVisibility("latestNote")}
                className="mr-2"
              />
              <span className="text-sm">Latest Note</span>
            </label>
            <label className="flex items-center p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={visibleColumns.groups}
                onChange={() => toggleColumnVisibility("groups")}
                className="mr-2"
              />
              <span className="text-sm">Groups</span>
            </label>
          </div>
        </div>
      )}

      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="block sm:hidden">
          {tasks.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {tasks.map((task, index) => (
                <div
                  key={task.id || index}
                  className="p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => onTaskClick(task)}
                >
                  <div className="font-medium text-gray-900 mb-1">
                    {task.description}
                  </div>
                  <div className="text-gray-500 text-sm mb-2">
                    Building: {task.building_id}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    {visibleColumns.riskArea && (
                      <div>
                        <span className="text-gray-500">Risk Area:</span>{" "}
                        {task.risk_area}
                      </div>
                    )}
                    {visibleColumns.priority && (
                      <div>
                        <span className="text-gray-500">Priority:</span>{" "}
                        {renderBadge(task.priority)}
                      </div>
                    )}
                    {visibleColumns.riskLevel && (
                      <div>
                        <span className="text-gray-500">Risk Level:</span>{" "}
                        {renderBadge(task.risk_level)}
                      </div>
                    )}
                    {visibleColumns.dueDate && (
                      <div>
                        <span className="text-gray-500">Due Date:</span>{" "}
                        {renderDateBadge(task.due_date)}
                      </div>
                    )}
                    {visibleColumns.team && (
                      <div>
                        <span className="text-gray-500">Team:</span>{" "}
                        {task.team || "—"}
                      </div>
                    )}
                    {visibleColumns.assignee && (
                      <div>
                        <span className="text-gray-500">Assignee:</span>{" "}
                        {task.assignee || "—"}
                      </div>
                    )}
                    {visibleColumns.progress && (
                      <div>
                        <span className="text-gray-500">Progress:</span>{" "}
                        {task.progress ? (
                          <span className="inline-block rounded bg-gray-100 px-2 py-1 text-xs">
                            {task.progress}
                          </span>
                        ) : (
                          "—"
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2 mt-2 border-t pt-2">
                    <button
                      className="text-blue-600 hover:text-blue-800 p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskClick(task);
                      }}
                      title="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      className="text-green-600 hover:text-green-800 p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskComplete(task.id);
                      }}
                      title="Mark as complete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Delete task ${task.id}`);
                      }}
                      title="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 italic">
              No tasks found matching your filters
            </div>
          )}
        </div>

        <div className="hidden sm:block">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8"
                  ></th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  {visibleColumns.riskArea && (
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Risk Area
                    </th>
                  )}
                  {visibleColumns.priority && (
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
                    >
                      PR
                    </th>
                  )}
                  {visibleColumns.riskLevel && (
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
                    >
                      RL
                    </th>
                  )}
                  {visibleColumns.dueDate && (
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Due Date
                    </th>
                  )}
                  {visibleColumns.team && (
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Team
                    </th>
                  )}
                  {visibleColumns.assignee && (
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Assignee
                    </th>
                  )}
                  {visibleColumns.progress && (
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Progress
                    </th>
                  )}
                  {visibleColumns.latestNote && (
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Latest Note
                    </th>
                  )}
                  {visibleColumns.groups && (
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Groups
                    </th>
                  )}
                  {visibleColumns.actions && (
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20"
                    >
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.length > 0 ? (
                  tasks.map((task, index) => (
                    <tr
                      key={task.id || index}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => onTaskClick(task)}
                    >
                      <td
                        className="px-4 py-4 whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button className="focus:outline-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-400 hover:text-[#F30]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">
                          {task.description}
                        </div>
                        <div className="text-gray-500 text-sm">
                          Building: {task.building_id}
                        </div>
                      </td>
                      {visibleColumns.riskArea && (
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {task.risk_area}
                        </td>
                      )}
                      {visibleColumns.priority && (
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {renderBadge(task.priority)}
                        </td>
                      )}
                      {visibleColumns.riskLevel && (
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {renderBadge(task.risk_level)}
                        </td>
                      )}
                      {visibleColumns.dueDate && (
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {renderDateBadge(task.due_date)}
                        </td>
                      )}
                      {visibleColumns.team && (
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {task.team || "—"}
                        </td>
                      )}
                      {visibleColumns.assignee && (
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {task.assignee || "—"}
                        </td>
                      )}
                      {visibleColumns.progress && (
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {task.progress ? (
                            <div className="rounded bg-gray-100 px-2 py-1 text-xs">
                              {task.progress}
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>
                      )}
                      {visibleColumns.latestNote && (
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {task.notes.at(-1) || "—"}
                        </td>
                      )}
                      {visibleColumns.groups && (
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {task.groups ? task.groups.join(", ") : "—"}
                        </td>
                      )}
                      {visibleColumns.actions && (
                        <td
                          className="px-4 py-4 whitespace-nowrap text-sm text-gray-500"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex space-x-2">
                            <button
                              className="text-blue-600 hover:text-blue-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                onTaskClick(task);
                              }}
                              title="Edit"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              className="text-green-600 hover:text-green-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTaskComplete(task.id);
                              }}
                              title="Mark as complete"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Delete task ${task.id}`);
                              }}
                              title="Delete"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={12}
                      className="px-6 py-10 text-center text-gray-500 italic"
                    >
                      No tasks found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="text-gray-500">
          Showing {tasks.length} tasks
        </div>
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 focus:outline-none transition-colors"
            onClick={() => alert("Previous page")}
          >
            Previous
          </button>
          <button
            className="px-3 py-1 border rounded-md bg-[#F30] text-white hover:bg-[#E20] focus:outline-none transition-colors"
            onClick={() => alert("Next page")}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}