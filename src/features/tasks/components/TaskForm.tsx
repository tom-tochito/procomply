"use client";

import { useActionState } from "react";
import { FormState } from "@/common/types/form";
import { Building } from "@/features/buildings/models";

interface TaskFormProps {
  onSubmit: (prevState: FormState, formData: FormData) => Promise<FormState>;
  buildings?: Building[];
  users?: Array<{ id: string; email: string }>;
  initialData?: {
    title?: string;
    description?: string;
    priority?: string;
    dueDate?: string;
    status?: string;
    assigneeId?: string;
    buildingId?: string;
  };
  mode?: "create" | "edit";
  onCancel?: () => void;
}

export function TaskForm({ 
  onSubmit, 
  buildings = [], 
  users = [],
  initialData,
  mode = "create",
  onCancel
}: TaskFormProps) {
  const [state, formAction, isPending] = useActionState(onSubmit, {
    error: null,
    success: false,
  });

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
          {state.error}
        </div>
      )}

      {/* Basic Information Section */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold mb-4">Task Information</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={initialData?.title}
              required
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={initialData?.description}
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>
        </div>
      </div>

      {/* Task Details Section */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold mb-4">Task Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority *
            </label>
            <select
              id="priority"
              name="priority"
              defaultValue={initialData?.priority || "medium"}
              required
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              id="status"
              name="status"
              defaultValue={initialData?.status || "pending"}
              required
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date *
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              defaultValue={initialData?.dueDate?.split('T')[0]}
              required
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            />
          </div>

          <div>
            <label htmlFor="assigneeId" className="block text-sm font-medium text-gray-700 mb-1">
              Assignee
            </label>
            <select
              id="assigneeId"
              name="assigneeId"
              defaultValue={initialData?.assigneeId}
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="buildingId" className="block text-sm font-medium text-gray-700 mb-1">
              Building
            </label>
            <select
              id="buildingId"
              name="buildingId"
              defaultValue={initialData?.buildingId}
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F30] focus:border-[#F30]"
            >
              <option value="">No building</option>
              {buildings.map((building) => (
                <option key={building._id} value={building._id}>
                  {building.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F30] disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#F30] hover:bg-[#E20] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F30] disabled:opacity-50"
        >
          {isPending ? "Saving..." : mode === "create" ? "Create Task" : "Update Task"}
        </button>
      </div>
    </form>
  );
}