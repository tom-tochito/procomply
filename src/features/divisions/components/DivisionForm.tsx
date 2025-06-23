"use client";

import React, { useActionState } from "react";
import type { Division } from "@/features/divisions/models";

interface DivisionFormProps {
  division?: Division;
  onSubmit: (prevState: { error: string | null; success: boolean }, formData: FormData) => Promise<{ error: string | null; success: boolean }>;
  onCancel: () => void;
}

export default function DivisionForm({ division, onSubmit, onCancel }: DivisionFormProps) {
  const [state, formAction, isPending] = useActionState(onSubmit, {
    error: null,
    success: false,
  });

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
          {state.error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Division Name *
          </label>
          <input
            type="text"
            name="name"
            defaultValue={division?.name}
            required
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            placeholder="e.g., Hampstead, Ealing, Camden"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type *
          </label>
          <select
            name="type"
            defaultValue={division?.type || "Active"}
            required
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
          >
            <option value="Active">Active</option>
            <option value="Archived">Archived</option>
            <option value="Leased">Leased</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            defaultValue={division?.description || ""}
            disabled={isPending}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            placeholder="Optional description of the division"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-[#F30] text-white rounded-md hover:bg-[#E62E00] transition-colors disabled:opacity-50"
        >
          {isPending ? "Saving..." : division ? "Update Division" : "Create Division"}
        </button>
      </div>
    </form>
  );
}