import type { User } from "./UserTypes";

export interface ApiResponse<T> {
  success: boolean;
  data?: T | null;
  error?: string | null;
}

export interface CreateUserInput {
  email: string;
  given_name: string;
  family_name: string;
}

export interface ApiSuccessResponse<T> {
  success: true
  data: T
  error?: never
}

export interface ApiErrorResponse {
  success: false
  data?: never
  error: string
}
export type HelperApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

export interface AuthResponse {
  user: User;
  isAuthenticated: boolean;
}
