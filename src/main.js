import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { auth } from './firebase'
import './registerServiceWorker'
import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'

let app

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App).use(router).use(ToastPlugin).mount('#app')
  }
})
