'use client'
import ProdPushLogo from '@/components/Logo'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from '@/hooks/useAuth'

export default function WelcomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <>
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-24 h-24 mb-4">
            <ProdPushLogo width={96} height={96} />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to ProdPush</CardTitle>
          <CardDescription>Boost your productivity with ease</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isAuthenticated ? (
            <a href="/api/auth/login">
            <Button
              className="w-full"
            >
              Sign Up
            </Button>
            </a>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
              <p>You're all set to boost your productivity.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </CardFooter>
      </Card>
    </div>
    </>
  )
}
