import type { Metadata } from "next"
import { AboutHeader } from "./about-header"
import { AboutFooter } from "./about-footer"

export const metadata: Metadata = {
  title: "About RoomGroom",
  description: "Learn more about RoomGroom - the room finder application",
}

export default function AboutPage() {
  return (
    <>
      <AboutHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">About RoomGroom</h1>

        <div className="prose max-w-none">
          <p className="mb-4">
            RoomGroom is a platform designed to connect landlords with potential tenants, making the process of finding
            and renting properties easier and more efficient.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p className="mb-4">
            Our mission is to simplify the rental process by providing a user-friendly platform where landlords can list
            their properties and tenants can find their ideal homes.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">How It Works</h2>
          <p className="mb-4">
            Landlords can create listings for their properties, including details, photos, and rental terms. Tenants can
            browse available properties, filter based on their preferences, and contact landlords directly.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have any questions or feedback, please don't hesitate to reach out to us at
            <a href="mailto:support@roomgroom.com" className="text-blue-600 hover:underline">
              {" "}
              support@roomgroom.com
            </a>
            .
          </p>
        </div>
      </div>
      <AboutFooter />
    </>
  )
}
