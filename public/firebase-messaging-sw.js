/* eslint-disable no-undef */

importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js')


// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID
// }

firebase.initializeApp({
  apiKey: 'AIzaSyDkJ1OibMC0wiZ__-ldeh4Kazhk_thob3Y',
  authDomain: 'pwa-app-ca864.firebaseapp.com',
  projectId: 'pwa-app-ca864',
  storageBucket: 'pwa-app-ca864.appspot.com',
  messagingSenderId: '1053462475719',
  appId: '1:1053462475719:web:1cc08f89085f05485c1fe2'
})


// firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.body
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

console.log('firebase-messaging-sw.js')
