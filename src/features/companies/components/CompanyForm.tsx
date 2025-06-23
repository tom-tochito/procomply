"use client";

import React, { useActionState } from "react";
import type { Company } from "@/features/companies/models";

interface CompanyFormProps {
  company?: Company;
  onSubmit: (prevState: { error: string | null; success: boolean }, formData: FormData) => Promise<{ error: string | null; success: boolean }>;
  onCancel: () => void;
}

export default function CompanyForm({ company, onSubmit, onCancel }: CompanyFormProps) {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name *
          </label>
          <input
            type="text"
            name="name"
            defaultValue={company?.name}
            required
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Referral *
          </label>
          <input
            type="text"
            name="referral"
            defaultValue={company?.referral}
            required
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            defaultValue={company?.category || ""}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
          >
            <option value="">Select category</option>
            <option value="Client">Client</option>
            <option value="Supplier">Supplier</option>
            <option value="Contractor">Contractor</option>
            <option value="Partner">Partner</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            defaultValue={company?.email || ""}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            defaultValue={company?.phone || ""}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Postcode
          </label>
          <input
            type="text"
            name="postcode"
            defaultValue={company?.postcode || ""}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Employees
          </label>
          <input
            type="number"
            name="numberOfEmployees"
            defaultValue={company?.numberOfEmployees || ""}
            min="0"
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
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
          {isPending ? "Saving..." : company ? "Update Company" : "Create Company"}
        </button>
      </div>
    </form>
  );
}