import {
  createRootRouteWithContext,
  Outlet,
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


function Root() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-blue-50">
      <div className="flex-1 pb-20">
        <main className="w-full">
          <Outlet />
        </main>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-pink-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-around py-4">
            <Button variant="ghost" size="icon" className="text-gray-400 bg-white hover:text-purple-500">
              <Home className="h-10 w-10" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 bg-white hover:text-purple-500">
              <Calendar className="h-10 w-10" />
            </Button>
            <div className="w-12" />
            <Button variant="ghost" size="icon" className="text-gray-400 bg-white hover:text-purple-500">
              <FileText className="h-10 w-10" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 bg-white hover:text-purple-500">
              <Users className="h-10 w-10" />
            </Button>
          </div>
        </div>
      </nav>
      <div className="fixed bottom-0 left-0 right-0 text-center text-xs text-gray-400 pb-20">
        © 2024 ProdPush
      </div>
    </div>
  );
}
