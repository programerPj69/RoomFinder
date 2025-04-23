"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { safeLocalStorage } from "@/lib/browser-utils"
import { getFirebaseServices } from "@/lib/firebase"
import type { UserData } from "@/lib/auth"

interface AuthContextType {
  user: any | null
  userData: UserData | null
  loading: boolean
  permissionError: boolean
  usingFallbackData: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  permissionError: false,
  usingFallbackData: false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [permissionError, setPermissionError] = useState(false)
  const [usingFallbackData, setUsingFallbackData] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Mark component as mounted (client-side only)
    setMounted(true)

    // Skip Firebase auth initialization if not in browser
    if (typeof window === "undefined") {
      setLoading(false)
      return () => {}
    }

    let unsubscribe = () => {}
    let isMounted = true

    // Initialize Firebase Auth and set up auth state listener
    const initializeAuth = async () => {
      try {
        // Wait for Firebase services to be initialized
        const { auth } = await getFirebaseServices()

        if (!auth) {
          console.error("Firebase Auth not available")
          setLoading(false)
          return
        }

        // Import Firebase auth functions
        const { onAuthStateChanged } = await import("firebase/auth")

        // Set up auth state listener
        unsubscribe = onAuthStateChanged(auth, async (authUser) => {
          if (!isMounted) return

          setUser(authUser)

          if (authUser) {
            try {
              // Import getCurrentUser dynamically
              const { getCurrentUser } = await import("@/lib/auth")

              // Get additional user data from Firestore
              const userDoc = await getCurrentUser(authUser)

              if (!isMounted) return

              if (userDoc) {
                setUserData(userDoc)

                // Check if we're using fallback data
                if (userDoc.source === "fallback") {
                  console.log("Using fallback user data")
                  setUsingFallbackData(true)
                } else {
                  setUsingFallbackData(false)
                }

                // Check if there was a permission error
                if (userDoc.error) {
                  console.warn("Error detected in user data:", userDoc.error)
                  setPermissionError(true)
                } else {
                  setPermissionError(false)
                }
              } else {
                console.warn("No user data returned from getCurrentUser")
                setPermissionError(true)
                setUsingFallbackData(true)

                // Create minimal user data
                let userType = "tenant"
                const storedUserType = safeLocalStorage.getItem("userType")
                if (storedUserType) {
                  userType = storedUserType
                }

                setUserData({
                  uid: authUser.uid,
                  email: authUser.email || "",
                  displayName: authUser.displayName || "",
                  userType: userType as any,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  error: "no-user-data",
                  source: "fallback",
                })
              }
            } catch (error) {
              if (!isMounted) return

              console.error("Error in auth state change handler:", error)
              setPermissionError(true)
              setUsingFallbackData(true)

              // Create minimal user data to prevent app from breaking
              let userType = "tenant"
              const storedUserType = safeLocalStorage.getItem("userType")
              if (storedUserType) {
                userType = storedUserType as any
              }

              setUserData({
                uid: authUser.uid,
                email: authUser.email || "",
                displayName: authUser.displayName || "",
                userType: userType as any,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                error: "auth-provider-error",
                source: "fallback",
              })
            }
          } else {
            if (!isMounted) return
            setUserData(null)
            setPermissionError(false)
            setUsingFallbackData(false)
          }

          if (isMounted) {
            setLoading(false)
          }
        })
      } catch (error) {
        console.error("Error initializing Firebase Auth:", error)
        setLoading(false)
      }
    }

    // Initialize auth
    initializeAuth()

    return () => {
      isMounted = false
      if (typeof unsubscribe === "function") {
        unsubscribe()
      }
    }
  }, [])

  // For server-side rendering, provide default context values
  if (!mounted) {
    return (
      <AuthContext.Provider
        value={{
          user: null,
          userData: null,
          loading: true,
          permissionError: false,
          usingFallbackData: false,
        }}
      >
        {children}
      </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={{ user, userData, loading, permissionError, usingFallbackData }}>
      {children}
    </AuthContext.Provider>
  )
}
