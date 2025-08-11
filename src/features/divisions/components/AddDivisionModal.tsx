"use client";

import React, { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Tenant } from "@/features/tenant/models";
import { FormState } from "@/common/types/form.types";
import DivisionForm from "./DivisionForm";
import { X } from "lucide-react";
import { toast } from "sonner";

interface AddDivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant;
}

export default function AddDivisionModal({
  isOpen,
  onClose,
  tenant,
}: AddDivisionModalProps) {
  const router = useRouter();
  const [successState, setSuccessState] = useState(false);
  const createDivision = useMutation(api.divisions.createDivision);

  const handleSubmit = async (prevState: FormState, formData: FormData) => {
    try {
      // Extract form data
      const name = formData.get("name") as string;
      const type = formData.get("active") === "true" ? "Active" : "Inactive";
      const description = formData.get("code") as string || undefined;

      // Create division using Convex
      await createDivision({
        name,
        type,
        description,
      });

      setSuccessState(true);
      toast.success("Division created successfully");
      router.refresh();
      
      return {
        success: true,
        error: null,
      };
    } catch (error: unknown) {
      console.error("Error creating division:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create division",
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
          <h2 className="text-xl font-semibold">Add New Division</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <DivisionForm
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}