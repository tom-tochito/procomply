"use server";

import { revalidatePath } from "next/cache";
import { createTask as createTaskRepo, updateTask as updateTaskRepo } from "@/features/tasks/repository/tasks.repository";
import { FormState } from "@/common/types/form";

export async function createTaskAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;
  const status = formData.get("status") as string;
  const dueDate = formData.get("dueDate") as string;
  const assigneeId = formData.get("assigneeId") as string;
  const buildingId = formData.get("buildingId") as string;
  const tenantId = formData.get("tenantId") as string;
  const tenantSlug = formData.get("tenantSlug") as string;

  if (!title || !priority || !status || !dueDate || !tenantId) {
    return { error: "Please fill in all required fields", success: false };
  }

  try {
    await createTaskRepo({
      title,
      description,
      status,
      priority,
      dueDate,
      buildingId: buildingId || undefined,
      assigneeId: assigneeId || undefined,
      tenantId,
    });

    // Revalidate relevant paths
    if (tenantSlug) {
      revalidatePath(`/tenant/${tenantSlug}/data-mgmt/task`);
      revalidatePath(`/tenant/${tenantSlug}/buildings`);
      if (buildingId) {
        revalidatePath(`/tenant/${tenantSlug}/buildings/${buildingId}`);
      }
    }

    return { error: null, success: true };
  } catch (error) {
    console.error("Error creating task:", error);
    return { error: "Failed to create task. Please try again.", success: false };
  }
}

export async function updateTaskAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const taskId = formData.get("taskId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;
  const status = formData.get("status") as string;
  const dueDate = formData.get("dueDate") as string;
  const assigneeId = formData.get("assigneeId") as string;
  const buildingId = formData.get("buildingId") as string;
  const tenantSlug = formData.get("tenantSlug") as string;

  if (!taskId || !title || !priority || !status || !dueDate) {
    return { error: "Please fill in all required fields", success: false };
  }

  try {
    const updates: Parameters<typeof updateTaskRepo>[1] = {
      title,
      description,
      status,
      priority,
      dueDate,
    };

    if (assigneeId !== undefined) {
      updates.assigneeId = assigneeId;
    }

    if (status === "completed") {
      updates.completedDate = Date.now().toString();
    }

    await updateTaskRepo(taskId, updates);

    // Revalidate relevant paths
    if (tenantSlug) {
      revalidatePath(`/tenant/${tenantSlug}/data-mgmt/task`);
      revalidatePath(`/tenant/${tenantSlug}/buildings`);
      if (buildingId) {
        revalidatePath(`/tenant/${tenantSlug}/buildings/${buildingId}`);
      }
    }

    return { error: null, success: true };
  } catch (error) {
    console.error("Error updating task:", error);
    return { error: "Failed to update task. Please try again.", success: false };
  }
}