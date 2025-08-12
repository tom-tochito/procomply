"use client";

import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import { TaskForm } from "./TaskForm";
import { Building } from "@/features/buildings/models";
import { TaskWithRelations } from "@/features/tasks/models";
import { FormState } from "@/common/types/form.types";
import { usePathname } from "next/navigation";
import { Tenant } from "@/features/tenant/models";
import { toast } from "sonner";
import { toTimestamp } from "@/common/utils/date";
import { Id } from "~/convex/_generated/dataModel";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  tenant: Tenant;
  building?: Building;
  task?: TaskWithRelations;
  mode: "create" | "edit";
}

export function TaskModal({
  isOpen,
  onClose,
  onSuccess,
  tenant,
  building,
  task,
  mode,
}: TaskModalProps) {
  const pathname = usePathname();
  const createTask = useMutation(api.tasks.createTask);
  const updateTask = useMutation(api.tasks.updateTask);

  const handleSubmit = async (state: FormState, formData: FormData) => {
    try {
      if (mode === "create") {
        // Extract form data for creation
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const priority = formData.get("priority") as string;
        const dueDate = formData.get("dueDate") as string;
        const buildingId = formData.get("buildingId") as string;
        const assigneeId = formData.get("assigneeId") as string;
        const categoryId = formData.get("categoryId") as string;

        await createTask({
          tenantId: tenant._id,
          title,
          description,
          priority,
          status: "pending",
          dueDate: dueDate ? toTimestamp(dueDate) : Date.now() + 7 * 24 * 60 * 60 * 1000, // Default to 7 days from now
          buildingId: buildingId ? buildingId as any : building?._id ? building._id as any : undefined,
          assigneeId: assigneeId ? assigneeId as any : undefined,
        });

        toast.success("Task created successfully");
      } else if (mode === "edit" && task) {
        // Extract form data for update
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const priority = formData.get("priority") as string;
        const status = formData.get("status") as string;
        const dueDate = formData.get("dueDate") as string;
        const buildingId = formData.get("buildingId") as string;
        const assigneeId = formData.get("assigneeId") as string;
        const categoryId = formData.get("categoryId") as string;

        await updateTask({
          taskId: task._id as any,
          title,
          description,
          priority,
          status,
          dueDate: dueDate ? toTimestamp(dueDate) : undefined,
          buildingId: buildingId ? buildingId as any : undefined,
          assigneeId: assigneeId ? assigneeId as any : undefined,
        });

        toast.success("Task updated successfully");
      }

      onSuccess?.();
      onClose();
      
      return {
        success: true,
        error: null,
      };
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Failed to save task");
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to save task",
      };
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <TaskForm
                  onSubmit={handleSubmit}
                  onCancel={onClose}
                  buildings={building ? [building] : []}
                  initialData={task ? {
                    title: task.title,
                    description: task.description,
                    priority: task.priority,
                    status: task.status,
                    dueDate: new Date(task.dueDate).toISOString().split('T')[0],
                    assigneeId: task.assigneeId,
                    buildingId: task.buildingId,
                  } : undefined}
                  mode={mode}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}