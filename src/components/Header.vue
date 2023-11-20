<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="header-container">
    <div class="user-info">
      <h1>{{ userName }}</h1>
      <p>{{ userEmail }}</p>
    </div>

    <button class="logout-button" @click="handleLogout">
      <p class="logout-text">Déconnexion</p>
      <img class="logout-image" src="@/assets/logout-icon.png" />
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'

const userName = localStorage.getItem('name')
const userEmail = localStorage.getItem('email')
const router = useRouter()

const handleLogout = async () => {
  try {
    await signOut(auth)
    localStorage.removeItem('name')
    localStorage.removeItem('userId')
    localStorage.removeItem('email')
    router.push('/signin')
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.user-info h1 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.user-info p {
  margin: 0;
  font-size: 0.875rem;
  color: #666;
}

.logout-button {
  border: none;
  width: auto;
  height: 40px;
  background-color: #e53e3e;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  align-items: center;
  text-align: center;
}

.logout-button:hover {
  background-color: #e22020;
}

.logout-button i {
  margin-right: 0.5rem;
}
.logout-text {
  visibility: inherit;
}
.logout-image {
  display: none;
}
@media (max-width: 600px) {
  .logout-image {
    display: flex;
    height: 100%;
    width: 100%;
    padding-block: 10px;
    visibility: inherit;
    object-fit: contain;
  }
  .logout-text {
    display: none;
  }
}
</style>
