import Link from "next/link"
import Image from "next/image"
import { Building2, Search, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthNav } from "@/components/auth-nav"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <Building2 className="h-6 w-6" />
          <span>RoomGroom</span>
        </Link>
        <AuthNav />
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Find Your Perfect Room
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    RoomGroom connects tenants with landlords to find the perfect living space. Browse listings,
                    schedule viewings, and secure your new home.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/login">
                    <Button size="lg" className="gap-2">
                      <Search className="h-4 w-4" />
                      Find a Room
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="gap-2">
                      <Building2 className="h-4 w-4" />
                      List Your Property
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full aspect-video overflow-hidden rounded-xl">
                  <Image
                    src="/images/luxury-living-room.jpg"
                    alt="Luxury living room with modern design"
                    className="object-cover object-center"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  RoomGroom makes finding and listing rooms simple and efficient.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">For Landlords</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    List your properties, manage applications, and find reliable tenants.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  <Search className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">For Tenants</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Search for rooms, filter by preferences, and contact landlords directly.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  <Users className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Connect</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Schedule viewings, sign agreements, and move into your new space.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Properties Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter">Featured Properties</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed">
                  Discover some of our most exceptional properties available for rent.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Featured Property 1 */}
              <div className="group relative overflow-hidden rounded-lg border">
                <div className="aspect-video overflow-hidden">
                  <Image
                    src="/images/luxury-living-room.jpg"
                    alt="Luxury Apartment in Central Location"
                    className="object-cover transition-transform group-hover:scale-105"
                    width={600}
                    height={400}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold">Luxury Apartment in Central Location</h3>
                  <p className="text-sm text-gray-500">Mumbai, Maharashtra</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-medium">₹35,000/month</span>
                    <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">Premium</span>
                  </div>
                </div>
              </div>

              {/* Featured Property 2 */}
              <div className="group relative overflow-hidden rounded-lg border">
                <div className="aspect-video overflow-hidden">
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">Property Image</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold">Modern Studio in Tech Park</h3>
                  <p className="text-sm text-gray-500">Bangalore, Karnataka</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-medium">₹18,000/month</span>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">New</span>
                  </div>
                </div>
              </div>

              {/* Featured Property 3 */}
              <div className="group relative overflow-hidden rounded-lg border">
                <div className="aspect-video overflow-hidden">
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">Property Image</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold">Spacious 2BHK with Garden View</h3>
                  <p className="text-sm text-gray-500">Delhi, Delhi</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-medium">₹25,000/month</span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Popular</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <Link href="/login">
                <Button variant="outline" size="lg">
                  View All Properties
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
