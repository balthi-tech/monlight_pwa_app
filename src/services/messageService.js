import { db } from '../firebase'
import {
  collection,
  addDoc,
  orderBy,
  serverTimestamp,
  query,
  where,
  doc,
  onSnapshot,
  updateDoc,
  getDocs
} from 'firebase/firestore'
import { ref } from 'vue'

export async function updateMessageStatus(messageId, isOffline) {
  const messageRef = doc(db, 'messages', messageId)
  await updateDoc(messageRef, {
    isOffline: isOffline
  })
}

export async function getOfflineMessages() {
  const q = query(collection(db, 'messages'), where('isOffline', '==', true))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }))
}

export const handleOnline = async () => {
  const offlineMessages = await getOfflineMessages()

  for (const message of offlineMessages) {
    await updateMessageStatus(message.id, false)
  }
}

export async function sendMessage(message) {
  try {
    console.log('Adding message to conversation: ', message)
    const messageRef = collection(db, 'messages')
    await addDoc(messageRef, {
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: message.content,
      timestamp: serverTimestamp(),
      isOffline: message.isOffline
    })

    console.log('Message added')
  } catch (e) {
    console.error('Error adding message: ', e)
  }

  try {
    const conversationRef = doc(db, 'conversations', message.conversationId)
    await updateDoc(conversationRef, {
      lastMessage: message.content,
      updatedAt: serverTimestamp()
    })
    console.log('Last message updated')
  } catch (e) {
    console.error('Error updating last message: ', e)
  }
}

export function useMessages(conversationId) {
  console.log('conversationId', conversationId)
  const q = query(
    collection(db, 'messages'),
    orderBy('timestamp', 'asc'),
    where('conversationId', '==', conversationId)
  )

  const messages = ref([])
  const unsubscribe = onSnapshot(q, (snapshot) => {
    messages.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  })
  const stopListening = () => {
    unsubscribe()
  }

  return { messages, stopListening }
}
