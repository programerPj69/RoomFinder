import Link from "next/link"
import { Bath, Bed, Building2, Filter, Heart, MapPin, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AuthNav } from "@/components/auth-nav"
import { FirebasePermissionNotice } from "@/components/firebase-permission-notice"

export default function TenantDashboard() {
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

          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Find Your Perfect Room</h1>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input type="search" placeholder="Search by location, property type..." className="pl-8" />
                </div>
                <Button variant="outline" size="icon">
                  <MapPin className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <Select defaultValue="relevance">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="date-new">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Filters</h3>
                  <Button variant="ghost" size="sm" className="h-auto p-0 text-primary">
                    Reset
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Price Range</h4>
                    <Slider defaultValue={[500, 1500]} min={0} max={3000} step={100} />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">$500</span>
                      <span className="text-sm">$1,500</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Property Type</h4>
                    <div className="space-y-2">
                      {["Apartment", "House", "Studio", "Shared Room"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox id={`type-${type}`} />
                          <label
                            htmlFor={`type-${type}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Bedrooms</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Any", "1", "2", "3", "4+"].map((num) => (
                        <Button key={num} variant="outline" size="sm" className="min-w-[40px]">
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Bathrooms</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Any", "1", "2", "3+"].map((num) => (
                        <Button key={num} variant="outline" size="sm" className="min-w-[40px]">
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Amenities</h4>
                    <div className="space-y-2">
                      {["Air Conditioning", "Parking", "Washer/Dryer", "Pets Allowed", "Furnished", "Gym", "Pool"].map(
                        (amenity) => (
                          <div key={amenity} className="flex items-center space-x-2">
                            <Checkbox id={`amenity-${amenity}`} />
                            <label
                              htmlFor={`amenity-${amenity}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {amenity}
                            </label>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-span-3 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">42 Results</h2>
              </div>
              <Tabs defaultValue="grid">
                <div className="flex justify-end mb-4">
                  <TabsList className="grid w-[120px] grid-cols-2">
                    <TabsTrigger value="grid">Grid</TabsTrigger>
                    <TabsTrigger value="list">List</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="grid" className="mt-0">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="relative">
                          <img
                            src={`/placeholder.svg?height=200&width=400&text=Room ${i}`}
                            alt={`Room ${i}`}
                            className="w-full h-48 object-cover"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <CardTitle className="text-lg">${800 + i * 100}/month</CardTitle>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{4 + (i % 10) / 10}</span>
                            </div>
                          </div>
                          <CardDescription>
                            {i % 2 === 0 ? "Private Room" : "Entire Apartment"} • {(i % 3) + 1} bed
                            {i % 3 === 0 ? "" : "s"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPin className="h-3 w-3" />
                            <span>{i % 2 === 0 ? "Downtown" : i % 3 === 0 ? "Westside" : "Northside"}, City</span>
                          </div>
                          <div className="mt-2 flex gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs">
                              <Bed className="h-3 w-3" /> {(i % 3) + 1}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs">
                              <Bath className="h-3 w-3" /> {(i % 2) + 1}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs">
                              {i % 2 === 0 ? "Furnished" : "Unfurnished"}
                            </span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full">View Details</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="list" className="mt-0">
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Card key={i}>
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative sm:w-1/3">
                            <img
                              src={`/placeholder.svg?height=200&width=400&text=Room ${i}`}
                              alt={`Room ${i}`}
                              className="w-full h-48 sm:h-full object-cover"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex-1 p-4">
                            <div className="flex justify-between mb-2">
                              <h3 className="text-lg font-semibold">${800 + i * 100}/month</h3>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{4 + (i % 10) / 10}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">
                              {i % 2 === 0 ? "Private Room" : "Entire Apartment"} • {(i % 3) + 1} bed
                              {i % 3 === 0 ? "" : "s"}
                            </p>
                            <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                              <MapPin className="h-3 w-3" />
                              <span>{i % 2 === 0 ? "Downtown" : i % 3 === 0 ? "Westside" : "Northside"}, City</span>
                            </div>
                            <div className="flex gap-2 mb-4">
                              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs">
                                <Bed className="h-3 w-3" /> {(i % 3) + 1}
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs">
                                <Bath className="h-3 w-3" /> {(i % 2) + 1}
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs">
                                {i % 2 === 0 ? "Furnished" : "Unfurnished"}
                              </span>
                            </div>
                            <p className="text-sm mb-4">
                              A {i % 2 === 0 ? "cozy" : "spacious"} {(i % 3) + 1} bedroom{" "}
                              {i % 2 === 0 ? "apartment" : "house"} in a great location. Perfect for{" "}
                              {i % 2 === 0 ? "students" : "professionals"} looking for a comfortable living space.
                            </p>
                            <Button className="w-full sm:w-auto">View Details</Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex justify-center">
                <Button variant="outline">Load More</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
