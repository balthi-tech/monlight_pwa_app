<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div :class="isSender ? 'message-sender' : 'message'">
    <div class="message-header">
      <span class="message-timestamp">{{ props.timestamp }}</span>
      <span v-if="!isSender">{{ userName }}</span>
    </div>
    <div class="message-content" :class="isSender ? 'my-message' : 'other-message'">
      <slot />
      <span v-if="props.isOffline" class="offline-indicator">Hors ligne</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue'
import { findUserById } from '../services/userService'

const props = defineProps({
  senderId: String,
  timestamp: String,
  isOffline: Boolean
})

const userName = ref('')

onMounted(async () => {
  if (props.senderId) {
    const user = await findUserById(props.senderId)
    if (user) {
      userName.value = user.name
    }
  }
})

const isSender = props.senderId === localStorage.getItem('userId')
</script>

<style scoped>
.message {
  margin: 0.5rem 0;
  color: black;
  display: flex;
  flex-direction: column;
  padding-left: 1rem;
}

.message-sender {
  margin: 0.5rem 0;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-right: 1rem;
}

.message-header {
  display: flex;
  flex-direction: column;
  font-size: 0.75rem;
}

.message-timestamp {
  color: #999;
  margin-left: 0.5rem;
}

.message-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: fit-content;
  padding: 0.5rem;
  border-radius: 0.5rem;
  margin-top: 0.25rem;
}

.my-message {
  background-color: #7c5cff;
  color: white;
  align-self: flex-end;
}

.other-message {
  background-color: #e0e0e0;
  color: black;
}

.offline-indicator {
  color: red;
  font-size: 0.8em;
  margin-left: 1rem;
  justify-content: center;
  align-self: center;
}
</style>
