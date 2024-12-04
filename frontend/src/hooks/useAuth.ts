import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMe, login, logout, register } from '@/lib/auth';
import type { AuthData, LoginResponse} from '@/types/UserTypes';
import { type ApiSuccessResponse } from '@/types/ApiTypes';

export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  session: () => [...authKeys.all, 'session'] as const,
};



export function useAuth() {
  const queryClient = useQueryClient();

  const {
    data: auth,
    isLoading,
    error
  } = useQuery<AuthData>({
    queryKey: authKeys.user(),
    queryFn: async (): Promise<AuthData> => {
      try {
        const response = await getMe();
        if (!response.data || !response.success) {
          return {
            user: null,
            isAuthenticated: false
          };
        }
        return {
          user: response.data,
          isAuthenticated: true
        };
      } catch (error) {
        return {
          user: null,
          isAuthenticated: false
        };
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const loginMutation = useMutation<
    ApiSuccessResponse<LoginResponse>,
    Error,
    { email: string; password: string }
  >({
    mutationFn: async ({ email, password }) => {
      const response = await login(email, password);
      if (!response.success || !response.data) {
        throw new Error('Login failed');
      }
      return response as ApiSuccessResponse<LoginResponse>;
    },
    onSuccess: (response) => {
      queryClient.setQueryData<AuthData>(authKeys.user(), {
        user: response.data.user,
        isAuthenticated: true,
      });
    },
  });

  const registerMutation = useMutation<
    ApiSuccessResponse<LoginResponse>,
    Error,
    { email: string; password: string; name?: string }
  >({
    mutationFn: async ({ email, password, name }) => {
      const response = await register(email, password, name);
      if (!response.success || !response.data) {
        throw new Error('Registration failed');
      }
      return response as ApiSuccessResponse<LoginResponse>;
    },
    onSuccess: (response) => {
      queryClient.setQueryData<AuthData>(authKeys.user(), {
        user: response.data.user,
        isAuthenticated: true,
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData<AuthData>(authKeys.user(), {
        user: null,
        isAuthenticated: false,
      });
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });

  return {
    user: auth?.user ?? null,
    isAuthenticated: auth?.isAuthenticated ?? false,
    isLoading,
    error,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginPending: loginMutation.isPending,
    isRegisterPending: registerMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    logoutError: logoutMutation.error,
  };
}
