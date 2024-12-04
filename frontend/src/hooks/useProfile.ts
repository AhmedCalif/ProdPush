import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { APIProfile, UpdateProfileInput} from '@/types/UserTypes';
import { api } from '@/lib/api';
import { getMe } from '@/lib/auth';

const profileKeys = {
  all: ['profile'] as const,
  details: () => [...profileKeys.all, 'details'] as const,
};

export function useProfile() {  
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    error,
    refetch
  } = useQuery<APIProfile>({
    queryKey: profileKeys.details(),
    queryFn: async () => {
      const response = await getMe();
      if (!response.data) {
        throw new Error('No profile found');
      }
      return response.data as APIProfile;
    },
  });

  const updateProfileMutation = useMutation<APIProfile, Error, UpdateProfileInput>({
    mutationFn: async (input) => {
      const response = await api.auth.me.$patch({
        json: input
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      return data.data;
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData<APIProfile>(profileKeys.details(), updatedProfile);
    },
  });

  return {
    profile,
    isLoading,
    error,
    refetch,
    updateProfile: updateProfileMutation.mutate,
    isUpdateProfilePending: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error,
  };
}
