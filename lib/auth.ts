import { safeLocalStorage } from "./browser-utils"
import { getFirebaseServices } from "./firebase"

// Define UserData and UserType interfaces
export interface UserData {
  uid: string
  email: string
  displayName: string
  userType: UserType
  createdAt: string
  updatedAt: string
  source?: string
  phoneNumber?: string
  city?: string
  address?: string
  error?: string
}

export type UserType = "tenant" | "landlord"

// Function to check if running in a browser environment
const isBrowser = typeof window !== "undefined"

// Register a new user with retry logic for network errors
export const registerUser = async (
  email: string,
  password: string,
  userType: UserType,
  displayName: string,
  phoneNumber?: string,
  city?: string,
  address?: string,
  retryCount = 0,
): Promise<UserData> => {
  if (!isBrowser) {
    throw new Error("Cannot register user on the server side")
  }

  const maxRetries = 2 // Maximum number of retry attempts

  try {
    console.log(`Attempting to register user: ${email} (attempt ${retryCount + 1})`)

    // Get Firebase services
    const { auth, db } = await getFirebaseServices()
    if (!auth || !db) {
      throw new Error("Firebase services not available")
    }

    // Dynamically import Firebase auth
    const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth")
    const { doc, setDoc, serverTimestamp } = await import("firebase/firestore")

    // First, create the user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    console.log(`User created in Authentication: ${user.uid}`)

    // Update the user's profile with the display name
    await updateProfile(user, { displayName })

    console.log(`User profile updated with display name: ${displayName}`)

    // Create a user document in Firestore
    const userDocRef = doc(db, "users", user.uid)

    const userData: UserData = {
      uid: user.uid,
      email: user.email || email,
      displayName: user.displayName || displayName,
      userType: userType,
      phoneNumber: phoneNumber || "",
      city: city || "",
      address: address || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: "firestore",
    }

    await setDoc(userDocRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    console.log(`User document created in Firestore for user: ${user.uid}`)

    return userData
  } catch (authError: any) {
    console.error("Authentication error:", authError)

    // Handle network errors with retry logic
    if (authError.code === "auth/network-request-failed" && retryCount < maxRetries) {
      console.log(`Network error occurred. Retrying... (${retryCount + 1}/${maxRetries})`)
      // Wait for a short time before retrying (exponential backoff)
      const delay = Math.pow(2, retryCount) * 1000
      await new Promise((resolve) => setTimeout(resolve, delay))
      return registerUser(email, password, userType, displayName, phoneNumber, city, address, retryCount + 1)
    }

    // Provide more specific error messages
    if (authError.code === "auth/email-already-in-use") {
      throw new Error("This email is already in use. Please use a different email or sign in.")
    } else if (authError.code === "auth/weak-password") {
      throw new Error("The password is too weak. Please choose a stronger password.")
    } else if (authError.code === "auth/invalid-email") {
      throw new Error("The email address is not valid. Please enter a valid email.")
    } else if (authError.code === "auth/operation-not-allowed") {
      throw new Error("Email/password authentication is not enabled. Please enable it in Firebase console.")
    } else if (authError.code === "auth/network-request-failed") {
      throw new Error("Network connection failed. Please check your internet connection and try again.")
    } else {
      throw new Error(authError.message || "Failed to register. Please try again later.")
    }
  }
}

// Get current user data from Firestore
export const getCurrentUser = async (user: any): Promise<UserData | null> => {
  if (!isBrowser) {
    return null
  }

  try {
    // Get Firebase services
    const { db } = await getFirebaseServices()
    if (!db) {
      throw new Error("Firestore not available")
    }

    const { doc, getDoc } = await import("firebase/firestore")

    const userDocRef = doc(db, "users", user.uid)
    const userDoc = await getDoc(userDocRef)

    if (userDoc.exists()) {
      return userDoc.data() as UserData
    } else {
      return null
    }
  } catch (error) {
    console.error("Error fetching user data:", error)
    return null
  }
}

// Sign in existing user with retry logic for network errors
export const signIn = async (email: string, password: string, retryCount = 0): Promise<UserData> => {
  if (!isBrowser) {
    throw new Error("Cannot sign in on the server side")
  }

  const maxRetries = 2 // Maximum number of retry attempts

  try {
    console.log(`Attempting to sign in user: ${email} (attempt ${retryCount + 1})`)

    // Get Firebase services
    const { auth, db } = await getFirebaseServices()
    if (!auth || !db) {
      throw new Error("Firebase services not available")
    }

    // Dynamically import Firebase auth
    const { signInWithEmailAndPassword } = await import("firebase/auth")
    const { doc, getDoc, setDoc, serverTimestamp } = await import("firebase/firestore")

    // First, authenticate the user with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    console.log(`Authentication successful for user: ${user.uid}`)

    // Create fallback user data based on auth info
    const fallbackUserData: UserData = {
      uid: user.uid,
      email: user.email || email,
      displayName: user.displayName || email.split("@")[0],
      userType: "tenant", // Default to tenant if we don't know
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: "fallback",
    }

    // Try to get user type from localStorage if available
    const storedUserType = safeLocalStorage.getItem("userType")
    if (storedUserType === "tenant" || storedUserType === "landlord") {
      fallbackUserData.userType = storedUserType as UserType
    }

    // Try to get user data from Firestore, but don't let failures block sign-in
    try {
      const userDocRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userDocRef)

      if (userDoc.exists()) {
        // We successfully got the user data from Firestore
        const firestoreData = userDoc.data() as UserData

        // Save userType to localStorage for future fallback
        safeLocalStorage.setItem("userType", firestoreData.userType)

        return {
          ...firestoreData,
          source: "firestore",
        }
      } else {
        // User document doesn't exist in Firestore
        console.log(`User document not found for ${user.uid}, attempting to create one`)

        try {
          // Try to create the user document
          const newUserData = {
            ...fallbackUserData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }

          await setDoc(userDocRef, newUserData)
          console.log("Created new user document during sign in")

          return {
            ...fallbackUserData,
            source: "firestore",
          }
        } catch (createError: any) {
          console.warn("Failed to create user document:", createError)

          // If we can't create the document, just use the fallback data
          return {
            ...fallbackUserData,
            error: "document-creation-failed",
          }
        }
      }
    } catch (firestoreError: any) {
      // Handle Firestore errors gracefully
      console.warn("Firestore error during sign in:", firestoreError)

      // Return fallback data with error flag
      return {
        ...fallbackUserData,
        error: firestoreError.code || "firestore-error",
      }
    }
  } catch (authError: any) {
    console.error("Authentication error:", authError)

    // Handle network errors with retry logic
    if (authError.code === "auth/network-request-failed" && retryCount < maxRetries) {
      console.log(`Network error occurred. Retrying... (${retryCount + 1}/${maxRetries})`)
      // Wait for a short time before retrying (exponential backoff)
      const delay = Math.pow(2, retryCount) * 1000
      await new Promise((resolve) => setTimeout(resolve, delay))
      return signIn(email, password, retryCount + 1)
    }

    // Provide more specific error messages
    if (authError.code === "auth/network-request-failed") {
      throw new Error("Network connection failed. Please check your internet connection and try again.")
    } else if (authError.code === "auth/user-not-found" || authError.code === "auth/wrong-password") {
      throw new Error("Invalid email or password. Please try again.")
    } else if (authError.code === "auth/user-disabled") {
      throw new Error("This account has been disabled. Please contact support.")
    } else if (authError.code === "auth/too-many-requests") {
      throw new Error("Too many unsuccessful login attempts. Please try again later.")
    } else {
      throw new Error(authError.message || "Failed to sign in. Please try again later.")
    }
  }
}
