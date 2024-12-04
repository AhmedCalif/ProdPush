import { createFileRoute } from '@tanstack/react-router'
import { getMe } from '@/lib/auth'


export const Route = createFileRoute('/_authenicated/profile')({
  component: Profile
})


function Profile () {

}
