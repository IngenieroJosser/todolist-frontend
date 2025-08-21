import { apiRequest } from "@/lib/api";
import { ProjectData, ProjectResponse, TaskResponse } from "@/lib/typings";

export async function createProject(data:ProjectData): Promise<TaskResponse> {
  return apiRequest<TaskResponse>('POST', `/projects`, data);
}

export async function getAllProject(): Promise<TaskResponse[]> {
  return apiRequest<TaskResponse[]>('POST', `/tasks`);
}

export async function getProjectByID(id: number): Promise<TaskResponse> {
  return apiRequest<TaskResponse>('POST', `/tasks/${id}`);
}