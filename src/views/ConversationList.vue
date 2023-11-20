<template>
  <div class="conversation-container">
    <Header />

    <div class="conversations-list">
      <MyModal
        :show-modal="showModalNewConversation"
        @close="showModalNewConversation = false"
        @onValid="verifyAndCreateConversation"
      >
        <!-- Contenu pour créer une nouvelle conversation -->
        <template #header>
          <h3 class="modal-title">Créer une nouvelle conversation</h3>
        </template>
        <template #body>
          <div class="body-new-conv">
            <label for="name">Titre de la conversation</label>
            <input v-model="convName" type="text" placeholder="Entrez un titre à la conversation" />
            <label for="email">Adresse e-mail</label>
            <input v-model="email" type="email" placeholder="Entrez l'adresse e-mail" />
            <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
          </div>
        </template>
      </MyModal>
      <MyModal
        :show-modal="showModalNewParticipant"
        @close="showModalNewParticipant = false"
        @onValid="verifyAndAddParticipant"
      >
        <!-- Contenu pour ajouter un participant -->
        <template #header>
          <h3 class="modal-title">Ajouter un participant</h3>
        </template>
        <template #body>
          <div class="body-new-user">
            <label for="newParticipantEmail">Adresse e-mail</label>
            <input
              v-model="newParticipantEmail"
              type="email"
              placeholder="Entrez l'adresse e-mail"
            />
            <p class="error-message" v-if="errorMessage2">{{ errorMessage2 }}</p>
          </div>
        </template>
      </MyModal>

      <div class="new-conversation-container">
        <div class="conversations-list-header">
          <h3>Conversations</h3>
        </div>
        <button class="new-conversation-button" @click="openModalNewConversation">
          Créer une nouvelle conversation
        </button>
      </div>
      <div class="search-box">
        <input
          type="text"
          placeholder="Chercher votre conversation..."
          v-model="search"
          @input="filterConversations"
        />
      </div>
      <ul v-if="filteredConversations.length > 0">
        <p>{{ filteredConversations.length }}</p>
        <li
          v-for="conversation in filteredConversations"
          :key="conversation.id"
          @click.stop="selectConversation(conversation.id)"
          :class="{ active: conversation.id === selectedConversationId }"
        >
          <div class="conversation-info">
            <button class="new-participant-button" @click.stop="openModalNewParticipant">
              Ajouter un participant
            </button>
            <h5 class="conversation-title">{{ conversation.name }}</h5>
            <p class="last-message">{{ conversation.lastMessage }}</p>
          </div>
        </li>
      </ul>
      <div v-else class="no-conversations">Aucune conversation.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { findUserByEmail } from '../services/userService'
import {
  addConversation,
  addParticipant,
  useUserConversations
} from '../services/conversationService'
import { onUnmounted } from 'vue'
import { defineEmits } from 'vue'
import Header from '../components/Header.vue'
import MyModal from '../components/MyModal.vue'

import { useRouter } from 'vue-router'

const showModalNewConversation = ref(false)
const showModalNewParticipant = ref(false)

const search = ref('')
const selectedConversationId = ref(null)
const errorMessage = ref('')
const errorMessage2 = ref('')

const email = ref('')
const convName = ref('')
const participants = ref([])
const newParticipantEmail = ref('')
const newParticipant = ref('')

const handleAddParticipant = () => {
  addParticipant(selectedConversationId.value, newParticipant.value)
}

const verifyAndAddParticipant = async () => {
  errorMessage2.value = ''

  const userExists = await findUserByEmail(newParticipantEmail.value)

  if (userExists != null && userExists.id !== userId) {
    console.log('userExists')
    console.log(userExists)
    newParticipant.value = userExists.id
    handleAddParticipant()
    if (showModalNewParticipant.value === true) {
      showModalNewParticipant.value = false
    }
  } else if (userExists != null && userExists.id === userId) {
    errorMessage2.value = 'Vous ne pouvez pas créer une conversation avec vous-même.'
  } else {
    errorMessage2.value = 'Aucun utilisateur trouvé avec cette adresse e-mail.'
  }
}

