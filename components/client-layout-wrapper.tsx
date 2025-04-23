"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AuthProvider } from "./auth-provider"
import { NetworkStatus } from "./network-status"
import { EmulatorNotice } from "./emulator-notice"

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // Only show the UI after first client-side render
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <AuthProvider>
      {children}
      {mounted && (
        <>
          <NetworkStatus />
          <EmulatorNotice />
        </>
      )}
    </AuthProvider>
  )
}
