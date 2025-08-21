import { apiRequest } from "@/lib/api";
import { ProjectData, ProjectResponse, ProjectListResponse } from "@/lib/typings";

export async function createProject(data:ProjectData): Promise<ProjectResponse> {
  return apiRequest<ProjectResponse>('POST', `/projects`, data);
}

export async function getAllProject(): Promise<{products: ProjectData[]}> {
  return apiRequest<{products: ProjectData[]}>('GET', `/projects`);
}

export async function getProjectByID(id: number): Promise<ProjectResponse> {
  return apiRequest<ProjectResponse>('GET', `/projects/${id}`);
}