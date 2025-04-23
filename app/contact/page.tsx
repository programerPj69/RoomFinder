"use client"

import { useState } from "react"
import Link from "next/link"
import { Building2, Mail, MapPin, Phone, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AuthNav } from "@/components/auth-nav"
import { SiteFooter } from "@/components/site-footer"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Message sent successfully",
        description: "We'll get back to you as soon as possible.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      })
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
        <div className="ml-auto">
          <AuthNav />
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Contact Us</h1>
            <p className="max-w-[700px] mx-auto text-gray-500 md:text-xl/relaxed">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="What is this regarding?"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Your message..."
                      className="min-h-[150px]"
                      required
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <Send className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Reach out to us directly using the information below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-sm text-gray-500">support@roomgroom.com</p>
                      <p className="text-sm text-gray-500">info@roomgroom.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-sm text-gray-500">+91 98765 43210</p>
                      <p className="text-sm text-gray-500">+91 12345 67890 (Support)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Office Address</h3>
                      <p className="text-sm text-gray-500">
                        RoomGroom Headquarters
                        <br />
                        123 Tech Park, Sector 15
                        <br />
                        Bangalore, Karnataka 560001
                        <br />
                        India
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Office Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Sunday</span>
                    <span>Closed</span>
                  </div>
                  <p className="text-sm text-gray-500 pt-2">All times are in Indian Standard Time (IST)</p>
                </CardContent>
              </Card>

              <div className="rounded-lg overflow-hidden h-[250px] border">
                <img
                  src="/placeholder.svg?height=250&width=600&text=Google+Map+Location"
                  alt="Office Location Map"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center space-y-4">
            <h2 className="text-2xl font-bold">Join Our Team</h2>
            <p className="max-w-[700px] mx-auto text-gray-500">
              Interested in working with us? We're always looking for talented individuals to join our team.
            </p>
            <Button variant="outline" className="mt-2">
              View Career Opportunities
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
