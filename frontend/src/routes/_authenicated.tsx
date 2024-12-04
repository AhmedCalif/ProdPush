import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { userQueryOptions } from '@/lib/api'
import WelcomePage from '@/components/WelcomePage'

const RouteComponent = () => {
  return <Outlet />
}

export const Route = createFileRoute('/_authenicated')({
  beforeLoad: async ({ context, location }) => {
    const queryClient = context.queryClient

    try {
      const data = await queryClient.fetchQuery(userQueryOptions)
      if (!data.data?.email) {
        throw redirect({
          to: '/',
          search: {
            redirect: location.pathname,
          },
        })
      }
      return data
    } catch (e) {
      if (e instanceof Error) {
        throw redirect({
          to: '/',
          search: {
            redirect: location.pathname,
          },
        })
      }
      throw e
    }
  },
  component: RouteComponent,
})
