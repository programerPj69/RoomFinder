import { collection, addDoc, query, where, getDocs, serverTimestamp, orderBy, limit } from "firebase/firestore"
import { db } from "./firebase"

// Types
export interface MessageData {
  id?: string
  senderId: string
  senderName: string
  receiverId: string
  receiverName: string
  content: string
  read: boolean
  createdAt: any
}

// Send a new message
export const sendMessage = async (messageData: Omit<MessageData, "id" | "read" | "createdAt">): Promise<string> => {
  try {
    const message = {
      ...messageData,
      read: false,
      createdAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "messages"), message)
    return docRef.id
  } catch (error) {
    console.error("Error sending message:", error)
    throw error
  }
}

// Get conversation between two users
export const getConversation = async (userId1: string, userId2: string, limitCount = 50): Promise<MessageData[]> => {
  try {
    // Get messages sent from user1 to user2
    const q1 = query(
      collection(db, "messages"),
      where("senderId", "==", userId1),
      where("receiverId", "==", userId2),
      orderBy("createdAt", "desc"),
      limit(limitCount),
    )

    // Get messages sent from user2 to user1
    const q2 = query(
      collection(db, "messages"),
      where("senderId", "==", userId2),
      where("receiverId", "==", userId1),
      orderBy("createdAt", "desc"),
      limit(limitCount),
    )

    const [querySnapshot1, querySnapshot2] = await Promise.all([getDocs(q1), getDocs(q2)])

    // Combine and sort messages
    const messages1 = querySnapshot1.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        }) as MessageData,
    )

    const messages2 = querySnapshot2.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        }) as MessageData,
    )

    return [...messages1, ...messages2].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  } catch (error) {
    console.error("Error getting conversation:", error)
    throw error
  }
}

// Get all conversations for a user
export const getUserConversations = async (
  userId: string,
): Promise<
  {
    userId: string
    userName: string
    lastMessage: string
    lastMessageDate: Date
    unreadCount: number
  }[]
> => {
  try {
    // Get messages sent by the user
    const q1 = query(collection(db, "messages"), where("senderId", "==", userId), orderBy("createdAt", "desc"))

    // Get messages received by the user
    const q2 = query(collection(db, "messages"), where("receiverId", "==", userId), orderBy("createdAt", "desc"))

    const [querySnapshot1, querySnapshot2] = await Promise.all([getDocs(q1), getDocs(q2)])

    const sentMessages = querySnapshot1.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        }) as MessageData,
    )

    const receivedMessages = querySnapshot2.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        }) as MessageData,
    )

    // Combine all messages
    const allMessages = [...sentMessages, ...receivedMessages]

    // Group by conversation partner
    const conversationMap = new Map()

    allMessages.forEach((message) => {
      const partnerId = message.senderId === userId ? message.receiverId : message.senderId
      const partnerName = message.senderId === userId ? message.receiverName : message.senderName

      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          userId: partnerId,
          userName: partnerName,
          messages: [],
          unreadCount: 0,
        })
      }

      conversationMap.get(partnerId).messages.push(message)

      // Count unread messages
      if (message.receiverId === userId && !message.read) {
        conversationMap.get(partnerId).unreadCount += 1
      }
    })

    // Format the result
    return Array.from(conversationMap.values())
      .map((conversation) => {
        // Sort messages by date
        const sortedMessages = conversation.messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

        const lastMessage = sortedMessages[0]

        return {
          userId: conversation.userId,
          userName: conversation.userName,
          lastMessage: lastMessage.content,
          lastMessageDate: lastMessage.createdAt,
          unreadCount: conversation.unreadCount,
        }
      })
      .sort((a, b) => b.lastMessageDate.getTime() - a.lastMessageDate.getTime())
  } catch (error) {
    console.error("Error getting user conversations:", error)
    throw error
  }
}
