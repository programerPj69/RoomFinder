"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { registerUser, signIn, type UserType } from "@/lib/auth"

export function useAuthForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: "",
    phoneNumber: "",
    city: "",
    address: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegister = async (userType: UserType) => {
    setIsLoading(true)
    setAuthError(null)

    try {
      const { email, password, displayName, phoneNumber, city, address } = formData

      if (!email || !password || !displayName) {
        throw new Error("Please fill in all required fields")
      }

      const userData = await registerUser(email, password, userType, displayName, phoneNumber, city, address)

      // Check if there was a permission error but auth succeeded
      if (userData.error === "permission-denied") {
        setAuthError("Missing or insufficient permissions. Please check Firebase security rules.")

        toast({
          title: "Partial Registration Success",
          description: "Your account was created but we couldn't save all your information due to permission issues.",
          variant: "warning",
        })
      } else {
        toast({
          title: "Registration successful",
          description: "Your account has been created.",
        })
      }

      // Store user type in localStorage for immediate access
      localStorage.setItem("userType", userType)
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userEmail", email)

      // Redirect based on user type
      router.push(userType === "landlord" ? "/landlord" : "/tenant")
    } catch (error: any) {
      setAuthError(error.message)

      toast({
        title: "Registration failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async () => {
    setIsLoading(true)
    setAuthError(null)

    try {
      const { email, password } = formData

      if (!email || !password) {
        throw new Error("Please enter both email and password")
      }

      const userData = await signIn(email, password)

      // Check if there was a permission error but auth succeeded
      if (userData.error === "permission-denied") {
        setAuthError("Missing or insufficient permissions. Please check Firebase security rules.")

        toast({
          title: "Partial Login Success",
          description: "You're logged in but we couldn't retrieve all your information due to permission issues.",
          variant: "warning",
        })
      } else {
        toast({
          title: "Login successful",
          description: `Welcome back to RoomGroom!`,
        })
      }

      // Store user info in localStorage for immediate access
      localStorage.setItem("userType", userData.userType)
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userEmail", email)

      // Redirect based on user type
      router.push(userData.userType === "landlord" ? "/landlord" : "/tenant")
    } catch (error: any) {
      setAuthError(error.message)

      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    formData,
    isLoading,
    authError,
    handleChange,
    handleRegister,
    handleLogin,
  }
}
