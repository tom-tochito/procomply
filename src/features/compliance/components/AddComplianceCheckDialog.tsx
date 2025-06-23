"use client";

import React, { useActionState } from "react";
import { X } from "lucide-react";
import { 
  COMPLIANCE_CHECK_TYPES, 
  COMPLIANCE_STATUS,
  ComplianceCheckType,
  ComplianceStatus
} from "../models";
import { createComplianceCheck } from "../repository/compliance.repository";
import type { Tenant } from "@/features/tenant/models";

interface AddComplianceCheckDialogProps {
  isOpen: boolean;
  onClose: () => void;
  buildingId: string;
  buildingName: string;
  tenant: Tenant;
  onSuccess: () => void;
}

interface FormState {
  error: string | null;
  success: boolean;
}

export default function AddComplianceCheckDialog({
  isOpen,
  onClose,
  buildingId,
  buildingName,
  tenant,
  onSuccess,
}: AddComplianceCheckDialogProps) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: FormState, formData: FormData): Promise<FormState> => {
      try {
        const checkType = formData.get("checkType") as string;
        const status = formData.get("status") as string;
        const dueDate = formData.get("dueDate") as string;
        const completedDate = formData.get("completedDate") as string;
        const notes = formData.get("notes") as string;

        if (!checkType || !status || !dueDate) {
          return { error: "Please fill in all required fields", success: false };
        }

        await createComplianceCheck(
          buildingId,
          tenant.id,
          checkType as ComplianceCheckType,
          status as ComplianceStatus,
          new Date(dueDate),
          completedDate ? new Date(completedDate) : undefined,
          notes || undefined
        );

        onSuccess();
        onClose();
        return { error: null, success: true };
      } catch (error) {
        return { 
          error: error instanceof Error ? error.message : "Failed to create compliance check", 
          success: false 
        };
      }
    },
    { error: null, success: false }
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Compliance Check</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isPending}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Building: <span className="font-medium">{buildingName}</span>
        </p>

        <form action={formAction}>
          {state.error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
              {state.error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check Type *
              </label>
              <select
                name="checkType"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30] focus:border-transparent"
                required
                disabled={isPending}
              >
                <option value="">Select a check type</option>
                {Object.entries(COMPLIANCE_CHECK_TYPES).map(([key, value]) => (
                  <option key={value} value={value}>
                    {key.split('_').map(word => 
                      word.charAt(0) + word.slice(1).toLowerCase()
                    ).join(' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                name="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30] focus:border-transparent"
                required
                disabled={isPending}
              >
                <option value="">Select status</option>
                {Object.entries(COMPLIANCE_STATUS).map(([key, value]) => (
                  <option key={value} value={value}>
                    {key.charAt(0) + key.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                name="dueDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30] focus:border-transparent"
                required
                disabled={isPending}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Completed Date
              </label>
              <input
                type="date"
                name="completedDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30] focus:border-transparent"
                disabled={isPending}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30] focus:border-transparent"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-[#F30] rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
              disabled={isPending}
            >
              {isPending ? "Creating..." : "Create Check"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}