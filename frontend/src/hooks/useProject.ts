import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from"@/lib/projects"
import type {
  CreateProjectInput,
  UpdateProjectInput,
  DeleteProjectInput,
} from '@/types/ProjectTypes';
import { ApiResponse } from '@/types/ApiTypes';
import type { Project } from '@/types/ProjectTypes';

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all] as const,
  list: (filters: string) => [...projectKeys.lists(), { filters }] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: number) => [...projectKeys.details(), id] as const,
};


export function useProjects() {
  const queryClient = useQueryClient();

  const { data: projects, isLoading, error } = useQuery({
    queryKey: projectKeys.lists(),
    queryFn: async () => {
      const response = await getProjects();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch projects');
      }
      return response.data;
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: (newProject: CreateProjectInput) => createProject(newProject),
    onError: (error: Error) => {
      console.error("Create project error:", error);
      return error;
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      }
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: (updateData: UpdateProjectInput) => updateProject(updateData),
    onSuccess: (response) => {
      if (response.success && response.data) {
        queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      }
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (deleteData: DeleteProjectInput) => deleteProject(deleteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });

  return {
    projects,
    isLoading,
    error,
    createProject: createProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    deleteProject: deleteProjectMutation.mutate,
    isCreating: createProjectMutation.isPending,
    isUpdating: updateProjectMutation.isPending,
    isDeleting: deleteProjectMutation.isPending,
    createError: createProjectMutation.error,
    updateError: updateProjectMutation.error,
    deleteError: deleteProjectMutation.error,
  };
}

export function useProject(id: number) {
  const queryClient = useQueryClient();

  const { data: project, isLoading, error } = useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: async () => {
      const response = await getProjectById(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch project');
      }
      return response.data;
    },
    enabled: !!id,
  });

  const updateProjectMutation = useMutation({
    mutationFn: (updateData: UpdateProjectInput) => updateProject(updateData),
    onSuccess: (response: ApiResponse<Project>) => {
      if (response.success && response.data) {
        queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      }
    },
  });

 const deleteProjectMutation = useMutation({
    mutationFn: (deleteData: DeleteProjectInput) => deleteProject(deleteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });

  return {
    project,
    isLoading,
    error,
    updateProject: updateProjectMutation.mutate,
    deleteProject: deleteProjectMutation.mutate,
    isUpdating: updateProjectMutation.isPending,
    isDeleting: deleteProjectMutation.isPending,
    updateError: updateProjectMutation.error,
    deleteError: deleteProjectMutation.error,
  };
}
