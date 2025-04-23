"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, User, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SearchBar } from "@/components/search-bar"
import { MobileNav } from "@/components/mobile-nav"
import { safeLocalStorage } from "@/lib/browser-utils"

export function AuthNav() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Mark component as mounted
    setMounted(true)

    // Check if user is logged in
    const loggedIn = safeLocalStorage.getItem("isLoggedIn") === "true"
    const type = safeLocalStorage.getItem("userType")
    const email = safeLocalStorage.getItem("userEmail")

    setIsLoggedIn(loggedIn)
    setUserType(type)
    setUserEmail(email)
  }, [])

  const handleLogout = () => {
    // Clear user data from localStorage
    safeLocalStorage.removeItem("isLoggedIn")
    safeLocalStorage.removeItem("userType")
    safeLocalStorage.removeItem("userEmail")

    // Update state
    setIsLoggedIn(false)
    setUserType(null)
    setUserEmail(null)

    // Redirect to home page
    router.push("/")
  }

  // Don't render anything until client-side hydration is complete
  if (!mounted) {
    return (
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
          Login
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/register">
          Register
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/about">
          About
        </Link>
      </nav>
    )
  }

  if (!isLoggedIn) {
    return (
      <>
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <MobileNav />
        </div>

        {/* Desktop Navigation */}
        <nav className="ml-auto hidden md:flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Login
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/register">
            Register
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/about">
            About
          </Link>
        </nav>
      </>
    )
  }

  return (
    <div className="ml-auto flex items-center gap-4">
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <MobileNav />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <SearchBar />
      </div>

      {userType === "tenant" && (
        <nav className="hidden md:flex gap-4">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/tenant">
            Find Rooms
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/tenant/map">
            Map Search
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/tenant/saved">
            Saved
          </Link>
        </nav>
      )}

      {userType === "landlord" && (
        <nav className="hidden md:flex gap-4">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/landlord">
            Dashboard
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/landlord/properties">
            My Properties
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/landlord/tenants">
            Tenants
          </Link>
          <Link href="/landlord/add-room">
            <Button size="sm" variant="default" className="gap-1">
              <Plus className="h-4 w-4" />
              Add Property
            </Button>
          </Link>
        </nav>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full hidden md:flex">
            <User className="h-5 w-5" />
            <span className="sr-only">User menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span>{userEmail}</span>
              <span className="text-xs text-gray-500 capitalize">{userType}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={userType === "tenant" ? "/tenant/profile" : "/landlord/settings"}>Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
