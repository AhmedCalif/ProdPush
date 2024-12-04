import { queryOptions } from "@tanstack/react-query"
import type { Task, CreateTaskInput, UpdateTaskInput, DeleteTaskInput } from '@/types/TasksType'
import type { ApiResponse } from '@/types/ApiTypes'
import { api } from "./api"

export async function getTasks(): Promise<ApiResponse<Task[]>> {
  const res = await api.tasks.$get()
  if (!res.ok) {
    return {
      success: false,
      data: null,
      error: "server error"
    }
  }
  const response = await res.json() as { data: Task[] }
  return {
    success: true,
    data: response.data,
    error: null
  }
}

export async function createTask(input: CreateTaskInput): Promise<ApiResponse<Task>> {
  const res = await api.tasks.$post({
    json: {
      title: input.title,
      description: input.description ?? null,
      projectId: input.projectId ?? null,
      assignedTo: input.assignedTo ?? null,
      status: input.status ?? null,
      priority: input.priority ?? null,
      dueDate: input.dueDate ?? null
    }
  })
  if (!res.ok) {
    return {
      success: false,
      data: null,
      error: "server error"
    }
  }
  const response = await res.json() as { data: Task }
  return {
    success: true,
    data: response.data,
    error: null
  }
}

export async function updateTask(input: UpdateTaskInput): Promise<ApiResponse<Task>> {
  const res = await api.tasks[':id'].$patch({
    param: { id: input.id.toString() },
    json: {
      title: input.title,
      description: input.description ?? null,
      projectId: input.projectId ?? null,
      assignedTo: input.assignedTo ?? null,
      status: input.status ?? null,
      priority: input.priority ?? null,
      dueDate: input.dueDate ?? null
    }
  })
  if (!res.ok) {
    return {
      success: false,
      data: null,
      error: "server error"
    }
  }
  const response = await res.json() as { data: Task }
  return {
    success: true,
    data: response.data,
    error: null
  }
}

export async function deleteTask(input: DeleteTaskInput): Promise<ApiResponse<void>> {
  const res = await api.tasks[':id'].$delete({
    param: { id: input.id.toString() }
  })
  if (!res.ok) {
    return {
      success: false,
      data: null,
      error: "server error"
    }
  }
  return {
    success: true,
    data: null,
    error: null
  }
}


export const getTasksQueryOptions = queryOptions({
  queryKey: ['tasks'],
  queryFn: getTasks,
  staleTime: 1000 * 60 * 5,
})

export const loadingCreateTaskQueryOptions = queryOptions<{
  task: CreateTaskInput | null
}>({
  queryKey: ['loading-create-task'],
  queryFn: async () => {
    return { task: null }
  },
  staleTime: Infinity,
})
