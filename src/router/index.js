/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/home.vue'
import Catalogo from '@/pages/catalogo.vue'
import Login from '@/pages/login.vue'
import { useUserStore } from '@/stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: "/catalogo",
      name: "catalogo",
      component: Catalogo,
      meta: { requiresAuth: true }

    },
    {
      path: "/login",
      name: "login",
      component: Login,
    }
  ]
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  
  if (to.meta.requiresAuth && !userStore.user) {
    next('/login')
  } else if (to.path === '/login' && userStore.user) {
    next('/') 
  } else {
    next()
  }

})

export default router
