
import { createFileRoute, Outlet, Link } from '@tanstack/react-router'
import { userQueryOptions } from '@/lib/api'
import WelcomePage from '@/components/WelcomePage'
import type { User } from '@/types/UserTypes'
import { Home, Calendar, FileText, Users } from 'lucide-react'

interface RouteContext {
  user: User | null
}


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
const AuthenticatedLayout = () => {
  const { user } = Route.useRouteContext() as RouteContext;

  if (!user) {
    return <WelcomePage />;
  }

   return (
    <div className="relative min-h-screen w-full">
      <div className="pb-20">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}


export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient
    try {
      const data = await queryClient.fetchQuery(userQueryOptions)
      return { user: data }
    } catch (e) {
      return { user: null }
    }
  },
  component: AuthenticatedLayout
})
