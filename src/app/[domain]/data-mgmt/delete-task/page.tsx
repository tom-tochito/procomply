"use client";

import React from "react";
import Link from "next/link";
import Header from "@/common/components/Header";

export default function DeleteTaskPage() {
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Top header with logo and user info */}
      <Header />

      {/* Page title and breadcrumbs */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Delete Task</h1>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <Link href="/dashboard" className="hover:text-blue-600">
            <span>Data Mgmt</span>
          </Link>
          <span className="mx-2">/</span>
          <span>Delete Task</span>
        </div>
      </div>

      {/* Placeholder content */}
      <div className="bg-white rounded-md shadow-sm p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Warning</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Deleting a task is permanent and cannot be undone. Please be sure before proceeding.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <h2 className="text-xl font-medium text-gray-700 mb-4">Delete Task</h2>
        <p className="text-gray-500 mb-6">
          Select a task to delete from the system.
        </p>
        
        <form className="space-y-6">
          <div>
            <label htmlFor="task" className="block text-sm font-medium text-gray-700 mb-1">
              Select Task
            </label>
            <select
              id="task"
              className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            >
              <option value="">Select a task</option>
              <option value="1">40001 Viney Court - ALL Fire Door Survey (inc flats) (1Y)</option>
              <option value="2">40001 Viney Court - Quarterly Communal Fire Door Inspections</option>
              <option value="3">40003 Westcott Park - Fire Alarm Testing</option>
              <option value="4">40001 Viney Court - Asbestos Reinspection</option>
              <option value="5">40001 Viney Court - Legionella Risk Assessment</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Deletion
            </label>
            <textarea
              id="reason"
              rows={3}
              className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Please provide a reason for deleting this task"
            ></textarea>
          </div>
          
          <div className="flex items-start mt-4">
            <div className="flex items-center h-5">
              <input
                id="confirm"
                name="confirm"
                type="checkbox"
                className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="confirm" className="font-medium text-gray-700">
                I understand that this action cannot be undone
              </label>
            </div>
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
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 