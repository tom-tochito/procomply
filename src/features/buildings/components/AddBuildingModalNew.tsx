"use client";

import React, { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Tenant } from "@/features/tenant/models";
import { Division } from "@/features/divisions/models";
import BuildingForm from "./BuildingForm";
import { toast } from "sonner";

interface AddBuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant;
  divisions?: Division[];
}

export default function AddBuildingModal({
  isOpen,
  onClose,
  tenant,
  divisions,
}: AddBuildingModalProps) {
  const router = useRouter();
  const [successState, setSuccessState] = useState(false);
  const createBuilding = useMutation(api.buildings.createBuilding);

  const handleSubmit = async (prevState: { error: string | null; success: boolean }, formData: FormData) => {
    try {
      // Extract form data
      const name = formData.get("name") as string;
      const internalCode = formData.get("internalCode") as string;
      const divisionId = formData.get("divisionId") as string;
      const complexId = formData.get("complexId") as string;
      const address = formData.get("address") as string;
      const city = formData.get("city") as string;
      const country = formData.get("country") as string;
      const templateId = formData.get("templateId") as string;

      // Create building using Convex
      // Additional fields are stored in the data property
      const buildingData = {
        internalCode,
        complexId,
        address,
        city,
        country,
      };

      await createBuilding({
        tenantId: tenant._id,
        name,
        divisionId: divisionId ? divisionId as any : undefined,
        templateId: templateId ? templateId as any : undefined,
        data: buildingData,
      });

      setSuccessState(true);
      toast.success("Building created successfully");
      router.refresh();
      
      return {
        success: true,
        error: null,
      };
    } catch (error: unknown) {
      console.error("Error creating building:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create building",
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
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Building</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <BuildingForm
          divisions={divisions || []}
          tenant={{ id: tenant._id, name: tenant.name, slug: tenant.slug }}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}