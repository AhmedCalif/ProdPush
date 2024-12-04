import {
  createRootRouteWithContext,
  Outlet,
  Link
} from "@tanstack/react-router";
import { type QueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button";
import { Home, Calendar, FileText, Users} from "lucide-react"



interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});

export function Root() {
  return (
    <>
      <div className="flex-1 flex flex-col items-center justify-start w-full">
        <Outlet />
      </div>
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-pink-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-around py-2">
            <Link to="/" className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-purple-500">
              <Home className="h-8 w-8" />
              <span className="text-xs font-medium">Home</span>
            </Link>
            <Link to="/" className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-purple-500">
              <Calendar className="h-8 w-8" />
              <span className="text-xs font-medium">Calendar</span>
            </Link>
            <div className="relative">
              <Link to="/">
                <Button size="lg" className="h-16 w-16 rounded-full bg-purple-500 hover:bg-purple-600 text-white absolute -top-8 left-1/2 -translate-x-1/2 shadow-lg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Button>
              </Link>
            </div>
            <Link to="/tasks" className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-purple-500">
              <FileText className="h-8 w-8" />
              <span className="text-xs font-medium">Tasks</span>
            </Link>
            <Link to="/profile" className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-purple-500">
              <Users className="h-8 w-8" />
              <span className="text-xs font-medium">Profile</span>
            </Link>
          </div>
        </div>
      </nav>
      <div className="fixed bottom-0 left-0 right-0 text-center text-xs text-gray-400 pb-20">
        &copy; 2024 ProdPush
      </div>
    </>
  );
}
