"use client";

import React from "react";
import Link from "next/link";
import Header from "@/common/components/Header";

export default function ArchiveBuildingPage() {
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Top header with logo and user info */}
      <Header />

      {/* Page title and breadcrumbs */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Archive Building</h1>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <Link href="/dashboard" className="hover:text-blue-600">
            <span>Data Mgmt</span>
          </Link>
          <span className="mx-2">/</span>
          <span>Archive Building</span>
        </div>
      </div>

      {/* Placeholder content */}
      <div className="bg-white rounded-md shadow-sm p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Important</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Archiving a building will hide it from active operations but preserve all its data and history.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <h2 className="text-xl font-medium text-gray-700 mb-4">Archive Building</h2>
        <p className="text-gray-500 mb-6">
          Select a building to archive from the system.
        </p>
        
        <form className="space-y-6">
          <div>
            <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-1">
              Select Building
            </label>
            <select
              id="building"
              className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            >
              <option value="">Select a building</option>
              <option value="40001">40001 Viney Court</option>
              <option value="40003">40003 Westcott Park</option>
              <option value="40004">40004 Meredith Mews</option>
              <option value="40005">40005 Lambert Court</option>
              <option value="40006">40006 Hillgate Place</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Archiving
            </label>
            <textarea
              id="reason"
              rows={3}
              className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              placeholder="Please provide a reason for archiving this building"
            ></textarea>
          </div>
          
          <div className="flex items-start mt-4">
            <div className="flex items-center h-5">
              <input
                id="tasksComplete"
                name="tasksComplete"
                type="checkbox"
                className="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="tasksComplete" className="font-medium text-gray-700">
                I confirm all tasks associated with this building are completed or reassigned
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
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Archive Building
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 