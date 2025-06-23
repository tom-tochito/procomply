"use client";

import React, { useEffect } from "react";
import { createTeamAction } from "@/features/teams/actions/teams.actions";
import { useRouter } from "next/navigation";
import { Tenant } from "@/features/tenant/models";
import { FormState } from "@/common/types/form.types";
import TeamForm from "./TeamForm";
import { X } from "lucide-react";
import type { Company } from "@/features/companies/models";
import type { FullUser } from "@/features/user/models";

interface AddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant;
  companies: Company[];
  supervisors: FullUser[];
}

export default function AddTeamModal({
  isOpen,
  onClose,
  tenant,
  companies,
  supervisors,
}: AddTeamModalProps) {
  const router = useRouter();
  const [successState, setSuccessState] = React.useState(false);

  const handleSubmit = async (prevState: FormState, formData: FormData) => {
    try {
      const result = await createTeamAction(tenant, formData);
      
      if (result.success) {
        setSuccessState(true);
        return { error: null, success: true };
      } else {
        return { error: result.error || "Failed to create team", success: false };
      }
    } catch (error) {
      console.error("Error saving team:", error);
      return { error: "Failed to create team", success: false };
    }
  };

  // Handle successful submission
  useEffect(() => {
    if (successState) {
      router.refresh();
      onClose();
      setSuccessState(false);
    }
  }, [successState, router, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Add New Team</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <TeamForm 
            companies={companies}
            supervisors={supervisors}
            onSubmit={handleSubmit} 
            onCancel={onClose} 
          />
        </div>
      </div>
    </div>
  );
}