<template>
  <div class="forgot-password-container">
    <div class="forgot-password-box">
      <h2>Reset Password</h2>
      <p>Enter your email to receive reset instructions</p>
      <input type="email" placeholder="Email" v-model="email" />
      <button @click="resetPassword">Send Instructions</button>
      <div class="links">
        <router-link to="/signin">Back to Sign In</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth } from '../firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useToast } from 'vue-toast-notification'

const email = ref('')
const $toast = useToast()

$toast

const resetPassword = async () => {
  try {
    await sendPasswordResetEmail(auth, email.value)
    $toast.success('Password reset instructions have been sent to your email.')
  } catch (error) {
    $toast.error("Couldn't send reset instructions. Please try again.")
  }
}
</script>

<style scoped>
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #7c5cff;
}

.forgot-password-box {
  padding: 2rem;
  background: white;
  border-radius: 10px;
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.forgot-password-box h2 {
  color: #333;
  margin-bottom: 1rem;
}

.forgot-password-box p {
  color: #666;
  margin-bottom: 2rem;
}

.forgot-password-box input {
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.forgot-password-box button {
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  background-color: #7c5cff;
  color: white;
  cursor: pointer;
  margin-bottom: 1rem;
}

.forgot-password-box .links {
  margin-top: 1rem;
}

.forgot-password-box .links a {
  color: #7c5cff;
  text-decoration: none;
}

@media (max-width: 600px) {
  .forgot-password-box {
    padding: 1rem;
    max-width: 90%;
  }
  .forgot-password-box h2,
  .forgot-password-box p {
    font-size: 1rem;
  }

  .forgot-password-box input,
  .forgot-password-box button {
    padding: 0.75rem;
  }
}
</style>
