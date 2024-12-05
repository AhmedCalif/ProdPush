import type { ApiResponse } from '@/types/ApiTypes';
import { api } from "../lib/api";
import {
  CreateProjectInput,
  DeleteProjectInput,
  UpdateProjectInput,
  type Project
} from "@/types/ProjectTypes";

export async function getProjects(): Promise<ApiResponse<Project[]>> {
    const res = await api.projects.$get();

    if (!res.ok) {
        return {
            success: false,
            data: null,
            error: "Failed to fetch projects"
        };
    }

    try {
        const responseData = await res.json();
        return responseData as ApiResponse<Project[]>;
    } catch (error) {
        return {
            success: false,
            data: null,
            error: "Failed to parse project data"
        };
    }
}

export async function getProjectById(id: number): Promise<ApiResponse<Project>> {
    const res = await api.projects[':id'].$get({
        param: { id: id.toString() }
    });

    if (!res.ok) {
        return {
            success: false,
            data: null,
            error: "Failed to fetch project"
        };
    }

    try {
        const responseData = await res.json();
        return responseData as ApiResponse<Project>;
    } catch (error) {
        return {
            success: false,
            data: null,
            error: "Failed to parse project data"
        };
    }
}

export async function createProject(input: CreateProjectInput): Promise<ApiResponse<Project>> {
    const res = await api.projects.$post({
        json: {
            name: input.name,
            description: input.description,
            ownerId: input.ownerId,
            status: input.status,
            dueDate: input.dueDate ? input.dueDate.toISOString() : null
        }
    });

    if (!res.ok) {
        return {
            success: false,
            data: null,
            error: "Failed to create project"
        };
    }

    try {
        const responseData = await res.json();
        return responseData as ApiResponse<Project>;
    } catch (error) {
        return {
            success: false,
            data: null,
            error: "Failed to parse created project data"
        };
    }
}

export async function updateProject(input: UpdateProjectInput): Promise<ApiResponse<Project>> {
    const updateData: Partial<Project> = {
        name: input.name,
        description: input.description,
        ownerId: input.ownerId,
        status: input.status,
        dueDate: input.dueDate ? input.dueDate.toISOString() : null
    };

    const res = await api.projects[':id'].$patch({
        param: { id: input.id.toString() },
        json: updateData
    });

    if (!res.ok) {
        return {
            success: false,
            data: null,
            error: "Failed to update project"
        };
    }

    try {
        const responseData = await res.json();
        return responseData as ApiResponse<Project>;
    } catch (error) {
        return {
            success: false,
            data: null,
            error: "Failed to parse updated project data"
        };
    }
}

export async function deleteProject(input: DeleteProjectInput): Promise<ApiResponse<null>> {
    const res = await api.projects[':id'].$delete({
        param: { id: input.id.toString() }
    });

    if (!res.ok) {
        return {
            success: false,
            data: null,
            error: "Failed to delete project"
        };
    }

    return {
        success: true,
        data: null,
        error: null
    };
}
