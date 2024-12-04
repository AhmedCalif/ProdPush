import { api } from "./api";
import {  type LoginResponse, type User, AuthError, type GetMeType, UpdateProfileInput , APIProfile} from "@/types/UserTypes";
import  { type ApiResponse } from "@/types/ApiTypes";




export async function login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
  try {
    const res = await api.auth.login.$get({
      json: { email, password }
    });
    if (!res.ok) {
      throw new AuthError('Login failed', res.status);
    }
    const data = await res.json() as LoginResponse;
    return {
      data,
      success: true,
      error: null
    };
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError('Login request failed');
  }
}

export async function register(email: string, password: string, name?: string): Promise<ApiResponse<LoginResponse>> {
  try {
    const res = await api.auth.register.$get({
      json: { email, password, name }
    });
    if (!res.ok) {
      throw new AuthError('Registration failed', res.status);
    }
    const data = await res.json() as LoginResponse;
    return {
      data,
      success: true,
      error: null
    };
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError('Registration request failed');
  }
}

export async function logout() {
  try {
    const res = await api.auth.logout.$get();
    if (!res.ok) {
      throw new AuthError('Logout failed', res.status);
    }
    return true;
  } catch (error) {
    throw new AuthError('Logout request failed');
  }
}

export async function getMe(): Promise<ApiResponse<User>> {
  try {
    const res = await api.auth.me.$get();
    if (!res.ok) {
      throw new AuthError('Failed to fetch user data', res.status);
    }
    const response = await res.json() as GetMeType;
    return {
      data: response.user,
      success: true,
      error: null
    };
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError('User data request failed');
  }
}


export async function updateProfile(input: UpdateProfileInput): Promise<ApiResponse<APIProfile>> {
    const res = await api.auth.me.$patch({
        json: input
    });

    if (!res.ok) {
        throw new AuthError('Failed to update profile', res.status);
    }

    const data = await res.json();
    return {
        success: true,
        data: data.data
    };
}
