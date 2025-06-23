"use client";

import React, { useActionState } from "react";
import type { FullUser } from "@/features/user/models";
import type { Company } from "@/features/companies/models";

interface PersonFormProps {
  person?: FullUser;
  companies: Company[];
  onSubmit: (prevState: { error: string | null; success: boolean }, formData: FormData) => Promise<{ error: string | null; success: boolean }>;
  onCancel: () => void;
}

export default function PersonForm({ person, companies, onSubmit, onCancel }: PersonFormProps) {
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
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            defaultValue={person?.email}
            required
            disabled={isPending || !!person}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30] disabled:bg-gray-100"
          />
          {person && (
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed after creation</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            defaultValue={person?.profile?.name || ""}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position / Role
          </label>
          <input
            type="text"
            name="position"
            defaultValue={person?.profile?.position || ""}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            placeholder="e.g., Fire Risk Assessor, Manager"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            defaultValue={person?.profile?.phone || ""}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile
          </label>
          <input
            type="tel"
            name="phoneMobile"
            defaultValue={person?.profile?.phoneMobile || ""}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <select
            name="companyId"
            defaultValue=""
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
          >
            <option value="">Select a company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            System Role
          </label>
          <select
            name="role"
            defaultValue={person?.profile?.role || "user"}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
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
          {isPending ? "Saving..." : person ? "Update Person" : "Create Person"}
        </button>
      </div>
    </form>
  );
}