import Link from "next/link"
import { Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <Building2 className="h-6 w-6" />
          <span>RoomGroom</span>
        </Link>
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
      </header>
      <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
        <div className="max-w-6xl w-full mx-auto grid gap-6 md:grid-cols-2 lg:gap-12">
          <Card className="border-2 border-primary/20 shadow-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Register as a Landlord</CardTitle>
              <CardDescription>List your properties and find reliable tenants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-primary/10">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">As a landlord, you can:</h3>
                <ul className="text-sm text-gray-500 space-y-1 text-left list-disc list-inside">
                  <li>List multiple properties</li>
                  <li>Screen potential tenants</li>
                  <li>Manage lease agreements</li>
                  <li>Collect rent payments</li>
                  <li>Communicate with tenants</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/register/landlord" className="w-full">
                <Button className="w-full" size="lg">
                  Register as Landlord
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card className="border-2 border-primary/20 shadow-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Register as a Tenant</CardTitle>
              <CardDescription>Find your perfect room and connect with landlords</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-primary"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">As a tenant, you can:</h3>
                <ul className="text-sm text-gray-500 space-y-1 text-left list-disc list-inside">
                  <li>Search for available rooms</li>
                  <li>Filter by location and preferences</li>
                  <li>Schedule property viewings</li>
                  <li>Submit rental applications</li>
                  <li>Communicate with landlords</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/register/tenant" className="w-full">
                <Button className="w-full" size="lg">
                  Register as Tenant
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
