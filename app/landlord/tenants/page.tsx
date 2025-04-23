import Link from "next/link"
import { Building2, Download, Filter, Mail, Phone, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { AuthNav } from "@/components/auth-nav"

export default function TenantsPage() {
  // Sample tenant data
  const tenants = [
    {
      id: 1,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "(555) 123-4567",
      property: "123 Main St, Apt 101",
      leaseStart: "2025-01-15",
      leaseEnd: "2026-01-14",
      rent: 1200,
      status: "active",
    },
    {
      id: 2,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "(555) 987-6543",
      property: "456 Oak Ave, Unit 202",
      leaseStart: "2025-02-01",
      leaseEnd: "2026-01-31",
      rent: 1450,
      status: "active",
    },
    {
      id: 3,
      name: "Emily Johnson",
      email: "emily.j@example.com",
      phone: "(555) 234-5678",
      property: "789 Pine St, Apt 303",
      leaseStart: "2024-12-01",
      leaseEnd: "2025-11-30",
      rent: 1350,
      status: "active",
    },
    {
      id: 4,
      name: "Michael Brown",
      email: "michael.b@example.com",
      phone: "(555) 345-6789",
      property: "123 Main St, Apt 204",
      leaseStart: "2025-03-01",
      leaseEnd: "2026-02-28",
      rent: 1100,
      status: "pending",
    },
    {
      id: 5,
      name: "Sarah Wilson",
      email: "sarah.w@example.com",
      phone: "(555) 456-7890",
      property: "456 Oak Ave, Unit 105",
      leaseStart: "2024-11-15",
      leaseEnd: "2025-11-14",
      rent: 1550,
      status: "past",
    },
  ]

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
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Manage Tenants</h1>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button className="gap-2">
                <User className="h-4 w-4" />
                Add Tenant
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="Search tenants..." className="pl-8" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tenants</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="past">Past Tenants</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="list" className="space-y-4">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
            </TabsList>
            <TabsContent value="list" className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tenant</TableHead>
                        <TableHead>Property</TableHead>
                        <TableHead>Lease Period</TableHead>
                        <TableHead>Monthly Rent</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tenants.map((tenant) => (
                        <TableRow key={tenant.id}>
                          <TableCell>
                            <div className="font-medium">{tenant.name}</div>
                            <div className="text-sm text-gray-500">{tenant.email}</div>
                          </TableCell>
                          <TableCell>{tenant.property}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(tenant.leaseStart).toLocaleDateString()} -
                              {new Date(tenant.leaseEnd).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>${tenant.rent}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                tenant.status === "active"
                                  ? "default"
                                  : tenant.status === "pending"
                                    ? "outline"
                                    : "secondary"
                              }
                            >
                              {tenant.status === "active"
                                ? "Active"
                                : tenant.status === "pending"
                                  ? "Pending"
                                  : "Past Tenant"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Tenant Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Information</DropdownMenuItem>
                                <DropdownMenuItem>Message Tenant</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>View Lease</DropdownMenuItem>
                                <DropdownMenuItem>Payment History</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">End Lease</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="grid" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tenants.map((tenant) => (
                  <Card key={tenant.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{tenant.name}</CardTitle>
                        <Badge
                          variant={
                            tenant.status === "active"
                              ? "default"
                              : tenant.status === "pending"
                                ? "outline"
                                : "secondary"
                          }
                        >
                          {tenant.status === "active"
                            ? "Active"
                            : tenant.status === "pending"
                              ? "Pending"
                              : "Past Tenant"}
                        </Badge>
                      </div>
                      <CardDescription>{tenant.property}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{tenant.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{tenant.phone}</span>
                      </div>
                      <div className="pt-2">
                        <div className="text-sm font-medium">Lease Period</div>
                        <div className="text-sm text-gray-500">
                          {new Date(tenant.leaseStart).toLocaleDateString()} -
                          {new Date(tenant.leaseEnd).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Monthly Rent</div>
                        <div className="text-sm text-gray-500">${tenant.rent}</div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
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
