import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  serverTimestamp,
  orderBy,
  limit,
  startAfter,
  type QueryDocumentSnapshot,
  type DocumentData,
  GeoPoint,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "./firebase"

// Types
export interface PropertyImage {
  id: string
  url: string
}

export interface PropertyAmenity {
  name: string
  value: boolean
}

export type PropertyStatus = "available" | "rented" | "pending" | "maintenance"
export type PropertyType = "private" | "shared" | "apartment" | "house" | "studio"

export interface PropertyData {
  id?: string
  title: string
  description: string
  type: PropertyType
  price: number
  city: string
  address: string
  pincode: string
  location: {
    lat: number
    lng: number
  }
  images: PropertyImage[]
  amenities: {
    furnished: boolean
    semifurnished: boolean
    ac: boolean
    wifi: boolean
    attachedBathroom: boolean
    kitchen: boolean
    parking: boolean
    pets: boolean
    [key: string]: boolean
  }
  preferences: {
    family: boolean
    bachelors: boolean
    students: boolean
    professionals: boolean
    [key: string]: boolean
  }
  bedrooms: number
  bathrooms: number
  status: PropertyStatus
  ownerId: string
  ownerName: string
  ownerEmail: string
  ownerPhone?: string
  createdAt: any
  updatedAt: any
  currentTenantId?: string
  leaseStartDate?: Date
  leaseEndDate?: Date
}

// Add a new property
export const addProperty = async (
  propertyData: Omit<PropertyData, "id" | "createdAt" | "updatedAt">,
  imageFiles: File[],
): Promise<string> => {
  try {
    // Upload images to Firebase Storage
    const uploadedImages: PropertyImage[] = []

    for (const file of imageFiles) {
      const storageRef = ref(storage, `properties/${Date.now()}_${file.name}`)
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)

      uploadedImages.push({
        id: snapshot.ref.name,
        url: downloadURL,
      })
    }

    // Create property document in Firestore
    const propertyWithImages = {
      ...propertyData,
      images: [...propertyData.images, ...uploadedImages],
      location: new GeoPoint(propertyData.location.lat, propertyData.location.lng),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "properties"), propertyWithImages)
    return docRef.id
  } catch (error) {
    console.error("Error adding property:", error)
    throw error
  }
}

// Update a property
export const updateProperty = async (
  propertyId: string,
  propertyData: Partial<PropertyData>,
  newImageFiles?: File[],
): Promise<void> => {
  try {
    const propertyRef = doc(db, "properties", propertyId)

    // Upload new images if provided
    if (newImageFiles && newImageFiles.length > 0) {
      const uploadedImages: PropertyImage[] = []

      for (const file of newImageFiles) {
        const storageRef = ref(storage, `properties/${Date.now()}_${file.name}`)
        const snapshot = await uploadBytes(storageRef, file)
        const downloadURL = await getDownloadURL(snapshot.ref)

        uploadedImages.push({
          id: snapshot.ref.name,
          url: downloadURL,
        })
      }

      // Get current property data
      const propertyDoc = await getDoc(propertyRef)
      const currentImages = propertyDoc.data()?.images || []

      // Update with new images
      propertyData.images = [...currentImages, ...uploadedImages]
    }

    // Update location if provided
    if (propertyData.location) {
      propertyData.location = new GeoPoint(propertyData.location.lat, propertyData.location.lng)
    }

    // Update property document
    await updateDoc(propertyRef, {
      ...propertyData,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating property:", error)
    throw error
  }
}

// Delete a property
export const deleteProperty = async (propertyId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "properties", propertyId))
  } catch (error) {
    console.error("Error deleting property:", error)
    throw error
  }
}

// Get properties by owner
export const getPropertiesByOwner = async (ownerId: string): Promise<PropertyData[]> => {
  try {
    const q = query(collection(db, "properties"), where("ownerId", "==", ownerId), orderBy("createdAt", "desc"))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          location: {
            lat: doc.data().location.latitude,
            lng: doc.data().location.longitude,
          },
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
          leaseStartDate: doc.data().leaseStartDate?.toDate(),
          leaseEndDate: doc.data().leaseEndDate?.toDate(),
        }) as PropertyData,
    )
  } catch (error) {
    console.error("Error getting properties by owner:", error)
    throw error
  }
}

// Get available properties with pagination
export const getAvailableProperties = async (
  city?: string,
  type?: PropertyType,
  minPrice?: number,
  maxPrice?: number,
  lastVisible?: QueryDocumentSnapshot<DocumentData>,
  pageSize = 10,
): Promise<{
  properties: PropertyData[]
  lastVisible: QueryDocumentSnapshot<DocumentData> | null
}> => {
  try {
    let q = query(collection(db, "properties"), where("status", "==", "available"), orderBy("createdAt", "desc"))

    // Apply filters if provided
    if (city) {
      q = query(q, where("city", "==", city))
    }

    if (type) {
      q = query(q, where("type", "==", type))
    }

    if (minPrice) {
      q = query(q, where("price", ">=", minPrice))
    }

    if (maxPrice) {
      q = query(q, where("price", "<=", maxPrice))
    }

    // Apply pagination
    if (lastVisible) {
      q = query(q, startAfter(lastVisible), limit(pageSize))
    } else {
      q = query(q, limit(pageSize))
    }

    const querySnapshot = await getDocs(q)
    const properties = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          location: {
            lat: doc.data().location.latitude,
            lng: doc.data().location.longitude,
          },
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        }) as PropertyData,
    )

    const newLastVisible = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null

    return {
      properties,
      lastVisible: newLastVisible,
    }
  } catch (error) {
    console.error("Error getting available properties:", error)
    throw error
  }
}

// Get property by ID
export const getPropertyById = async (propertyId: string): Promise<PropertyData | null> => {
  try {
    const propertyDoc = await getDoc(doc(db, "properties", propertyId))

    if (propertyDoc.exists()) {
      const data = propertyDoc.data()
      return {
        id: propertyDoc.id,
        ...data,
        location: {
          lat: data.location.latitude,
          lng: data.location.longitude,
        },
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        leaseStartDate: data.leaseStartDate?.toDate(),
        leaseEndDate: data.leaseEndDate?.toDate(),
      } as PropertyData
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting property by ID:", error)
    throw error
  }
}

// Update property status (e.g., mark as rented)
export const updatePropertyStatus = async (
  propertyId: string,
  status: PropertyStatus,
  tenantId?: string,
  leaseStartDate?: Date,
  leaseEndDate?: Date,
): Promise<void> => {
  try {
    const propertyRef = doc(db, "properties", propertyId)

    const updateData: any = {
      status,
      updatedAt: serverTimestamp(),
    }

    if (status === "rented" && tenantId) {
      updateData.currentTenantId = tenantId

      if (leaseStartDate) {
        updateData.leaseStartDate = leaseStartDate
      }

      if (leaseEndDate) {
        updateData.leaseEndDate = leaseEndDate
      }
    }

    await updateDoc(propertyRef, updateData)
  } catch (error) {
    console.error("Error updating property status:", error)
    throw error
  }
}
