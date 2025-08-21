import { apiRequest } from "@/lib/api";
import { TaskData, TaskResponse } from "@/lib/typings";

export async function createTask(data: TaskData): Promise<TaskResponse> {
  return await apiRequest<TaskResponse>('POST', `/tasks`, data);
}

export async function getAllTask(): Promise<TaskData[]> {
  return await apiRequest<TaskData[]>('POST',`/tasks`);
}