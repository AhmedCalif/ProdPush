import { ApiRoutes } from "../../../server/app"
import { hc } from "hono/client"
import { queryOptions } from "@tanstack/react-query";
import { getMe } from "./auth";


const client = hc<ApiRoutes>("http://localhost:5173/", {
  fetch: (input: URL | RequestInfo, init?: RequestInit) => {
    const config = {
      ...init,
      credentials: 'include' as const,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    return fetch(input, config);

  }
});

export const api = client.api;



export const userQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getMe,
  staleTime: Infinity,
});
