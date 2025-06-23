"use client";

import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { TaskForm } from "./TaskForm";
import { Building } from "@/features/buildings/models";
import { FormState } from "@/common/types/form";
import { createTaskAction } from "@/features/tasks/actions/task.actions";
import { usePathname } from "next/navigation";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  tenantId: string;
  buildings?: Building[];
  users?: Array<{ id: string; email: string }>;
  buildingId?: string; // Pre-selected building for building details page
}

export function AddTaskModal({
  isOpen,
  onClose,
  onSuccess,
  tenantId,
  buildings = [],
  users = [],
  buildingId,
}: AddTaskModalProps) {
  const pathname = usePathname();
  const tenantSlug = pathname.split('/')[2]; // Extract tenant from /tenant/[tenant]/...

  async function handleSubmit(prevState: FormState, formData: FormData): Promise<FormState> {
    // Append tenantId and tenantSlug to formData
    formData.append("tenantId", tenantId);
    formData.append("tenantSlug", tenantSlug);
    
    const selectedBuildingId = formData.get("buildingId") as string || buildingId || "";
    if (selectedBuildingId && !formData.has("buildingId")) {
      formData.append("buildingId", selectedBuildingId);
    }

    const result = await createTaskAction(prevState, formData);
    
    if (result.success) {
      // Close modal and trigger success callback
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    }
    
    return result;
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                <div className="px-4 py-3 border-b border-gray-200">
                  <Dialog.Title className="text-base font-medium text-gray-900">
                    Add New Task
                  </Dialog.Title>
                </div>

                <div className="p-4">
                  <TaskForm
                    onSubmit={handleSubmit}
                    buildings={buildings}
                    users={users}
                    mode="create"
                    initialData={buildingId ? { buildingId } : undefined}
                    onCancel={onClose}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}