"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function FirebaseAuthNotice({ errorMessage = "" }) {
  // Check if the error is related to network issues
  const isNetworkError = errorMessage.includes("network") || errorMessage.includes("connection")

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{isNetworkError ? "Network Error" : "Authentication Error"}</AlertTitle>
      <AlertDescription>
        {isNetworkError ? (
          <>
            <p>Unable to connect to authentication services. Please check your internet connection.</p>
            <p className="mt-2 font-medium">Troubleshooting steps:</p>
            <ol className="list-decimal pl-5 mt-1 space-y-1 text-sm">
              <li>Verify your internet connection is working</li>
              <li>Check if you're behind a firewall or VPN that might be blocking Firebase</li>
              <li>Try refreshing the page</li>
              <li>If the problem persists, try again later</li>
            </ol>
          </>
        ) : (
          <>
            <p>Email/password authentication is not enabled in your Firebase project.</p>
            <p className="mt-2 font-medium">To fix this issue:</p>
            <ol className="list-decimal pl-5 mt-1 space-y-1 text-sm">
              <li>
                Go to the Firebase console:{" "}
                <a
                  href="https://console.firebase.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  console.firebase.google.com
                </a>
              </li>
              <li>Select your project</li>
              <li>Click on "Authentication" in the left sidebar</li>
              <li>Go to the "Sign-in method" tab</li>
              <li>Click on "Email/Password" and enable it</li>
              <li>Save the changes</li>
              <li>Return to this page and try again</li>
            </ol>
          </>
        )}
      </AlertDescription>
    </Alert>
  )
}
