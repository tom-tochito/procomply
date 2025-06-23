"use client";

import React, { useActionState, useRef } from "react";
import Image from "next/image";
import type { Building, BuildingWithDivision } from "@/features/buildings/models";
import type { Division } from "@/features/divisions/models";

interface BuildingFormProps {
  building?: Building | BuildingWithDivision;
  divisions?: Division[];
  onSubmit: (prevState: { error: string | null; success: boolean }, formData: FormData) => Promise<{ error: string | null; success: boolean }>;
  onCancel: () => void;
}

export default function BuildingForm({ building, divisions, onSubmit, onCancel }: BuildingFormProps) {
  const [state, formAction, isPending] = useActionState(onSubmit, {
    error: null,
    success: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(
    building?.image || null
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
          {state.error}
        </div>
      )}

      {/* Basic Information Section */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Building Name *
            </label>
            <input
              type="text"
              name="name"
              defaultValue={building?.name}
              required
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              defaultValue={building?.description}
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Division
            </label>
            <select
              name="divisionId"
              defaultValue={(building && 'divisionEntity' in building) ? building.divisionEntity?.id : ""}
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            >
              <option value="">Select a division</option>
              {divisions?.map((division) => (
                <option key={division.id} value={division.id}>
                  {division.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Billing Account
            </label>
            <input
              type="text"
              name="billingAccount"
              defaultValue={building?.billingAccount}
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Availability
            </label>
            <select
              name="availability"
              defaultValue={building?.availability || ""}
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            >
              <option value="">Select availability</option>
              <option value="Open - Rented">Open - Rented</option>
              <option value="Open - Available">Open - Available</option>
              <option value="Closed">Closed</option>
              <option value="Under Maintenance">Under Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Complex
            </label>
            <input
              type="text"
              name="complex"
              defaultValue={building?.complex}
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="archived"
              defaultChecked={building?.archived || false}
              disabled={isPending}
              className="mr-2 h-4 w-4 text-[#F30] focus:ring-[#F30] border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Archived</span>
          </label>
        </div>
      </div>

      {/* Location Section */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold mb-4">Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <input
              type="text"
              name="address"
              defaultValue={building?.address}
              required
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              name="city"
              defaultValue={building?.city}
              required
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State/Province *
            </label>
            <input
              type="text"
              name="state"
              defaultValue={building?.state}
              required
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP/Postal Code *
            </label>
            <input
              type="text"
              name="zipCode"
              defaultValue={building?.zipCode}
              required
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Floors *
            </label>
            <input
              type="number"
              name="floors"
              defaultValue={building?.floors}
              required
              min="1"
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>
        </div>
      </div>

      {/* Access & Hours Section */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold mb-4">Access & Hours</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opening Hours
            </label>
            <input
              type="text"
              name="openingHours"
              defaultValue={building?.openingHours}
              disabled={isPending}
              placeholder="e.g., Mon-Fri 8AM-6PM"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Site Access Information
            </label>
            <textarea
              name="siteAccess"
              defaultValue={building?.siteAccess}
              disabled={isPending}
              rows={2}
              placeholder="e.g., Keys are in the safe - Parking outside"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>
        </div>
      </div>

      {/* Maintenance Data Section */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold mb-4">Maintenance Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condition
            </label>
            <select
              name="condition"
              defaultValue={building?.condition || ""}
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            >
              <option value="">Select condition</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Criticality
            </label>
            <select
              name="criticality"
              defaultValue={building?.criticality || ""}
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            >
              <option value="">Select criticality</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fire Risk Rating
            </label>
            <select
              name="fireRiskRating"
              defaultValue={building?.fireRiskRating || ""}
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            >
              <option value="">Select rating</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Very High">Very High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Check Date
            </label>
            <input
              type="date"
              name="lastCheckDate"
              defaultValue={building?.lastCheckDate ? new Date(building.lastCheckDate).toISOString().split('T')[0] : ''}
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>
        </div>
      </div>

      {/* Dimensional Data Section */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold mb-4">Dimensional Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Gross Area (sqft)
            </label>
            <input
              type="number"
              name="totalGrossArea"
              defaultValue={building?.totalGrossArea}
              disabled={isPending}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Net Area (sqft)
            </label>
            <input
              type="number"
              name="totalNetArea"
              defaultValue={building?.totalNetArea}
              disabled={isPending}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Rooms
            </label>
            <input
              type="number"
              name="numberOfRooms"
              defaultValue={building?.numberOfRooms}
              disabled={isPending}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Units
            </label>
            <input
              type="number"
              name="numberOfUnits"
              defaultValue={building?.numberOfUnits}
              disabled={isPending}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Covered Area (sqft)
            </label>
            <input
              type="number"
              name="coveredArea"
              defaultValue={building?.coveredArea}
              disabled={isPending}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Glazed Area (sqft)
            </label>
            <input
              type="number"
              name="glazedArea"
              defaultValue={building?.glazedArea}
              disabled={isPending}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cleanable Area (sqft)
            </label>
            <input
              type="number"
              name="cleanableArea"
              defaultValue={building?.cleanableArea}
              disabled={isPending}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Volume (cubic ft)
            </label>
            <input
              type="number"
              name="totalVolume"
              defaultValue={building?.totalVolume}
              disabled={isPending}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heated Volume (cubic ft)
            </label>
            <input
              type="number"
              name="heatedVolume"
              defaultValue={building?.heatedVolume}
              disabled={isPending}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telephone
            </label>
            <input
              type="tel"
              name="telephone"
              defaultValue={building?.telephone}
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Out of Hours Contact
            </label>
            <input
              type="tel"
              name="outOfHourContact"
              defaultValue={building?.outOfHourContact}
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>
        </div>
      </div>

      {/* Building Image Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Building Image</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>
          <input
            ref={fileInputRef}
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isPending}
            className="hidden"
          />
          {imagePreview ? (
            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={imagePreview}
                alt="Building preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={isPending}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded hover:bg-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending}
              className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex flex-col items-center justify-center text-gray-500"
            >
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm">Click to upload image</span>
            </button>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-[#F30] text-white rounded-md hover:bg-[#E20] disabled:opacity-50"
        >
          {isPending ? "Saving..." : building ? "Update Building" : "Create Building"}
        </button>
      </div>
    </form>
  );
}