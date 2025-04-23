"use client"

import { useState } from "react"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { ref, uploadString, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"

export function SecurityRulesTester() {
  const { user, userData } = useAuth()
  const [testResults, setTestResults] = useState<{ name: string; success: boolean; message: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const runTests = async () => {
    if (!user) return

    setIsLoading(true)
    setTestResults([])
    const results = []

    // Test 1: Read own user document
    try {
      const userDocRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userDocRef)

      results.push({
        name: "Read own user document",
        success: userDoc.exists(),
        message: userDoc.exists()
          ? "Successfully read user document"
          : "User document doesn't exist, but permission was granted",
      })
    } catch (error: any) {
      results.push({
        name: "Read own user document",
        success: false,
        message: `Failed: ${error.message}`,
      })
    }

    // Test 2: Write to own user document
    try {
      const userDocRef = doc(db, "users", user.uid)
      await setDoc(userDocRef, { lastTested: new Date().toISOString() }, { merge: true })

      results.push({
        name: "Write to own user document",
        success: true,
        message: "Successfully updated user document",
      })
    } catch (error: any) {
      results.push({
        name: "Write to own user document",
        success: false,
        message: `Failed: ${error.message}`,
      })
    }

    // Test 3: Create a test property
    try {
      const testPropertyData = {
        title: "Test Property",
        description: "This is a test property",
        price: 1000,
        bedrooms: 2,
        bathrooms: 1,
        address: "123 Test St",
        city: "Test City",
        state: "TS",
        zipCode: "12345",
        ownerId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const propertyDocRef = doc(db, "properties", `test-${user.uid}`)
      await setDoc(propertyDocRef, testPropertyData)

      results.push({
        name: "Create property document",
        success: true,
        message: "Successfully created test property",
      })
    } catch (error: any) {
      results.push({
        name: "Create property document",
        success: false,
        message: `Failed: ${error.message}`,
      })
    }

    // Test 4: Upload test image to storage
    try {
      const storageRef = ref(storage, `users/${user.uid}/test-image.png`)
      // Create a simple base64 image
      const base64Image =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="

      await uploadString(storageRef, base64Image, "data_url")
      const downloadURL = await getDownloadURL(storageRef)

      results.push({
        name: "Upload image to storage",
        success: true,
        message: "Successfully uploaded test image",
      })
    } catch (error: any) {
      results.push({
        name: "Upload image to storage",
        success: false,
        message: `Failed: ${error.message}`,
      })
    }

    setTestResults(results)
    setIsLoading(false)
  }

  if (!user) {
    return (
      <Alert>
        <AlertTitle>Authentication Required</AlertTitle>
        <AlertDescription>You need to be logged in to test security rules.</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Rules Tester</CardTitle>
        <CardDescription>Test if Firebase security rules are properly configured</CardDescription>
      </CardHeader>
      <CardContent>
        {testResults.length > 0 ? (
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div key={index} className="flex items-start gap-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                )}
                <div>
                  <p className="font-medium">{result.name}</p>
                  <p className="text-sm text-gray-500">{result.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Click the button below to test your Firebase security rules</p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={runTests} disabled={isLoading} className="w-full">
          {isLoading ? "Running Tests..." : "Test Security Rules"}
        </Button>
      </CardFooter>
    </Card>
  )
}
