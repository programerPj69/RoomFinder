"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineAlert, setShowOfflineAlert] = useState(false)

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return

    // Set initial state
    setIsOnline(navigator.onLine)

    // Define event handlers
    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineAlert(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineAlert(true)
    }

    // Add event listeners
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Clean up
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Hide the offline alert after 5 seconds
  useEffect(() => {
    if (!isOnline) {
      const timer = setTimeout(() => {
        setShowOfflineAlert(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isOnline])

  // Show the alert when we go offline
  if (showOfflineAlert && !isOnline) {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-md">
        <Alert variant="destructive">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>You are currently offline. Some features may not work properly.</AlertDescription>
        </Alert>
      </div>
    )
  }

  // Show a small indicator in the corner when back online
  if (isOnline && showOfflineAlert === false) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-green-100 text-green-800 p-2 rounded-full shadow-md">
          <Wifi className="h-4 w-4" />
        </div>
      </div>
    )
  }

  return null
}
