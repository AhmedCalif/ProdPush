"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, LogOut, Mail, MapPin, LinkIcon, Edit } from 'lucide-react'
import { useProfile } from "@/hooks/useProfile"
import { useNavigate } from "@tanstack/react-router"
import { useProjects } from "@/hooks/useProject"
import { useTasks } from "@/hooks/useTasks"
import { Skeleton } from "@/components/ui/skeleton"

export function ProfilePage() {
  const { profile } = useProfile()
  const { projects } = useProjects()
  const { tasks, isLoading: isLoadingTasks } = useTasks()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        navigate({ to: "/", replace: true })
      } else {
        console.error("Logout failed")
      }
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <Avatar className="h-24 w-24 rounded-full border-4 border-white">
              <AvatarImage src="/api/placeholder/128/128" alt={profile?.name} />
              <AvatarFallback>{profile?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white shadow-md"
            >
              <Camera className="h-4 w-4 text-blue-500" />
              <span className="sr-only">Change avatar</span>
            </Button>
          </div>
        </div>
        <CardContent className="pt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold">{profile?.name || "User Name"}</h1>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects?.length || 0}</div>
              </CardContent>
            </Card>
            <Card className="col-span-2 sm:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingTasks ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{tasks?.length || 0}</div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-500" />
              <span className="text-sm">{profile?.email || "user@example.com"}</span>
            </div>
            </div>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              variant="outline"
              className=" flex rounded-2xl bg-red-500 "
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
