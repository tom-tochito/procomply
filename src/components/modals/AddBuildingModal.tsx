"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { divisions } from "@/data/buildings"; // Assuming divisions are exported

interface AddBuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newBuildingData: any) => void; // Define a more specific type later
}

export default function AddBuildingModal({
  isOpen,
  onClose,
  onSave,
}: AddBuildingModalProps) {
  const [buildingId, setBuildingId] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedDivision, setSelectedDivision] = useState(divisions[1] || ""); // Default to first real division
  const [status, setStatus] = useState("Active");

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setBuildingId("");
      setBuildingName("");
      setImageUrl("");
      setSelectedDivision(divisions[1] || "");
      setStatus("Active");
    }
  }, [isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Basic validation (can be expanded)
    if (!buildingId || !buildingName || !selectedDivision) {
      alert("Please fill in ID, Name, and Division.");
      return;
    }

    const newBuildingData = {
      id: buildingId,
      name: buildingName,
      image: imageUrl || "/placeholder-building.jpg", // Default placeholder
      division: selectedDivision,
      status: status,
      // Default compliance and inbox - these likely get updated later
      compliance: 0,
      inbox: {},
    };
    onSave(newBuildingData);
    onClose(); // Close modal after save
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-dialog-enter">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 md:p-5 border-b sticky top-0 bg-white z-10">
          <h3 className="text-lg font-semibold text-gray-900">
            Add New Building
          </h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 md:p-5 space-y-4">
          <div>
            <label
              htmlFor="buildingId"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Building ID*
            </label>
            <input
              type="text"
              id="buildingId"
              value={buildingId}
              onChange={(e) => setBuildingId(e.target.value)}
              className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g., 40007"
              required
            />
          </div>
          <div>
            <label
              htmlFor="buildingName"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Building Name*
            </label>
            <input
              type="text"
              id="buildingName"
              value={buildingName}
              onChange={(e) => setBuildingName(e.target.value)}
              className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g., Maple House"
              required
            />
          </div>
          <div>
            <label
              htmlFor="imageUrl"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label
              htmlFor="division"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Division*
            </label>
            <select
              id="division"
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="block w-full rounded border border-gray-300 px-3 py-2 text-sm bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              {/* Filter out 'Active Divisions' and 'Archived' as selectable options? */}
              {divisions
                .filter((d) => d !== "Active Divisions" && d !== "Archived")
                .map((division) => (
                  <option key={division} value={division}>
                    {division}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="status"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Status*
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="block w-full rounded border border-gray-300 px-3 py-2 text-sm bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="Active">Active</option>
              <option value="Leasehold">Leasehold</option>
              <option value="Archived">Archived</option>
              {/* Add other statuses if needed */}
            </select>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b mt-4 sticky bottom-0 bg-white z-10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Building
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
