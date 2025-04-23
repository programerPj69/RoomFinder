"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Building2, ImagePlus, Trash2, MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { AuthNav } from "@/components/auth-nav"
import { useAuth } from "@/components/auth-provider"
import { addProperty, type PropertyData, type PropertyImage } from "@/lib/properties"
import { FirebasePermissionNotice } from "@/components/firebase-permission-notice"

// Major Indian cities
const indianCities = [
  { name: "Mumbai", state: "Maharashtra" },
  { name: "Delhi", state: "Delhi" },
  { name: "Bangalore", state: "Karnataka" },
  { name: "Hyderabad", state: "Telangana" },
  { name: "Chennai", state: "Tamil Nadu" },
  { name: "Kolkata", state: "West Bengal" },
  { name: "Pune", state: "Maharashtra" },
  { name: "Ahmedabad", state: "Gujarat" },
  { name: "Jaipur", state: "Rajasthan" },
  { name: "Lucknow", state: "Uttar Pradesh" },
  { name: "Kanpur", state: "Uttar Pradesh" },
  { name: "Nagpur", state: "Maharashtra" },
  { name: "Indore", state: "Madhya Pradesh" },
  { name: "Thane", state: "Maharashtra" },
  { name: "Bhopal", state: "Madhya Pradesh" },
  { name: "Visakhapatnam", state: "Andhra Pradesh" },
  { name: "Patna", state: "Bihar" },
  { name: "Vadodara", state: "Gujarat" },
  { name: "Ghaziabad", state: "Uttar Pradesh" },
  { name: "Ludhiana", state: "Punjab" },
]

