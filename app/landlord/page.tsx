import Link from "next/link"
import { Building2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthNav } from "@/components/auth-nav"
import { FirebasePermissionNotice } from "@/components/firebase-permission-notice"

export default function LandlordDashboard() {
  // Check if there was a permission error (in a real app, you'd get this from a server component or client state)
  const showPermissionError = true

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <Building2 className="h-6 w-6" />
          <span>RoomGroom</span>
        </Link>
        <AuthNav />
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {showPermissionError && <FirebasePermissionNotice />}

          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Landlord Dashboard</h1>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Property
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Properties</CardTitle>
                <CardDescription>Manage your listed properties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3</div>
              </CardContent>
              <CardFooter>
                <Link href="/landlord/properties">
                  <Button variant="ghost" size="sm">
                    View All Properties
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Applications</CardTitle>
                <CardDescription>Review tenant applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">7</div>
              </CardContent>
              <CardFooter>
                <Link href="/landlord/applications">
                  <Button variant="ghost" size="sm">
                    View All Applications
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Current Tenants</CardTitle>
                <CardDescription>Manage your current tenants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5</div>
              </CardContent>
              <CardFooter>
                <Link href="/landlord/tenants">
                  <Button variant="ghost" size="sm">
                    View All Tenants
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
          <Tabs defaultValue="properties">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="tenants">Tenants</TabsTrigger>
            </TabsList>
            <TabsContent value="properties" className="space-y-4">
              <h2 className="text-xl font-semibold">Recent Properties</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-0">
                      <img
                        src={`/placeholder.svg?height=200&width=400&text=Property ${i}`}
                        alt={`Property ${i}`}
                        className="w-full h-48 object-cover"
                      />
                    </CardContent>
                    <CardHeader className="pb-2">
                      <CardTitle>2 Bedroom Apartment</CardTitle>
                      <CardDescription>123 Main St, Apt {i}, City</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium">$1,{200 + i * 100}/month</p>
                      <p className="text-sm text-gray-500">Available Now</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button size="sm">View Details</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="applications" className="space-y-4">
              <h2 className="text-xl font-semibold">Recent Applications</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>John Doe</CardTitle>
                        <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Pending</span>
                      </div>
                      <CardDescription>Applied for: 2 Bedroom Apartment, 123 Main St</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        <span className="font-medium">Email:</span> john.doe{i}@example.com
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Phone:</span> (555) 123-456{i}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Applied on:</span> April {i + 10}, 2025
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="destructive" size="sm">
                        Reject
                      </Button>
                      <Button size="sm">Approve</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="tenants" className="space-y-4">
              <h2 className="text-xl font-semibold">Current Tenants</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>Jane Smith</CardTitle>
                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                      </div>
                      <CardDescription>Renting: 1 Bedroom Apartment, 456 Oak St</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        <span className="font-medium">Lease Start:</span> January {i}, 2025
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Lease End:</span> December {i + 10}, 2025
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Monthly Rent:</span> $1,{100 + i * 100}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        Message
                      </Button>
                      <Button size="sm">View Details</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
