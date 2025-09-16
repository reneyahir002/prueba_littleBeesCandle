<template>
  <v-app-bar color="#1e293b">
    <v-img src="@/assets/logoLittleBees.jpg" max-width="120" contain class="ml-3"></v-img>

    <v-row align="center" justify="center">
      <v-btn text to="/">INICIO</v-btn>
      <v-btn text to="/catalogo">Catálogo de Venta</v-btn>
    </v-row>

    <template v-if="userStore.user">
      <span class="mr-4">Hola, {{ userStore.user.username }}</span>
      <v-btn text @click="logout">Cerrar sesión</v-btn>
    </template>
    <template v-else>
      <v-btn text to="/login">Login</v-btn>
    </template>
  </v-app-bar>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

function logout() {
  userStore.logout()
  router.push('/login')
}
</script>