export default function AddRoomPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { user, userData, permissionError } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<PropertyImage[]>([
    { id: "placeholder", url: "/placeholder.svg?height=200&width=300&text=Room+Image" },
  ])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [showPermissionError, setShowPermissionError] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "private" as const,
    price: 0,
    city: "",
    address: "",
    pincode: "",
    location: { lat: 20.5937, lng: 78.9629 },
    bedrooms: 1,
    bathrooms: 1,
    amenities: {
      furnished: false,
      semifurnished: false,
      ac: false,
      wifi: false,
      attachedBathroom: false,
      kitchen: false,
      parking: false,
      pets: false,
    },
    preferences: {
      family: false,
      bachelors: false,
      students: false,
      professionals: false,
    },
  })

  // Check for permission errors
  useEffect(() => {
    if (permissionError) {
      setShowPermissionError(true)
    }
  }, [permissionError])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (type === "checkbox") {
      // Handle checkbox fields (amenities and preferences)
      if (name.startsWith("amenities.")) {
        const amenityName = name.split(".")[1]
        setFormData((prev) => ({
          ...prev,
          amenities: {
            ...prev.amenities,
            [amenityName]: checked,
          },
        }))
      } else if (name.startsWith("preferences.")) {
        const preferenceName = name.split(".")[1]
        setFormData((prev) => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            [preferenceName]: checked,
          },
        }))
      }
    } else {
      // Handle other input fields
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number.parseFloat(value) : value,
      }))
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    // Store files for later upload
    setImageFiles((prev) => [...prev, ...files])

    // Create preview URLs
    const newImages = files.map((file) => ({
      id: `preview-${Date.now()}-${file.name}`,
      url: URL.createObjectURL(file),
    }))

    // Remove placeholder if it exists
    const updatedImages = images.filter((img) => img.id !== "placeholder")
    setImages([...updatedImages, ...newImages])
  }

  const handleRemoveImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id))

    // If removing a preview image, also remove from files
    if (id.startsWith("preview-")) {
      const index = imageFiles.findIndex((_, i) => `preview-${Date.now()}-${imageFiles[i].name}` === id)
      if (index !== -1) {
        const newFiles = [...imageFiles]
        newFiles.splice(index, 1)
        setImageFiles(newFiles)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user || !userData) {
      toast({
        title: "Authentication required",
        description: "Please log in to add a room.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    // Validate form data
    if (!formData.title) {
      toast({
        title: "Missing information",
        description: "Please provide a title for your property.",
        variant: "destructive",
      })
      return
    }

    if (!formData.city) {
      toast({
        title: "Missing information",
        description: "Please select a city for your property.",
        variant: "destructive",
      })
      return
    }

    if (!formData.price || formData.price <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price for your property.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Show immediate feedback
      toast({
        title: "Processing your listing",
        description: "Please wait while we upload your property details...",
      })

      // Prepare property data
      const propertyData: Omit<PropertyData, "id" | "createdAt" | "updatedAt"> = {
        ...formData,
        status: "available",
        ownerId: user.uid,
        ownerName: userData.displayName || "Property Owner",
        ownerEmail: userData.email || user.email || "",
        ownerPhone: userData.phoneNumber,
        images: images.filter((img) => img.id !== "placeholder"),
      }

      // Add property to database
      await addProperty(propertyData, imageFiles)

      toast({
        title: "Room listed successfully",
        description: "Your room has been added to our listings.",
      })

      // Redirect to landlord dashboard
      router.push("/landlord")
    } catch (error: any) {
      console.error("Error adding property:", error)

      // Check if it's a permission error
      if (error.message?.includes("permission") || error.code === "permission-denied") {
        setShowPermissionError(true)
        toast({
          title: "Permission Error",
          description:
            "Your property details were saved locally but couldn't be uploaded to the database due to permission issues.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error listing room",
          description: error.message || "There was a problem adding your room. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

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
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-2">
            <Link href="/landlord">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Add New Room</h1>
          </div>

          {showPermissionError && <FirebasePermissionNotice />}

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Room Details</CardTitle>
                <CardDescription>Provide information about your room</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Room Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Spacious 1BHK in Koramangala"
                    required
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="type">Room Type</Label>
                    <RadioGroup
                      defaultValue="private"
                      value={formData.type}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value as any }))}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="room-private" />
                        <Label htmlFor="room-private">Private Room</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="shared" id="room-shared" />
                        <Label htmlFor="room-shared">Shared Room</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="apartment" id="room-apartment" />
                        <Label htmlFor="room-apartment">Entire Apartment</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="house" id="room-house" />
                        <Label htmlFor="room-house">Entire House</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="studio" id="room-studio" />
                        <Label htmlFor="room-studio">Studio</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Monthly Rent (₹)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="e.g., 10000"
                      required
                      value={formData.price || ""}
                      onChange={handleChange}
                    />
                    <p className="text-sm text-gray-500">Enter amount in Indian Rupees</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, city: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianCities.map((city) => (
                          <SelectItem key={city.name} value={city.name}>
                            {city.name}, {city.state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">PIN Code</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      placeholder="e.g., 560034"
                      required
                      value={formData.pincode}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Enter the complete address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Location on Map</Label>
                  <div className="border rounded-lg h-[200px] bg-gray-50 flex items-center justify-center relative">
                    <div className="absolute inset-0">
                      <img
                        src="/placeholder.svg?height=200&width=600&text=Select+Location+on+Map"
                        alt="Map"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute">
                      <MapPin className="h-8 w-8 text-primary" />
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <Button type="button" size="sm" variant="secondary">
                        Set Location
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Click on the map to set the exact location of your property</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Room Conditions & Amenities</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="furnished"
                        name="amenities.furnished"
                        checked={formData.amenities.furnished}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            amenities: { ...prev.amenities, furnished: !!checked },
                          }))
                        }
                      />
                      <label
                        htmlFor="furnished"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Fully Furnished
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="semi-furnished"
                        name="amenities.semifurnished"
                        checked={formData.amenities.semifurnished}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            amenities: { ...prev.amenities, semifurnished: !!checked },
                          }))
                        }
                      />
                      <label
                        htmlFor="semi-furnished"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Semi-Furnished
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ac"
                        name="amenities.ac"
                        checked={formData.amenities.ac}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            amenities: { ...prev.amenities, ac: !!checked },
                          }))
                        }
                      />
                      <label
                        htmlFor="ac"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Air Conditioning
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="wifi"
                        name="amenities.wifi"
                        checked={formData.amenities.wifi}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            amenities: { ...prev.amenities, wifi: !!checked },
                          }))
                        }
                      />
                      <label
                        htmlFor="wifi"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        WiFi Included
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="attached-bathroom"
                        name="amenities.attachedBathroom"
                        checked={formData.amenities.attachedBathroom}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            amenities: { ...prev.amenities, attachedBathroom: !!checked },
                          }))
                        }
                      />
                      <label
                        htmlFor="attached-bathroom"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Attached Bathroom
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="kitchen"
                        name="amenities.kitchen"
                        checked={formData.amenities.kitchen}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            amenities: { ...prev.amenities, kitchen: !!checked },
                          }))
                        }
                      />
                      <label
                        htmlFor="kitchen"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Kitchen Access
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="parking"
                        name="amenities.parking"
                        checked={formData.amenities.parking}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            amenities: { ...prev.amenities, parking: !!checked },
                          }))
                        }
                      />
                      <label
                        htmlFor="parking"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Parking Available
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="pets"
                        name="amenities.pets"
                        checked={formData.amenities.pets}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            amenities: { ...prev.amenities, pets: !!checked },
                          }))
                        }
                      />
                      <label
                        htmlFor="pets"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Pets Allowed
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Room Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your room, including any special features, nearby amenities, etc."
                    className="min-h-[120px]"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Room Images</Label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div
                      className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center h-40 cursor-pointer hover:bg-gray-50"
                      onClick={() => document.getElementById("image-upload").click()}
                    >
                      <ImagePlus className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Click to upload room image</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG or WEBP (max. 5MB)</p>
                      <Input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                      />
                    </div>

                    {images.map((image) => (
                      <div key={image.id} className="relative border rounded-lg p-1">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={`Room preview ${image.id}`}
                          className="w-full h-40 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 rounded-full"
                          onClick={() => handleRemoveImage(image.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Tenant Preferences</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="family"
                        name="preferences.family"
                        checked={formData.preferences.family}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            preferences: { ...prev.preferences, family: !!checked },
                          }))
                        }
                      />
                      <label
                        htmlFor="family"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Family
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="bachelors"
                        name="preferences.bachelors"
                        checked={formData.preferences.bachelors}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            preferences: { ...prev.preferences, bachelors: !!checked },
                          }))
                        }
                      />
                      <label
                        htmlFor="bachelors"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Bachelors
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="students"
                        name="preferences.students"
                        checked={formData.preferences.students}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            preferences: { ...prev.preferences, students: !!checked },
                          }))
                        }
                      />
                      <label
                        htmlFor="students"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Students
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="professionals"
                        name="preferences.professionals"
                        checked={formData.preferences.professionals}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            preferences: { ...prev.preferences, professionals: !!checked },
                          }))
                        }
                      />
                      <label
                        htmlFor="professionals"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Working Professionals
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Listing Room...
                    </>
                  ) : (
                    "List Room"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </main>
    </div>
  )
}