const openModalNewConversation = () => {
  showModalNewConversation.value = true
}

const openModalNewParticipant = () => {
  showModalNewParticipant.value = true
}

const verifyAndCreateConversation = async () => {
  errorMessage.value = ''

  const userExists = await findUserByEmail(email.value)

  if (userExists != null && userExists.id !== userId) {
    console.log('userExists')
    console.log(userExists)
    participants.value = [userExists.id, userId]
    createConversation()
    if (showModalNewConversation.value === true) {
      showModalNewConversation.value = false
    }
  } else if (userExists != null && userExists.id === userId) {
    errorMessage.value = 'Vous ne pouvez pas créer une conversation avec vous-même.'
  } else {
    errorMessage.value = 'Aucun utilisateur trouvé avec cette adresse e-mail.'
  }
}

const createConversation = () => {
  var conversation = {
    name: convName.value,
    participants: participants.value,
    lastMessage: '',
    timestamp: new Date()
  }
  addConversation(conversation)
}

const userId = localStorage.getItem('userId')

const { conversations, stopListening } = useUserConversations(userId)

const router = useRouter()

onUnmounted(() => {
  stopListening()
})

const filterConversations = (conversations, searchString) => {
  if (!searchString || !searchString.trim()) {
    return conversations
  }
  const lowercasedSearchString = searchString.toLowerCase()
  return conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(lowercasedSearchString)
  )
}

const filteredConversations = computed(() => {
  return filterConversations(conversations.value, search.value)
})

const emit = defineEmits(['select-conversation'])

const selectConversation = (conversationId) => {
  router.push('/conversation/' + conversationId)

  emit('select-conversation', conversationId)
  selectedConversationId.value = conversationId
}
</script>

<style scoped>
.body-new-conv {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: #000;
  width: 100%;
}

.body-new-conv input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.body-new-user {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: #000;
  width: 100%;
}

.body-new-user input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.conversation-container {
  display: flex;
  flex-direction: column;
  background-color: white;
  height: 100vh;
  overflow: auto;
}

.conversations-list {
  width: 100%;
  border-right: 1px solid #e0e0e0;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  background: whitesmoke;
}

.new-conversation-container {
  width: 100%;
  text-align: center;
}
.new-conversation-button {
  width: 50%;
  padding: 1rem;
  background-color: #7c5cff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  box-sizing: border-box;
}

.new-participant-button {
  width: auto;
  padding: 8px;
  background-color: #7c5cff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 12px;
  cursor: pointer;
  box-sizing: border-box;
}

@media only screen and (max-width: 600px) {
  .new-conversation-container {
    width: 100%;
    padding: 1rem;
    text-align: center;
  }
  .new-conversation-button {
    width: 100%;
    padding: 1rem;
    background-color: #7c5cff;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    box-sizing: border-box;
  }
  .navLink {
    display: flex;
    flex-direction: column;
  }
}

.error-message {
  color: red;
}

.new-conversation-button:hover {
  background-color: #5b34f5;
}

.new-participant-button:hover {
  background-color: #5b34f5;
}

.search-box {
  padding: 1rem;
  background: #f7f7f7;
  border-bottom: 1px solid #e0e0e0;
}

.search-box input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 50;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

ul li {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  background: #fff;
  transition: background-color 0.3s;
}

ul li:hover {
  background-color: #f0f0f0;
}

ul li.active {
  background-color: #e9e9e9;
}

.conversation-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #000;
}

.conversation-title {
  font-weight: bold;
  font-size: 1rem;
  margin: 0;
  color: #666;
}

.last-message {
  color: #666;
  font-size: 0.8rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 0;
}

.conversations-list-header {
  color: #666;
  padding-block: 1rem;
}

.timestamp {
  font-size: 0.7rem;
  color: #999;
}

.no-conversations {
  text-align: center;
  padding: 1rem;
  color: #666;
}

@media (max-width: 600px) {
  .conversations-list {
    width: 100%;
  }
  .new-conversation-button,
  .search-box input {
    padding: 0.75rem;
  }
  .conversation-title,
  .last-message {
    font-size: 0.9rem;
  }
}
</style>
