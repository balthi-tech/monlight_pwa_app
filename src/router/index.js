import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase'
import Home from '../views/Home.vue'
import SignIn from '../views/SignIn.vue'
import SignUp from '../views/SignUp.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import PageNotFound from '../views/PageNotFound.vue'
import ConversationDetail from '../views/ConversationDetail.vue'

const routes = [
  { path: '/', component: Home, meta: { requiresAuth: true } },
  { path: '/signin', component: SignIn, meta: { requiresGuest: true } },
  { path: '/signup', component: SignUp, meta: { requiresGuest: true } },
  { path: '/forgot-password', component: ForgotPassword, meta: { requiresGuest: true } },
  {
    path: '/conversation/:conversationId',
    component: ConversationDetail,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: PageNotFound,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest)

  const user = await new Promise((resolve) => {
    auth.onAuthStateChanged((user) => {
      resolve(user)
    })
  })

  if (requiresAuth && !user) {
    next('/signin')
  } else if (requiresGuest && user) {
    next('/')
  } else {
    if ((to.path === '/signup' || to.path === '/forgot-password') && !user) {
      next()
    } else {
      next()
    }
  }
})

export default router
