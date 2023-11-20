<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="chat-app-container">
    <ConversationList @select-conversation="handleSelectConversation" />
  </div>
</template>

<script setup>
import ConversationList from './ConversationList.vue'
import { ref } from 'vue'

import { getToken, onMessage } from 'firebase/messaging'

import { messaging } from '../firebase'

import { updateUser } from '../services/userService'

getToken(messaging, {
  vapidKey:
    'BPe74dDMQbXXMrAysmPmabwd7p8p9-HfAaySYM47QAxorTq7kDF2pC2-6HFZtxqZINXm3DX1sB_9_ozFaKZY6DA'
})
  .then((currentToken) => {
    if (currentToken) {
      var user = {
        notificationToken: currentToken,
        id: localStorage.getItem('userId')
      }
      updateUser(user)
      console.log(currentToken)
    } else {
      console.log('No registration token available. Request permission to generate one.')
    }
  })
  .catch((err) => {
    console.log('An error occurred while retrieving token. ', err)
  })

onMessage(messaging, (payload) => {
  console.log('Message received. ', payload)
})

const selectedConversationId = ref(null)
const isSidebarVisible = ref(false)

const handleSelectConversation = (convId) => {
  selectedConversationId.value = convId
  isSidebarVisible.value = false
}
</script>