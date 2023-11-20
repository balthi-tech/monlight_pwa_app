import { db } from '../firebase'
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { ref } from 'vue'

export function useUserConversations(userId) {
  const conversations = ref([])

  const q = query(collection(db, 'conversations'), where('participants', 'array-contains', userId))
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    conversations.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
  })

  const stopListening = () => {
    unsubscribe()
  }

  return { conversations, stopListening }
}

export async function addConversation(conversation) {
  try {
    console.log('Adding conversation with:', conversation)
    const docRef = await addDoc(collection(db, 'conversations'), {
      name: conversation.name,
      participants: conversation.participants,
      lastMessage: '',
      timstamp: serverTimestamp()
    })
    console.log('Conversation created with ID: ', docRef.id)
  } catch (e) {
    console.error('Error creating conversation: ', e)
  }
}

export async function deleteConversation(conversationId) {
  try {
    await collection(db, 'conversations').doc(conversationId).delete()
    console.log('Conversation deleted')
  } catch (e) {
    console.error('Error deleting conversation: ', e)
  }
}

export async function addParticipant(conversationId, participantId) {
  try {
    const conversationRef = doc(db, 'conversations', conversationId)
    await updateDoc(conversationRef, {
      participants: arrayUnion(participantId)
    })
    console.log('Participant added')
  } catch (e) {
    console.error('Error adding participant: ', e)
  }
}

export const findConversationById = async (conversationId) => {
  const conversationRef = doc(db, 'conversations', conversationId)

  const doc = await conversationRef.get()

  if (!doc.exists()) {
    return null
  }

  const conversationData = doc.data()
  const conversation = { id: doc.id, ...conversationData }

  return conversation
}
