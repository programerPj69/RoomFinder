"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FirebasePermissionNotice() {
  const [showAlert, setShowAlert] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Only show after a delay to avoid flashing during normal loading
    const timer = setTimeout(() => {
      setShowAlert(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (!showAlert) return null

  return (
    <Alert variant="warning" className="mx-6 mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Logged in with limited access</AlertTitle>
      <AlertDescription>
        <p>Some features may not be available due to database access issues.</p>

        {showDetails ? (
          <div className="mt-2 text-sm">
            <p>This is happening because:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>The app is having trouble connecting to the database</li>
              <li>This is likely due to Firebase security rules configuration</li>
              <li>The app will continue to function with basic features</li>
            </ul>
            <p className="mt-2">
              <strong>What you can do:</strong>
            </p>
            <ul className="list-disc pl-5 mt-1">
              <li>Continue using the app with limited functionality</li>
              <li>Try refreshing the page</li>
              <li>Contact support if the issue persists</li>
            </ul>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowDetails(false)}>
              Hide Details
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowDetails(true)}>
            Show Details
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
