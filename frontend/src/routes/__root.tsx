import {
  createRootRouteWithContext,
  Outlet,
  Link
} from "@tanstack/react-router";
import { type QueryClient } from "@tanstack/react-query"
import NavBar from "@/components/NavBar";
import { useAuth } from "@/hooks/useAuth";



interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});



function Root() {
  const {user} = useAuth()
  return (
      <>
       <NavBar />
          <main className="flex-1 p-2 m-auto min-h-screen w-screen max-w-7xl">
            <Outlet />

          </main>

          <footer className="bg-gray-800 text-white w-screen p-4 mt-auto">
            <div className="max-w-7xl mx-auto">
              {user?.given_name}
            </div>
          </footer>
      </>
    )
  }
