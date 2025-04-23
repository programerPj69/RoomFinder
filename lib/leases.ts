import { collection, addDoc, updateDoc, doc, query, where, getDocs, serverTimestamp, orderBy } from "firebase/firestore"
import { db } from "./firebase"

// Types
export type LeaseStatus = "active" | "expired" | "terminated"

export interface LeaseData {
  id?: string
  propertyId: string
  propertyTitle: string
  landlordId: string
  landlordName: string
  tenantId: string
  tenantName: string
  startDate: Date
  endDate: Date
  monthlyRent: number
  securityDeposit: number
  status: LeaseStatus
  terms?: string
  createdAt: any
  updatedAt: any
}

// Create a new lease
export const createLease = async (
  leaseData: Omit<LeaseData, "id" | "status" | "createdAt" | "updatedAt">,
): Promise<string> => {
  try {
    const lease = {
      ...leaseData,
      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "leases"), lease)
    return docRef.id
  } catch (error) {
    console.error("Error creating lease:", error)
    throw error
  }
}

// Update lease status
export const updateLeaseStatus = async (leaseId: string, status: LeaseStatus): Promise<void> => {
  try {
    await updateDoc(doc(db, "leases", leaseId), {
      status,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating lease status:", error)
    throw error
  }
}

// Get leases by tenant
export const getLeasesByTenant = async (tenantId: string): Promise<LeaseData[]> => {
  try {
    const q = query(collection(db, "leases"), where("tenantId", "==", tenantId), orderBy("createdAt", "desc"))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          startDate: doc.data().startDate.toDate(),
          endDate: doc.data().endDate.toDate(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        }) as LeaseData,
    )
  } catch (error) {
    console.error("Error getting leases by tenant:", error)
    throw error
  }
}

// Get leases by landlord
export const getLeasesByLandlord = async (landlordId: string): Promise<LeaseData[]> => {
  try {
    const q = query(collection(db, "leases"), where("landlordId", "==", landlordId), orderBy("createdAt", "desc"))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          startDate: doc.data().startDate.toDate(),
          endDate: doc.data().endDate.toDate(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        }) as LeaseData,
    )
  } catch (error) {
    console.error("Error getting leases by landlord:", error)
    throw error
  }
}

// Get lease by property
export const getLeaseByProperty = async (propertyId: string): Promise<LeaseData | null> => {
  try {
    const q = query(collection(db, "leases"), where("propertyId", "==", propertyId), where("status", "==", "active"))

    const querySnapshot = await getDocs(q)

    if (querySnapshot.docs.length > 0) {
      const doc = querySnapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        endDate: doc.data().endDate.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      } as LeaseData
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting lease by property:", error)
    throw error
  }
}
