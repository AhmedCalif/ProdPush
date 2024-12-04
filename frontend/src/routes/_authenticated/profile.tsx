import { createFileRoute } from '@tanstack/react-router'
import { getMe } from '@/lib/auth'
import { ProfilePage } from '@/components/ProfilePage'

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
  beforeLoad: async () => {
    const user = await getMe()
    return { user }
  },
})
