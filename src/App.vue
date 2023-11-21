<template>
  <div id="app">
    <div v-if="offline" class="offline-banner">Vous êtes actuellement hors ligne.</div>
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import { handleOnline } from './services/messageService'

const offline = ref(!navigator.onLine)

const updateOnlineStatus = () => {
  offline.value = !navigator.onLine
  handleOnline()
}

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.offline-banner {
  background-color: #ee5f5b;
  color: white;
  padding: 10px;
  text-align: center;
  position: fixed;
  right: 10px;
  top: 10px;
  z-index: 100;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
}

@media (max-width: 600px) {
  .offline-banner {
    right: 0;
    left: 0;
    top: 0;
    width: 100%;
    border-radius: 0;
    font-size: 12px;
  }
}
</style>
