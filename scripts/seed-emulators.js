const { initializeApp } = require("firebase-admin/app")
const { getFirestore } = require("firebase-admin/firestore")
const { getAuth } = require("firebase-admin/auth")

// Initialize Firebase Admin
initializeApp({ projectId: "roomgroom-b6126" })

const db = getFirestore()
const auth = getAuth()

async function seedUsers() {
  console.log("Seeding users...")

  // Create test users
  const users = [
    {
      email: "landlord@example.com",
      password: "password123",
      displayName: "Test Landlord",
      userType: "landlord",
    },
    {
      email: "tenant@example.com",
      password: "password123",
      displayName: "Test Tenant",
      userType: "tenant",
    },
  ]

  for (const user of users) {
    try {
      // Create user in Auth
      const userRecord = await auth.createUser({
        email: user.email,
        password: user.password,
        displayName: user.displayName,
      })

      // Create user document in Firestore
      await db.collection("users").doc(userRecord.uid).set({
        uid: userRecord.uid,
        email: user.email,
        displayName: user.displayName,
        userType: user.userType,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      console.log(`Created user: ${user.email} (${user.userType})`)
    } catch (error) {
      console.error(`Error creating user ${user.email}:`, error)
    }
  }
}

async function seedProperties() {
  console.log("Seeding properties...")

  // Get landlord user
  const landlordSnapshot = await db.collection("users").where("email", "==", "landlord@example.com").limit(1).get()

  if (landlordSnapshot.empty) {
    console.error("Landlord user not found")
    return
  }

  const landlordId = landlordSnapshot.docs[0].id

  // Create test properties
  const properties = [
    {
      title: "Modern Studio Apartment",
      description: "A beautiful studio apartment in the heart of the city.",
      price: 1200,
      bedrooms: 0,
      bathrooms: 1,
      address: "123 Main St, Anytown, USA",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      amenities: ["WiFi", "Air Conditioning", "Washer/Dryer"],
      images: ["https://source.unsplash.com/random/800x600/?apartment"],
      ownerId: landlordId,
      available: true,
    },
    {
      title: "Spacious 2-Bedroom House",
      description: "A spacious 2-bedroom house with a beautiful garden.",
      price: 2000,
      bedrooms: 2,
      bathrooms: 2,
      address: "456 Oak St, Anytown, USA",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      amenities: ["WiFi", "Air Conditioning", "Washer/Dryer", "Parking", "Garden"],
      images: ["https://source.unsplash.com/random/800x600/?house"],
      ownerId: landlordId,
      available: true,
    },
  ]

  for (const property of properties) {
    try {
      const propertyRef = await db.collection("properties").add({
        ...property,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      console.log(`Created property: ${property.title} (${propertyRef.id})`)
    } catch (error) {
      console.error(`Error creating property ${property.title}:`, error)
    }
  }
}

async function seedData() {
  try {
    await seedUsers()
    await seedProperties()
    console.log("Seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding data:", error)
  } finally {
    process.exit(0)
  }
}

seedData()
