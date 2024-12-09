import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createTask,
  deleteTask,
  getTasksQueryOptions,
  updateTask,
  getTasks
} from "@/lib/tasks"
import type { ApiResponse } from '@/types/ApiTypes';
import type { Task } from '@/types/TasksType';

export function useTasksQuery() {
 return useQuery<ApiResponse<Task[]>, Error>(getTasksQueryOptions);
}

export function useTasks() {
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await getTasks()
      if (!response.success) {
        throw new Error('Failed to fetch tasks')
      }
      return response.data
    }
  })

  return { tasks, isLoading, error }
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })
}
