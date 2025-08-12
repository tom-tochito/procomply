"use client";

import React, { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Tenant } from "@/features/tenant/models";
import { FormState } from "@/common/types/form.types";
import TeamForm from "./TeamForm";
import { X } from "lucide-react";
import { toast } from "sonner";
import type { Company } from "@/features/companies/models";
import type { FullUser } from "@/features/users/models";

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
  const [successState, setSuccessState] = useState(false);
  const createTeam = useMutation(api.teams.createTeam);

  const handleSubmit = async (prevState: FormState, formData: FormData) => {
    try {
      // Extract form data
      const code = formData.get("code") as string;
      const description = formData.get("description") as string;
      const companyId = formData.get("companyId") as string;
      const supervisorId = formData.get("supervisorId") as string;

      // Create team using Convex
      await createTeam({
        tenantId: tenant._id,
        code,
        description,
        companyId: companyId ? companyId as any : undefined,
        supervisorId: supervisorId ? supervisorId as any : undefined,
      });

      setSuccessState(true);
      toast.success("Team created successfully");
      router.refresh();
      
      return {
        success: true,
        error: null,
      };
    } catch (error: unknown) {
      console.error("Error creating team:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create team",
      };
    }
  };

  useEffect(() => {
    if (successState) {
      const timer = setTimeout(() => {
        onClose();
        setSuccessState(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [successState, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Team</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <TeamForm
          companies={companies}
          supervisors={supervisors}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}