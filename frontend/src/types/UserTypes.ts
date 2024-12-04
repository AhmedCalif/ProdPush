
export interface User {
    id: string;
    sub: string;
    name: string;
    email: string;
    picture: string | null;
    given_name: string;
    family_name: string;
    updated_at: number;
    email_verified: number;
    preferred_username: string | null;
    createdAt: number;
}

export type AuthHono = {
  '/api/auth/login': {
    get: {
      output: void
    }
  }
  '/api/auth/register': {
    get: {
      output: void
    }
  }
  '/api/auth/callback': {
    get: {
      output: void
    }
  }
  '/api/auth/logout': {
    get: {
      output: void
    }
  }
  '/api/auth/me': {
    get: {
      output: {
        isAuthenticated: boolean
        error?: string
      }
    }
  }
}

export interface AuthData {
  user: User | null;
  isAuthenticated: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface GetMeType {
  user: User;
  isAuthenticated: boolean;
}


export class AuthError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'AuthError';
  }
}
