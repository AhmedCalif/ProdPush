import {
  createKindeServerClient,
  GrantType,
  type SessionManager,
  type UserType,
} from "@kinde-oss/kinde-typescript-sdk";
import { type Context } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import dotenv from "dotenv";


dotenv.config();


const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
  authDomain: process.env.VITE_KINDE_DOMAIN as string,
  clientId: process.env.VITE_KINDE_CLIENT_ID as string,
  clientSecret: process.env.VITE_KINDE_CLIENT_SECRET as string,
  redirectURL: process.env.VITE_KINDE_REDIRECT_URI as string,
  logoutRedirectURL: process.env.VITE_KINDE_LOGOUT_URI as string
});


const kindeApiClient = createKindeServerClient(GrantType.CLIENT_CREDENTIALS, {
  authDomain: process.env.VITE_KINDE_DOMAIN as string,
  clientId: process.env.VITE_KINDE_CLIENT_ID as string,
  clientSecret: process.env.VITE_KINDE_CLIENT_SECRET as string,
  logoutRedirectURL: process.env.VITE_KINDE_LOGOUT_URI as string
});

export const sessionManager = (c: Context): SessionManager => ({
  async getSessionItem(key: string) {
    const result = getCookie(c, key);
    return result;
  },
  async setSessionItem(key: string, value: unknown) {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    } as const;
    if (typeof value === "string") {
      setCookie(c, key, value, cookieOptions);
    } else {
      setCookie(c, key, JSON.stringify(value), cookieOptions);
    }
  },
  async removeSessionItem(key: string) {
    deleteCookie(c, key);
  },
  async destroySession() {
    ["id_token", "access_token", "user", "refresh_token"].forEach((key) => {
      deleteCookie(c, key);
    });
  },
});

type Env = {
  Variables: {
    user: UserType;
  };
};


export const getUser = createMiddleware<Env>(async (c, next) => {
  try {
    const manager = sessionManager(c);
    const isAuthenticated = await kindeClient.isAuthenticated(manager);

    if (isAuthenticated) {
      const user = await kindeClient.getUserProfile(manager);
      c.set("user", user);
    }

    await next();
  } catch (e) {
    console.error(e);
    await next();
  }
});


export { kindeClient, kindeApiClient };
