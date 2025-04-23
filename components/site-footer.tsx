import Link from "next/link"
import { Building2, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function SiteFooter() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              <span className="font-bold text-xl">RoomGroom</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Connecting landlords and tenants across India with a seamless room rental platform.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Facebook</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4" />
                  <span className="sr-only">Instagram</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Contact Information</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  123 Tech Park, Sector 15
                  <br />
                  Bangalore, Karnataka 560001
                  <br />
                  India
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500 dark:text-gray-400">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500 dark:text-gray-400">support@roomgroom.com</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Newsletter</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Your email address" className="max-w-[220px]" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2025 RoomGroom. All rights reserved. Created by PJsofonic Organization.
          </p>
          <div className="flex gap-4">
            <Link
              href="/terms"
              className="text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              Privacy Policy
            </Link>
            <Link
              href="/faq"
              className="text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
