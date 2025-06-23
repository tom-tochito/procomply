"use client";

import React, { useEffect } from "react";
import { createCompanyAction } from "@/features/companies/actions/companies.actions";
import { useRouter } from "next/navigation";
import { Tenant } from "@/features/tenant/models";
import { FormState } from "@/common/types/form.types";
import CompanyForm from "./CompanyForm";
import { X } from "lucide-react";

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant;
}

export default function AddCompanyModal({
  isOpen,
  onClose,
  tenant,
}: AddCompanyModalProps) {
  const router = useRouter();
  const [successState, setSuccessState] = React.useState(false);

  const handleSubmit = async (prevState: FormState, formData: FormData) => {
    try {
      const result = await createCompanyAction(tenant, formData);
      
      if (result.success) {
        setSuccessState(true);
        return { error: null, success: true };
      } else {
        return { error: result.error || "Failed to create company", success: false };
      }
    } catch (error) {
      console.error("Error saving company:", error);
      return { error: "Failed to create company", success: false };
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
          <h2 className="text-xl font-semibold">Add New Company</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <CompanyForm onSubmit={handleSubmit} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
}