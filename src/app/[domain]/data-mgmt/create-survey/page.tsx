"use client";

import React from "react";
import Link from "next/link";
import Header from "@/common/components/Header";

export default function CreateSurveyPage() {
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Top header with logo and user info */}
      <Header />

      {/* Page title and breadcrumbs */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Create Survey</h1>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <Link href="/dashboard" className="hover:text-blue-600">
            <span>Data Mgmt</span>
          </Link>
          <span className="mx-2">/</span>
          <span>Create Survey</span>
        </div>
      </div>

      {/* Placeholder content */}
      <div className="bg-white rounded-md shadow-sm p-6">
        <h2 className="text-xl font-medium text-gray-700 mb-4">Create Survey for Completed Task</h2>
        <p className="text-gray-500 mb-6">
          This form allows you to create a new survey based on a completed task.
        </p>
        
        <form className="space-y-6">
          <div>
            <label htmlFor="task" className="block text-sm font-medium text-gray-700 mb-1">
              Select Completed Task
            </label>
            <select
              id="task"
              className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select a completed task</option>
              <option value="1">40001 Viney Court - Asbestos Reinspection</option>
              <option value="2">40003 Westcott Park - Fire Alarm Testing</option>
              <option value="3">40004 Meredith Mews - Fire Door Inspection</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="surveyType" className="block text-sm font-medium text-gray-700 mb-1">
              Survey Type
            </label>
            <select
              id="surveyType"
              className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select survey type</option>
              <option value="inspection">Inspection Survey</option>
              <option value="assessment">Risk Assessment</option>
              <option value="compliance">Compliance Check</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="surveyor" className="block text-sm font-medium text-gray-700 mb-1">
              Surveyor
            </label>
            <input
              type="text"
              id="surveyor"
              className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter surveyor name"
            />
          </div>
          
          <div>
            <label htmlFor="surveyDate" className="block text-sm font-medium text-gray-700 mb-1">
              Survey Date
            </label>
            <input
              type="date"
              id="surveyDate"
              className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
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
              Create Survey
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 