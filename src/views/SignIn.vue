<template>
  <div class="signin-container">
    <div class="signin-box">
      <h2>Welcome back</h2>
      <p>Login your account</p>
      <input v-model="email" type="text" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <button @click="signIn">Login</button>
      <div class="links">
        <router-link to="/signup">Create Account</router-link>
        <router-link to="/forgot-password">Forgot Password?</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useRouter } from 'vue-router'
import { findUserByEmail } from '@/services/userService'
import { useToast } from 'vue-toast-notification'

const $toast = useToast()

const email = ref('')
const password = ref('')
const router = useRouter()

const signIn = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)

    //
    try {
      var user = await findUserByEmail(email.value)

      if (user == null) {
        return
      }

      localStorage.setItem('userId', user.id)
      localStorage.setItem('email', user.email)
      localStorage.setItem('name', user.name)
    } catch (error) {
      console.error(error)
    }

    router.push('/')
  } catch (error) {
    $toast.error('Wrong email or password. Please try again.')
    console.error(error)
  }
}
</script>

<style scoped>
.signin-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #7c5cff;
}

.signin-box {
  padding: 2rem;
  background: white;
  border-radius: 10px;
  text-align: center;
  width: 100%;
  max-width: 400px;
}

.signin-box h2 {
  color: #333;
  margin-bottom: 1rem;
}

.signin-box p {
  color: #666;
  margin-bottom: 2rem;
}

.signin-box input {
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.signin-box button {
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  background-color: #7c5cff;
  color: white;
  cursor: pointer;
  margin-bottom: 1rem;
}

.signin-box .links a {
  display: inline-block;
  color: #7c5cff;
  text-decoration: none;
  margin: 0 0.5rem;
}

@media (max-width: 600px) {
  .signin-box {
    padding: 1rem;
    max-width: 90%;
  }

  .signin-box h2 {
    font-size: 1.5rem;
  }

  .signin-box input,
  .signin-box button {
    padding: 0.75rem;
  }

  .signin-box .links a {
    margin: 0 0.3rem;
  }
}
</style>
