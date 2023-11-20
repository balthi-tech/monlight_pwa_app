<template>
  <div class="signup-container">
    <div class="signup-box">
      <h2>Create Account</h2>
      <p>Sign up for a new account</p>
      <input type="text" placeholder="Name" v-model="name" />
      <input type="text" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Password" v-model="password" />
      <button @click="signUp">Sign Up</button>
      <div class="links">
        <router-link to="/signin">Already have an account?</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { addUser } from '@/services/userService'

const name = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()
import { useToast } from 'vue-toast-notification'

const $toast = useToast()

const signUp = async () => {
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = {
      name: name.value,
      email: email.value
    }
    await addUser(user)
    router.push('/')
  } catch (error) {
    $toast.error(error.message)

    console.error('Sign Up Error:', error)
  }
}
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #7c5cff;
}

.signup-box {
  padding: 2rem;
  background: white;
  border-radius: 10px;
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.signup-box h2 {
  color: #333;
  margin-bottom: 1rem;
}

.signup-box p {
  color: #666;
  margin-bottom: 2rem;
}

.signup-box input {
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.signup-box button {
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  background-color: #7c5cff;
  color: white;
  cursor: pointer;
  margin-bottom: 1rem;
}

.signup-box .links {
  margin-top: 1rem;
}

.signup-box .links a {
  color: #7c5cff;
  text-decoration: none;
}

@media (max-width: 600px) {
  .signup-box {
    padding: 1rem;
    max-width: 90%;
  }

  .signup-box h2 {
    font-size: 1.5rem;
  }

  .signup-box input,
  .signup-box button {
    padding: 0.75rem;
  }
}
</style>
