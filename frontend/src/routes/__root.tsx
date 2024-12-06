import {
  createRootRouteWithContext,
  Outlet,
  Link,
} from "@tanstack/react-router";
import { type QueryClient } from "@tanstack/react-query";
import { Home, Calendar, FileText, Users } from "lucide-react";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});



function Root() {
  return (
    <div className="flex flex-col w-screen min-h-screen">
      <div className="flex-1 flex flex-col pb-16">
        <Outlet />
      </div>
    </div>
  );
}
