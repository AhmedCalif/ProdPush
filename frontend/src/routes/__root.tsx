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

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-pink-100">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-around py-1">
          <Link
            to="/"
            className="flex flex-col items-center gap-0.5 p-1 text-gray-400 hover:text-purple-500"
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link
            to="/projects"
            className="flex flex-col items-center gap-0.5 p-1 text-gray-400 hover:text-purple-500"
          >
            <Calendar className="h-5 w-5" />
            <span className="text-[10px] font-medium">Projects</span>
          </Link>
          <Link
            to="/tasks"
            className="flex flex-col items-center gap-0.5 p-1 text-gray-400 hover:text-purple-500"
          >
            <FileText className="h-5 w-5" />
            <span className="text-[10px] font-medium">Tasks</span>
          </Link>
          <Link
            to="/profile"
            className="flex flex-col items-center gap-0.5 p-1 text-gray-400 hover:text-purple-500"
          >
            <Users className="h-5 w-5" />
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        </div>
      </div>
      <div className="text-center text-[10px] text-gray-400 pb-2">
        &copy; 2024 ProdPush
      </div>
    </nav>
  );
}

function Root() {
  return (
    <div className="flex flex-col w-screen min-h-screen">
      <div className="flex-1 flex flex-col pb-16">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
