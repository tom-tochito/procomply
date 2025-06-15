"use client";

import React from "react";
import { Task } from "@/data/tasks";

interface TaskTableProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export default function TaskTable({ tasks, onTaskClick }: TaskTableProps) {
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "H": return "bg-red-100 text-red-800";
      case "M": return "bg-yellow-100 text-yellow-800";
      case "L": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressBadgeClass = (progress: string, completed: boolean) => {
    if (completed) return "bg-green-100 text-green-800";
    switch (progress) {
      case "Job Started":
      case "In Progress":
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Inbox":
        return "bg-purple-100 text-purple-800";
      case "Future":
        return "bg-gray-100 text-gray-800";
      case "On Hold":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Task
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Risk Area
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Team
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progress
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {task.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {task.risk_area}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeClass(task.priority)}`}>
                  {task.priority}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {task.due_date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {task.team}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getProgressBadgeClass(task.progress, task.completed)}`}>
                  {task.completed ? "Completed" : task.progress}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onTaskClick(task)}
                  className="text-[#F30] hover:text-[#E62E00]"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {tasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks found matching your filters.</p>
        </div>
      )}
    </div>
  );
}