"use client";

import React from "react";
import Link from "next/link";
import Header from "@/common/components/Header";

export default function CreateTaskPage() {
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Top header with logo and user info */}
      <Header />

      {/* Page title and breadcrumbs */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Create Task</h1>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <Link href="/dashboard" className="hover:text-blue-600">
            <span>Data Mgmt</span>
          </Link>
          <span className="mx-2">/</span>
          <span>Create Task</span>
        </div>
      </div>

      {/* Placeholder content */}
      <div className="bg-white rounded-md shadow-sm p-6">
        <h2 className="text-xl font-medium text-gray-700 mb-4">Create Task for Building</h2>
        <p className="text-gray-500 mb-6">
          This form allows you to create new tasks and assign them to buildings.
        </p>
        
        <form className="space-y-6">
          <div>
            <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-1">
              Select Building
            </label>
            <select
              id="building"
              className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select a building</option>
              <option value="40001">40001 Viney Court</option>
              <option value="40003">40003 Westcott Park</option>
              <option value="40004">40004 Meredith Mews</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="taskType" className="block text-sm font-medium text-gray-700 mb-1">
              Task Type
            </label>
            <select
              id="taskType"
              className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select task type</option>
              <option value="fireAlarm">Fire Alarm Testing</option>
              <option value="asbestos">Asbestos Reinspection</option>
              <option value="fireDoor">Fire Door Inspection</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">
              Assign Team
            </label>
            <select
              id="team"
              className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select a team</option>
              <option value="asap">ASAP Comply Ltd</option>
              <option value="propertyFireProtection">Property Fire Protection</option>
            </select>
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              type="button"
              className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 