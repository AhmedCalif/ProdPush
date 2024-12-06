'use client'
import ProdPushLogo from '@/components/Logo'
import { Button } from "@/components/ui/button"
import { useAuth } from '@/hooks/useAuth'

export default function WelcomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-100 to-white">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        {!isAuthenticated ? (
          <div className="text-center space-y-8 max-w-2xl mx-auto">
            <div className="mx-auto w-32 h-32">
              <ProdPushLogo width={128} height={128} />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Welcome to ProdPush</h1>
              <p className="text-xl text-gray-600">Boost your productivity with ease</p>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">You are currently not logged in</p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/api/auth/login" className="w-full sm:w-auto">
                  <Button className="w-full" size="lg">
                    Log In
                  </Button>
                </a>
                <a href="/api/auth/register" className="w-full sm:w-auto">
                  <Button className="w-full" size="lg" variant="outline">
                    Sign Up
                  </Button>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="mx-auto w-32 h-32">
              <ProdPushLogo width={128} height={128} />
            </div>
            <h2 className="text-3xl font-bold">Welcome back!</h2>
            <p className="text-xl text-gray-600">You're all set to boost your productivity.</p>
            <a href="/dashboard">
              <Button size="lg">
                Go to Dashboard
              </Button>
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
