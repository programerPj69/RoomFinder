"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

export function EmulatorNotice() {
  const [showNotice, setShowNotice] = useState(false)

  useEffect(() => {
    // Check if emulators are being used
    const useEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true"
    setShowNotice(useEmulators)

    // Auto-hide after 10 seconds
    if (useEmulators) {
      const timer = setTimeout(() => {
        setShowNotice(false)
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [])

  if (!showNotice) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Alert variant="warning">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Firebase Emulators Active</AlertTitle>
        <AlertDescription>
          You are using local Firebase emulators. Data will not be saved to production.
        </AlertDescription>
      </Alert>
    </div>
  )
}
