<template>

  <v-container class="d-flex justify-center align-center" style="height: 100vh;">

    
    <v-card width="400" class="pa-6">


      <v-card-text class="d-flex justify-center">
        <v-img
          src="@/assets/logoLittleBeesGrande.jpg" 
          max-width="480"
          contain
        ></v-img>
      </v-card-text>

      <v-card-title class="text-center">Iniciar Sesión</v-card-title>

      <v-form @submit.prevent="login">
        <v-text-field
          v-model="username"
          label="Nombre de usuario"
          outlined
          dense
          required
        ></v-text-field>

        <v-text-field
          v-model="email"
          label="Correo electrónico"
          type="email"
          outlined
          dense
          required
        ></v-text-field>

        <v-text-field
          v-model="password"
          label="Contraseña"
          type="password"
          outlined
          dense
          required
        ></v-text-field>

        <v-btn type="submit" color="#1e293b" block class="mt-4">
          Entrar
        </v-btn>
      </v-form>

      <v-alert v-if="error" type="error" class="mt-3" dense>
        {{ error }}
      </v-alert>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

function login() {
  if (username.value && email.value && password.value) {
    if (email.value === "admin@correo.com" && password.value === "1234") {
      const userData = {
        username: username.value,
        email: email.value
      }
      userStore.login(userData) 
      router.push('/')
    } else {
      error.value = "Credenciales incorrectas"
    }
  } else {
    error.value = "Completa todos los campos"
  }
}
</script>
