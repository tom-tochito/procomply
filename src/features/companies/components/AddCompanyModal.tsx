"use client";

import React, { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Tenant } from "@/features/tenant/models";
import { FormState } from "@/common/types/form.types";
import CompanyForm from "./CompanyForm";
import { X } from "lucide-react";
import { toast } from "sonner";

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
  const [successState, setSuccessState] = useState(false);
  const createCompany = useMutation(api.companies.createCompany);

  const handleSubmit = async (prevState: FormState, formData: FormData) => {
    try {
      // Extract form data
      const name = formData.get("name") as string;
      const referral = formData.get("referral") as string;
      const active = formData.get("active") === "true";

      // Create company using Convex
      await createCompany({
        tenantId: tenant._id,
        name,
        referral,
      });

      setSuccessState(true);
      toast.success("Company created successfully");
      router.refresh();
      
      return {
        error: null,
        success: true,
      };
    } catch (error: unknown) {
      console.error("Error creating company:", error);
      return {
        error: error instanceof Error ? error.message : "Failed to create company",
        success: false,
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
          <h2 className="text-xl font-semibold">Add New Company</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <CompanyForm
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}