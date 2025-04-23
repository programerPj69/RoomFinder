"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { safeLocalStorage } from "@/lib/browser-utils"

export function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Mark component as mounted
    setMounted(true)

    // Check if user is logged in
    const loggedIn = safeLocalStorage.getItem("isLoggedIn") === "true"
    const type = safeLocalStorage.getItem("userType")

    setIsLoggedIn(loggedIn)
    setUserType(type)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    // Redirect to the appropriate search page based on user type
    if (userType === "tenant") {
      router.push(`/tenant?search=${encodeURIComponent(query)}`)
    } else if (userType === "landlord") {
      router.push(`/landlord/properties?search=${encodeURIComponent(query)}`)
    }
  }

  // Don't render anything until client-side hydration is complete
  if (!mounted || !isLoggedIn) {
    return null
  }

  return (
    <form onSubmit={handleSearch} className="relative flex w-full max-w-sm items-center">
      <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        type="search"
        placeholder={userType === "tenant" ? "Search for rooms..." : "Search your properties..."}
        className="pl-8 pr-10"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit" size="sm" variant="ghost" className="absolute right-0 top-0 h-full px-3">
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  )
}
