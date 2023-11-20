<template>
  <button class="return-button" @click="backToConversations">Retour</button>
  <div class="conversation-detail-container">
    <div v-if="props.conversationId !== null && !isMessagesEmpty" class="messages-list">
      <Message
        v-for="message in messages.value"
        :key="message.id"
        :senderId="message.senderId"
        :isOffline="message.isOffline"
        :timestamp="
          message.timestamp ? formatDate(message.timestamp.toDate()) : '12/11/2023 20:21:50'
        "
      >
        {{ message.content }}
      </Message>
    </div>
    <div v-else-if="props.conversationId !== null && isMessagesEmpty" class="no-messages">
      <p>Aucun message</p>
    </div>
    <div v-else class="no-selected">
      <p>Sélectionnez une conversation pour voir les messages</p>
    </div>
    <div class="message-input-container" v-if="props.conversationId !== null">
      <input
        type="text"
        v-model="newMessage"
        placeholder="Tapez un message..."
        class="message-input"
      />
      <button @click="handleSendMessage" class="send-button">Envoyer</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onUnmounted, watch } from 'vue'
import { useMessages, sendMessage } from '../services/messageService'
import Message from '../components/Message.vue'

import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  conversationId: String
})

const backToConversations = () => {
  router.push('/')
}

const formatDate = (date) => {
  if (!date) {
    return ''
  }
  return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR')
}

const { messages, stopListening } = useMessages(props.conversationId)

const isMessagesEmpty = computed(() => messages.value.length === 0)

const newMessage = ref('')

const userId = localStorage.getItem('userId')

const handleSendMessage = () => {
  if (newMessage.value === '') {
    return
  }

  const messageBody = {
    content: newMessage.value,
    senderId: userId,
    conversationId: props.conversationId,
    isOffline: !navigator.onLine
  }
  sendMessage(messageBody)
  newMessage.value = ''
}

watch(
  () => props.conversationId,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      messages.value = []
      stopListening()
      messages.value = useMessages(newVal).messages
      console.log(messages.value)
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  stopListening()
})
</script>

<style scoped>
.conversation-detail-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
}

.messages-list {
  flex-grow: 1;
  overflow-y: auto;
}

.message-input-container {
  display: flex;
  align-items: center;
  padding-inline: 0.5rem;
  background: #f8f8f8;
  position: fixed;
  bottom: 0;
  width: 100%;
}

.return-button {
  position: absolute;
  background-color: #7c5cff;
  top: 5px;
  left: 5px;
  padding: 0.4rem;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 0.8rem;
  cursor: pointer;
  box-sizing: border-box;
}
.return-button:hover {
  background-color: #5b34f5;
}
.message-input {
  flex-grow: 1;
  margin-right: 1rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
}

.send-button {
  padding: 0.5rem 1rem 0.5rem 1rem;
  background-color: #7c5cff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 0.5rem;
}

.send-button:hover {
  background-color: #5b34f5;
}
</style>
