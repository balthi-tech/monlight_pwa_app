// src/services/userService.js
import { db } from '../firebase'
import {
  collection,
  query,
  where,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc
} from 'firebase/firestore'

// Exemple pour ajouter un nouvel utilisateur
export async function addUser(user) {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      name: user.name,
      email: user.email
    })
    // localStorage.setItem('userId', docRef.id)
    localStorage.setItem('userId', docRef.id)
    localStorage.setItem('email', user.email)
    localStorage.setItem('name', user.name)
    console.log('Document written with ID: ', docRef.id)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

export async function updateUser(user) {
  try {
    const docRef = doc(db, 'users', user.id)

    await updateDoc(docRef, {
      notificationToken: user.notificationToken
    })

    console.log('Document written with ID: ', docRef.id)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

export const findUserByEmail = async (email) => {
  const usersRef = collection(db, 'users')
  const q = query(usersRef, where('email', '==', email))
  const querySnapshot = await getDocs(q)

  if (querySnapshot.empty) {
    return null
  }

  const userData = querySnapshot.docs[0].data()
  const userId = querySnapshot.docs[0].id

  return { id: userId, ...userData }
}

export const findUserById = async (userId) => {
  const userRef = doc(db, 'users', userId)
  const docSnapshot = await getDoc(userRef)

  if (!docSnapshot.exists()) {
    console.log('No such user!')
    return null
  }

  return { id: docSnapshot.id, ...docSnapshot.data() }
}
