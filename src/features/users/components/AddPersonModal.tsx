"use client";

import React, { useEffect, useState } from "react";
// import { useMutation } from "convex/react";
// import { api } from "~/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Tenant } from "@/features/tenant/models";
// import { FormState } from "@/common/types/form.types";
import PersonForm from "./PersonForm";
import { X } from "lucide-react";
import { toast } from "sonner";
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
  companies,
}: AddPersonModalProps) {
  const router = useRouter();
  const [successState, setSuccessState] = useState(false);
  // const createUserProfile = useMutation(api.users.createUserProfile); // This mutation doesn't exist

  const handleSubmit = async () => {
    try {
      // Extract form data
      // const name = formData.get("name") as string;
      // const email = formData.get("email") as string;
      // const phone = formData.get("phone") as string;
      // const phoneMobile = formData.get("phoneMobile") as string;
      // const position = formData.get("position") as string;
      // const companyId = formData.get("companyId") as string;
      // const role = formData.get("role") as string || "user";

      // Create user profile using Convex
      // Note: This creates a profile for the current authenticated user
      // In a real app, you might want a different flow for adding other users
      
      // TODO: Implement user creation mutation
      // For now, show error message
      throw new Error("User creation is not implemented yet. This feature requires a proper user creation mutation in Convex.");

      setSuccessState(true);
      toast.success("Person created successfully");
      router.refresh();
      
      return {
        success: true,
        error: null,
      };
    } catch (error: unknown) {
      console.error("Error creating person:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create person",
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
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Person</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <PersonForm
          companies={companies}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}