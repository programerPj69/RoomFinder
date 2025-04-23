"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Building2, Filter, MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AuthNav } from "@/components/auth-nav"

// Mock property data
const properties = [
  {
    id: 1,
    title: "Spacious 1BHK in Koramangala",
    type: "apartment",
    price: 15000,
    city: "Bangalore",
    location: { lat: 12.9352, lng: 77.6245 },
    image: "/placeholder.svg?height=200&width=400&text=Koramangala",
  },
  {
    id: 2,
    title: "Single Room in Indiranagar",
    type: "private",
    price: 8000,
    city: "Bangalore",
    location: { lat: 12.9784, lng: 77.6408 },
    image: "/placeholder.svg?height=200&width=400&text=Indiranagar",
  },
  {
    id: 3,
    title: "2BHK Apartment in Powai",
    type: "apartment",
    price: 25000,
    city: "Mumbai",
    location: { lat: 19.1176, lng: 72.906 },
    image: "/placeholder.svg?height=200&width=400&text=Powai",
  },
  {
    id: 4,
    title: "Studio Apartment in HSR Layout",
    type: "studio",
    price: 12000,
    city: "Bangalore",
    location: { lat: 12.9116, lng: 77.6741 },
    image: "/placeholder.svg?height=200&width=400&text=HSR+Layout",
  },
  {
    id: 5,
    title: "Shared Room in Andheri",
    type: "shared",
    price: 6000,
    city: "Mumbai",
    location: { lat: 19.1136, lng: 72.8697 },
    image: "/placeholder.svg?height=200&width=400&text=Andheri",
  },
  {
    id: 6,
    title: "3BHK Villa in Whitefield",
    type: "house",
    price: 35000,
    city: "Bangalore",
    location: { lat: 12.9698, lng: 77.7499 },
    image: "/placeholder.svg?height=200&width=400&text=Whitefield",
  },
  {
    id: 7,
    title: "PG Accommodation in Kormangala",
    type: "shared",
    price: 7500,
    city: "Bangalore",
    location: { lat: 12.9347, lng: 77.6205 },
    image: "/placeholder.svg?height=200&width=400&text=Kormangala+PG",
  },
  {
    id: 8,
    title: "Luxury Apartment in Bandra",
    type: "apartment",
    price: 45000,
    city: "Mumbai",
    location: { lat: 19.0596, lng: 72.8295 },
    image: "/placeholder.svg?height=200&width=400&text=Bandra",
  },
]

// Major Indian cities with coordinates
const indianCities = [
  { name: "All Cities", lat: 20.5937, lng: 78.9629, zoom: 5 }, // Center of India
  { name: "Mumbai", lat: 19.076, lng: 72.8777, zoom: 11 },
  { name: "Delhi", lat: 28.7041, lng: 77.1025, zoom: 11 },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946, zoom: 11 },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867, zoom: 11 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707, zoom: 11 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639, zoom: 11 },
  { name: "Pune", lat: 18.5204, lng: 73.8567, zoom: 11 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, zoom: 11 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873, zoom: 11 },
]

export default function MapSearchPage() {
  const [selectedCity, setSelectedCity] = useState("All Cities")
  const [filteredProperties, setFilteredProperties] = useState(properties)
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 })
  const [mapZoom, setMapZoom] = useState(5)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Filter properties based on selected city and search query
    let filtered = properties

    if (selectedCity !== "All Cities") {
      filtered = filtered.filter((property) => property.city === selectedCity)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (property) => property.title.toLowerCase().includes(query) || property.city.toLowerCase().includes(query),
      )
    }

    setFilteredProperties(filtered)

    // Update map center and zoom based on selected city
    const city = indianCities.find((city) => city.name === selectedCity)
    if (city) {
      setMapCenter({ lat: city.lat, lng: city.lng })
      setMapZoom(city.zoom)
    }
  }, [selectedCity, searchQuery])

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
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Find Rooms on Map</h1>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search by location, property type..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {indianCities.map((city) => (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="h-[600px] overflow-hidden">
                <CardContent className="p-0 h-full">
                  {/* India Map Component */}
                  <div className="relative w-full h-full bg-gray-100 flex items-center justify-center">
                    <div className="absolute inset-0">
                      <img
                        src="/placeholder.svg?height=600&width=800&text=India+Map+View"
                        alt="India Map"
                        className="w-full h-full object-cover"
                      />

                      {/* Map markers for properties */}
                      {filteredProperties.map((property) => (
                        <div
                          key={property.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2"
                          style={{
                            top: `${(1 - (property.location.lat - 8) / (35 - 8)) * 100}%`,
                            left: `${((property.location.lng - 68) / (97 - 68)) * 100}%`,
                          }}
                        >
                          <div className="bg-primary text-white rounded-full p-1 cursor-pointer hover:scale-110 transition-transform">
                            <MapPin className="h-5 w-5" />
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white shadow-md rounded-md p-2 w-40 z-10 hidden group-hover:block">
                            <p className="text-xs font-medium">{property.title}</p>
                            <p className="text-xs">₹{property.price}/month</p>
                          </div>
                        </div>
                      ))}

                      {/* City markers */}
                      {indianCities
                        .filter((city) => city.name !== "All Cities")
                        .map((city) => (
                          <div
                            key={city.name}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                            style={{
                              top: `${(1 - (city.lat - 8) / (35 - 8)) * 100}%`,
                              left: `${((city.lng - 68) / (97 - 68)) * 100}%`,
                            }}
                          >
                            <div
                              className={`rounded-full p-1 cursor-pointer hover:scale-110 transition-transform ${
                                selectedCity === city.name ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
                              }`}
                              onClick={() => setSelectedCity(city.name)}
                            >
                              <div className="h-3 w-3 rounded-full" />
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white shadow-md rounded-md p-1 z-10 hidden group-hover:block">
                              <p className="text-xs font-medium">{city.name}</p>
                            </div>
                          </div>
                        ))}
                    </div>

                    {filteredProperties.length === 0 && (
                      <div className="bg-white/80 p-4 rounded-md shadow-sm">
                        <p className="text-center">No properties found in this area</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4 lg:col-span-1 max-h-[600px] overflow-y-auto pr-2">
              <h2 className="text-lg font-semibold">{filteredProperties.length} Properties Found</h2>

              {filteredProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={property.image || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                  <CardHeader className="p-3 pb-0">
                    <CardTitle className="text-base">{property.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {property.city}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-1 pb-0">
                    <p className="font-medium">₹{property.price.toLocaleString()}/month</p>
                    <p className="text-xs text-gray-500 capitalize">{property.type} Room</p>
                  </CardContent>
                  <CardFooter className="p-3">
                    <Button size="sm" className="w-full">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              {filteredProperties.length === 0 && (
                <div className="text-center p-4 border rounded-md">
                  <p className="text-gray-500">No properties found matching your criteria</p>
                  <Button
                    variant="link"
                    onClick={() => {
                      setSelectedCity("All Cities")
                      setSearchQuery("")
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
