/* eslint-disable no-undef */

importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js')

firebase.initializeApp({
  apiKey: 'AIzaSyDkJ1OibMC0wiZ__-ldeh4Kazhk_thob3Y',
  authDomain: 'pwa-app-ca864.firebaseapp.com',
  projectId: 'pwa-app-ca864',
  storageBucket: 'pwa-app-ca864.appspot.com',
  messagingSenderId: '1053462475719',
  appId: '1:1053462475719:web:1cc08f89085f05485c1fe2'
})

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
