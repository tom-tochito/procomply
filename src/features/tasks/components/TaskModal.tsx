"use client";

import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { TaskForm } from "./TaskForm";
import { Building } from "@/features/buildings/models";
import { TaskWithRelations } from "@/features/tasks/models";
import { FormState } from "@/common/types/form";
import { createTaskAction, updateTaskAction } from "@/features/tasks/actions/task.actions";
import { usePathname } from "next/navigation";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  tenantId: string;
  buildings?: Building[];
  users?: Array<{ id: string; email: string }>;
  buildingId?: string;
  task?: TaskWithRelations;
  mode: "create" | "edit";
}

export function TaskModal({
  isOpen,
  onClose,
  onSuccess,
  tenantId,
  buildings = [],
  users = [],
  buildingId,
  task,
  mode,
}: TaskModalProps) {
  const pathname = usePathname();
  const tenantSlug = pathname.split('/')[2];

  async function handleSubmit(prevState: FormState, formData: FormData): Promise<FormState> {
    formData.append("tenantId", tenantId);
    formData.append("tenantSlug", tenantSlug);
    
    if (mode === "edit" && task) {
      formData.append("taskId", task.id);
    }
    
    const selectedBuildingId = formData.get("buildingId") as string || buildingId || "";
    if (selectedBuildingId && !formData.has("buildingId")) {
      formData.append("buildingId", selectedBuildingId);
    }

    const action = mode === "create" ? createTaskAction : updateTaskAction;
    const result = await action(prevState, formData);
    
    if (result.success) {
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    }
    
    return result;
  }

  const initialData = mode === "edit" && task ? {
    title: task.title,
    description: task.description || "",
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
    buildingId: task.building?.id || buildingId || "",
    assigneeId: task.assignee?.id || "",
  } : buildingId ? { buildingId } : undefined;

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
                    {mode === "create" ? "Add New Task" : "Edit Task"}
                  </Dialog.Title>
                </div>

                <div className="p-4">
                  <TaskForm
                    onSubmit={handleSubmit}
                    buildings={buildings}
                    users={users}
                    mode={mode}
                    initialData={initialData}
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