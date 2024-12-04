import {
  createRootRouteWithContext,
  Outlet,
  Link
} from "@tanstack/react-router";
import { type QueryClient } from "@tanstack/react-query"
import NavBar from "@/components/NavBar";



interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});


function Root() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <div className="flex flex-1 flex-col pt-6"> 
        <main className="w-screen">
          <Outlet />
        </main>
      </div>
      <footer className="bg-gray-800 text-white w-full p-4">
        <div className="max-w-7xl mx-auto">
          © 2024 ProdPush
        </div>
      </footer>
    </div>
  );
}
