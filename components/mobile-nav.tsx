"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, Home, Search, Building, User, LogOut, Settings, Heart, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { safeLocalStorage } from "@/lib/browser-utils"

export function MobileNav() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Check if user is logged in on component mount
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
    setOpen(false)

    // Redirect to home page
    router.push("/")
  }

  // Don't render anything until client-side hydration is complete
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Menu</span>
      </Button>
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] max-w-[300px] p-0">
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center justify-between border-b">
            <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
              <Building className="h-5 w-5" />
              <span>RoomGroom</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-auto py-2">
            {!isLoggedIn && (
              <div className="px-2">
                <div className="flex flex-col gap-1">
                  <Link href="/" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <Home className="mr-2 h-4 w-4" />
                      Home
                    </Button>
                  </Link>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <User className="mr-2 h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <User className="mr-2 h-4 w-4" />
                      Register
                    </Button>
                  </Link>
                  <Link href="/about" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <Building className="mr-2 h-4 w-4" />
                      About
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {isLoggedIn && userType === "tenant" && (
              <div className="px-2">
                <div className="flex flex-col gap-1">
                  <Link href="/tenant" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <Home className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/tenant" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <Search className="mr-2 h-4 w-4" />
                      Find Rooms
                    </Button>
                  </Link>
                  <Link href="/tenant/map" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <Map className="mr-2 h-4 w-4" />
                      Map Search
                    </Button>
                  </Link>
                  <Link href="/tenant/saved" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <Heart className="mr-2 h-4 w-4" />
                      Saved
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {isLoggedIn && userType === "landlord" && (
              <div className="px-2">
                <div className="flex flex-col gap-1">
                  <Link href="/landlord" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <Home className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/landlord/properties" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <Building className="mr-2 h-4 w-4" />
                      My Properties
                    </Button>
                  </Link>
                  <Link href="/landlord/add-room" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <Search className="mr-2 h-4 w-4" />
                      Add Property
                    </Button>
                  </Link>
                  <Link href="/landlord/tenants" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <User className="mr-2 h-4 w-4" />
                      Tenants
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {isLoggedIn && (
            <div className="p-4 border-t">
              <div className="mb-2">
                <p className="text-sm font-medium">{userEmail}</p>
                <p className="text-xs text-gray-500 capitalize">{userType}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  href={userType === "tenant" ? "/tenant/profile" : "/landlord/settings"}
                  onClick={() => setOpen(false)}
                >
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </Link>
                <Button variant="destructive" size="sm" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
