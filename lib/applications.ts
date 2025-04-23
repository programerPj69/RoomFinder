import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  serverTimestamp,
  orderBy,
} from "firebase/firestore"
import { db } from "./firebase"

// Types
export type ApplicationStatus = "pending" | "approved" | "rejected" | "withdrawn"

export interface ApplicationData {
  id?: string
  propertyId: string
  propertyTitle: string
  tenantId: string
  tenantName: string
  tenantEmail: string
  tenantPhone?: string
  landlordId: string
  message?: string
  moveInDate?: Date
  status: ApplicationStatus
  createdAt: any
  updatedAt: any
}

// Submit a new application
export const submitApplication = async (
  applicationData: Omit<ApplicationData, "id" | "status" | "createdAt" | "updatedAt">,
): Promise<string> => {
  try {
    const application = {
      ...applicationData,
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "applications"), application)
    return docRef.id
  } catch (error) {
    console.error("Error submitting application:", error)
    throw error
  }
}

// Update application status
export const updateApplicationStatus = async (applicationId: string, status: ApplicationStatus): Promise<void> => {
  try {
    await updateDoc(doc(db, "applications", applicationId), {
      status,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating application status:", error)
    throw error
  }
}

// Get applications by tenant
export const getApplicationsByTenant = async (tenantId: string): Promise<ApplicationData[]> => {
  try {
    const q = query(collection(db, "applications"), where("tenantId", "==", tenantId), orderBy("createdAt", "desc"))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
          moveInDate: doc.data().moveInDate?.toDate(),
        }) as ApplicationData,
    )
  } catch (error) {
    console.error("Error getting applications by tenant:", error)
    throw error
  }
}

// Get applications by landlord
export const getApplicationsByLandlord = async (landlordId: string): Promise<ApplicationData[]> => {
  try {
    const q = query(collection(db, "applications"), where("landlordId", "==", landlordId), orderBy("createdAt", "desc"))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
          moveInDate: doc.data().moveInDate?.toDate(),
        }) as ApplicationData,
    )
  } catch (error) {
    console.error("Error getting applications by landlord:", error)
    throw error
  }
}

// Get applications for a specific property
export const getApplicationsByProperty = async (propertyId: string): Promise<ApplicationData[]> => {
  try {
    const q = query(collection(db, "applications"), where("propertyId", "==", propertyId), orderBy("createdAt", "desc"))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
          moveInDate: doc.data().moveInDate?.toDate(),
        }) as ApplicationData,
    )
  } catch (error) {
    console.error("Error getting applications by property:", error)
    throw error
  }
}

// Delete an application
export const deleteApplication = async (applicationId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "applications", applicationId))
  } catch (error) {
    console.error("Error deleting application:", error)
    throw error
  }
}
