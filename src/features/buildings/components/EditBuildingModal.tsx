"use client";

import React, { useEffect } from "react";
import { updateBuildingAction } from "@/features/buildings/actions/buildings.actions";
import { useRouter } from "next/navigation";
import { Building } from "@/features/buildings/models";
import { Division } from "@/features/divisions/models";
import { FormState } from "@/common/types/form.types";
import BuildingForm from "./BuildingForm";

interface EditBuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  building: Building & { tenant?: { id: string; name: string; slug: string; description: string; createdAt: number; updatedAt: number } };
  divisions?: Division[];
}

export default function EditBuildingModal({
  isOpen,
  onClose,
  building,
  divisions,
}: EditBuildingModalProps) {
  const router = useRouter();
  const [successState, setSuccessState] = React.useState(false);

  const handleSubmit = async (prevState: FormState, formData: FormData) => {
    try {
      const result = await updateBuildingAction(building.tenant || { id: "", name: "", slug: "", description: "", createdAt: Date.now(), updatedAt: Date.now() }, building.id, formData);
      
      if (result.success) {
        setSuccessState(true);
        return { error: null, success: true };
      } else {
        return { error: result.error || "Failed to update building", success: false };
      }
    } catch (error) {
      console.error("Error updating building:", error);
      return { error: "Failed to update building", success: false };
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
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-dialog-enter">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 md:p-5 border-b sticky top-0 bg-white z-10">
          <h3 className="text-lg font-semibold text-gray-900">
            Edit Building
          </h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-5">
          <BuildingForm 
            building={building}
            divisions={divisions}
            tenant={building.tenant || { id: "", name: "", slug: "", description: "", createdAt: Date.now(), updatedAt: Date.now() }}
            onSubmit={handleSubmit} 
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}