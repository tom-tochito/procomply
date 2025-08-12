"use client";

import React, { useActionState } from "react";
import type { Team, TeamWithRelations } from "@/features/teams/models";
import type { Company } from "@/features/companies/models";
import type { FullUser } from "@/features/user/models";

interface TeamFormProps {
  team?: Team;
  companies: Company[];
  supervisors: FullUser[];
  onSubmit: (prevState: { error: string | null; success: boolean }, formData: FormData) => Promise<{ error: string | null; success: boolean }>;
  onCancel: () => void;
}

export default function TeamForm({ team, companies, supervisors, onSubmit, onCancel }: TeamFormProps) {
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
            Team Code
          </label>
          <input
            type="text"
            name="code"
            defaultValue={team?.code || ""}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            placeholder="Optional team code"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <input
            type="text"
            name="description"
            defaultValue={team?.description}
            required
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            placeholder="Team description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <select
            name="companyId"
            defaultValue={(team as TeamWithRelations)?.company?._id || ""}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
          >
            <option value="">Select a company</option>
            {companies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supervisor
          </label>
          <select
            name="supervisorId"
            defaultValue={(team as TeamWithRelations)?.supervisor?._id || ""}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
          >
            <option value="">Select a supervisor</option>
            {supervisors.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name || user.email}
              </option>
            ))}
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
          {isPending ? "Saving..." : team ? "Update Team" : "Create Team"}
        </button>
      </div>
    </form>
  );
}