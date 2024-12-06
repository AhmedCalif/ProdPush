
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { userQueryOptions } from '@/lib/api'
import WelcomePage from '@/components/WelcomePage'
import type { User } from '@/types/UserTypes'

interface RouteContext {
  user: User | null
}
const AuthenticatedLayout = () => {
  const { user } = Route.useRouteContext() as RouteContext;

  if (!user) {
    return <WelcomePage />;
  }

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-2xl px-4">
        <Outlet />
      </div>
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
