// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqd0DG8u2QPKNX-4ahCu1R-E4NxwWiIxU",
  authDomain: "roomgroom-b6126.firebaseapp.com",
  projectId: "roomgroom-b6126",
  storageBucket: "roomgroom-b6126.appspot.com",
  messagingSenderId: "599278595522",
  appId: "1:599278595522:web:4a2eecd76eb1dfd37a3a5b",
  measurementId: "G-X56ZZWZK7P",
}

// Create placeholder objects for server-side rendering
let app = null
let auth = null
let db = null
let storage = null

// Track initialization state
let isInitialized = false
let initializationPromise = null

// Initialize Firebase only in the browser
if (isBrowser) {
  initializationPromise = (async () => {
    try {
      // Dynamic imports to prevent server-side execution
      const { initializeApp } = await import("firebase/app")
      const { getAuth } = await import("firebase/auth")
      const { getFirestore } = await import("firebase/firestore")
      const { getStorage } = await import("firebase/storage")

      // Initialize Firebase app
      app = initializeApp(firebaseConfig)

      // Initialize Firebase services
      auth = getAuth(app)
      db = getFirestore(app)
      storage = getStorage(app)

      // Check if emulators should be used
      const useEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true"

      if (useEmulators) {
        console.log("🔧 Using Firebase Emulators")

        // Connect to Auth emulator
        const { connectAuthEmulator } = await import("firebase/auth")
        connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true })
        console.log("🔑 Connected to Auth Emulator on port 9099")

        // Connect to Firestore emulator
        const { connectFirestoreEmulator } = await import("firebase/firestore")
        connectFirestoreEmulator(db, "localhost", 8080)
        console.log("📄 Connected to Firestore Emulator on port 8080")

        // Connect to Storage emulator
        const { connectStorageEmulator } = await import("firebase/storage")
        connectStorageEmulator(storage, "localhost", 9199)
        console.log("📦 Connected to Storage Emulator on port 9199")
      } else {
        console.log("🔥 Using production Firebase services")

        // Set up local persistence for better offline support
        const { browserLocalPersistence, setPersistence } = await import("firebase/auth")
        setPersistence(auth, browserLocalPersistence)
          .then(() => console.log("Firebase Auth persistence set to local"))
          .catch((error) => console.error("Error setting auth persistence:", error))

        // Enable offline persistence for Firestore
        const { enableIndexedDbPersistence } = await import("firebase/firestore")
        enableIndexedDbPersistence(db)
          .then(() => console.log("Firestore offline persistence enabled"))
          .catch((err) => {
            if (err.code === "failed-precondition") {
              console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.")
            } else if (err.code === "unimplemented") {
              console.warn("The current browser doesn't support all of the features required to enable persistence")
            } else {
              console.error("Error enabling Firestore persistence:", err)
            }
          })
      }

      // Log successful initialization
      console.log(`Firebase initialized with project: ${firebaseConfig.projectId}`)
      isInitialized = true
      return { app, auth, db, storage }
    } catch (error) {
      console.error("Error initializing Firebase:", error)
      throw error
    }
  })()
}

// Function to get Firebase services after initialization
export async function getFirebaseServices() {
  if (!isBrowser) {
    return { app: null, auth: null, db: null, storage: null }
  }

  try {
    return await initializationPromise
  } catch (error) {
    console.error("Failed to initialize Firebase services:", error)
    return { app: null, auth: null, db: null, storage: null }
  }
}

// Export Firebase services
export { app, auth, db, storage, isInitialized, initializationPromise }
