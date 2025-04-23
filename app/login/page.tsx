"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { FirebasePermissionNotice } from "@/components/firebase-permission-notice"
import { useAuth } from "@/components/auth-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { WifiOff, AlertTriangle, Info } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPermissionError, setShowPermissionError] = useState(false)
  const [networkError, setNetworkError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [usingFallbackData, setUsingFallbackData] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { permissionError } = useAuth()

  // Check if the browser is online
  const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear previous errors
    setNetworkError(false)
    setErrorMessage("")
    setShowPermissionError(false)
    setUsingFallbackData(false)

    // Check if online before attempting login
    if (!isOnline) {
      setNetworkError(true)
      setErrorMessage("You appear to be offline. Please check your internet connection and try again.")
      return
    }

    setIsLoading(true)

    try {
      const userData = await signIn(email, password)

      // Store user info in localStorage for immediate access
      if (typeof window !== "undefined") {
        localStorage.setItem("userType", userData.userType)
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("userEmail", email)
      }

      // Check if we're using fallback data or have permission errors
      if (userData.source === "fallback" || userData.error) {
        console.warn("Login successful but using fallback data due to error:", userData.error)
        setShowPermissionError(true)
        setUsingFallbackData(true)

        toast({
          title: "Logged in with limited access",
          description: "Some features may not be available due to database access issues.",
          variant: "warning",
        })
      } else {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        })
      }

      // Redirect to dashboard even if there are permission errors
      // The user can still use parts of the app
      router.push(userData.userType === "landlord" ? "/landlord" : "/tenant")
    } catch (error: any) {
      console.error("Login error:", error)

      if (error.message?.includes("Network connection failed") || error.code === "auth/network-request-failed") {
        setNetworkError(true)
      } else if (error.message?.includes("permission") || error.code === "permission-denied") {
        setShowPermissionError(true)
      }

      setErrorMessage(error.message || "Please check your credentials and try again.")

      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>

        {(permissionError || showPermissionError) && <FirebasePermissionNotice />}

        {networkError && (
          <Alert variant="destructive" className="mx-6 mb-4">
            <WifiOff className="h-4 w-4" />
            <AlertTitle>Network Error</AlertTitle>
            <AlertDescription>
              <p>
                {errorMessage ||
                  "Unable to connect to authentication services. Please check your internet connection and try again."}
              </p>
              <p className="mt-2 text-sm">
                If the problem persists, please try:
                <ul className="list-disc pl-5 mt-1">
                  <li>Refreshing the page</li>
                  <li>Checking your firewall settings</li>
                  <li>Using a different network</li>
                </ul>
              </p>
            </AlertDescription>
          </Alert>
        )}

        {!isOnline && (
          <Alert variant="warning" className="mx-6 mb-4">
            <WifiOff className="h-4 w-4" />
            <AlertTitle>You're offline</AlertTitle>
            <AlertDescription>Please check your internet connection to continue.</AlertDescription>
          </Alert>
        )}

        {usingFallbackData && !showPermissionError && (
          <Alert className="mx-6 mb-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Limited Profile Access</AlertTitle>
            <AlertDescription>
              Your account was authenticated, but we couldn't access your full profile data. Some personalized features
              may be limited.
            </AlertDescription>
          </Alert>
        )}

        {errorMessage && !networkError && !showPermissionError && (
          <Alert variant="destructive" className="mx-6 mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Login Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading || !isOnline}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <p className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
