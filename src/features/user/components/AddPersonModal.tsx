"use client";

import React, { useEffect } from "react";
import { createUserAction } from "@/features/user/actions/user.actions";
import { useRouter } from "next/navigation";
import { Tenant } from "@/features/tenant/models";
import { FormState } from "@/common/types/form.types";
import PersonForm from "./PersonForm";
import { X } from "lucide-react";
import type { Company } from "@/features/companies/models";

interface AddPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant;
  companies: Company[];
}

export default function AddPersonModal({
  isOpen,
  onClose,
  tenant,
  companies,
}: AddPersonModalProps) {
  const router = useRouter();
  const [successState, setSuccessState] = React.useState(false);

  const handleSubmit = async (prevState: FormState, formData: FormData) => {
    try {
      const result = await createUserAction(tenant, formData);
      
      if (result.success) {
        setSuccessState(true);
        return { error: null, success: true };
      } else {
        return { error: result.error || "Failed to create person", success: false };
      }
    } catch (error) {
      console.error("Error saving person:", error);
      return { error: "Failed to create person", success: false };
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
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Add New Person</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <PersonForm 
            companies={companies}
            onSubmit={handleSubmit} 
            onCancel={onClose} 
          />
        </div>
      </div>
    </div>
  );
}