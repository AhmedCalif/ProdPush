import { useQuery } from '@tanstack/react-query';
import type { APIProfile}  from '@/types/UserTypes';

import { getMe } from '@/lib/auth';

const profileKeys = {
  all: ['profile'] as const,
  details: () => [...profileKeys.all, 'details'] as const,
};

export function useProfile() {

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
  return {
    profile,
    isLoading,
    error,
    refetch,
  };
}
