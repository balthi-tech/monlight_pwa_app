/* eslint-disable comma-dangle */
/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable semi */
/* eslint-disable quotes */
const functions = require('firebase-functions')

const admin = require('firebase-admin')
admin.initializeApp()

exports.notifyNewMessage = functions.firestore
  .document('messages/{messageId}')
  .onCreate(async (snapshot, context) => {
    const messageData = snapshot.data()

    const conversationRef = admin
      .firestore()
      .collection('conversations')
      .doc(messageData.conversationId)

    const conversationSnapshot = await conversationRef.get().then((doc) => {
      return doc
    })

    if (!conversationSnapshot.exists) {
      console.log('Conversation not found')
      return null
    }
    const conversationData = conversationSnapshot.data()
    console.log('messageData', messageData.content)

    console.log('conversationName', conversationData.name)

    const notificationPromises = conversationData.participants
      .filter((participantId) => participantId !== messageData.senderId)
      .map(async (participantId) => {
        const participantRef = admin.firestore().collection('users').doc(participantId)

        const participantSnapshot = await participantRef.get().then((doc) => {
          return doc
        })

        if (!participantSnapshot.exists) {
          console.log(`User not found: ${participantId}`)
          return null
        }

        const participantData = participantSnapshot.data()

        const fcmToken = participantData.notificationToken

        if (fcmToken) {
          const payload = {
            notification: {
              title: `Nouveau message dans la conversation ${conversationData.name}!`,
              body: `${messageData.content}, ${
                participantData.name
              }, ${messageData.timestamp.toDate()}`
            }
          }

          return admin.messaging().sendToDevice(fcmToken, payload)
        } else {
          console.log(`No FCM token for user: ${participantId}`)
          return null
        }
      })
    return Promise.all(notificationPromises)
  })
