<template>
  <div class="auth-container">
    <h1>Webdevoo Lead</h1>
    <p class="subtitle">Espace d'authentification</p>

    <div v-if="user" class="card success-card">
      <h3>Bienvenue, {{ user.firstName }} {{ user.lastName }} !</h3>
      <p><strong>Email :</strong> {{ user.email }}</p>
      <button @click="handleLogout" class="btn-danger">Se déconnecter</button>
    </div>

    <div v-else class="card">
      <div class="tabs">
        <button 
          @click="isLoginMode = true" 
          :class="{ active: isLoginMode }"
          class="tab-btn"
        >
          Connexion
        </button>
        <button 
          @click="isLoginMode = false" 
          :class="{ active: !isLoginMode }"
          class="tab-btn"
        >
          Inscription
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div v-if="!isLoginMode" class="row">
          <input v-model="form.firstName" type="text" placeholder="Prénom" required />
          <input v-model="form.lastName" type="text" placeholder="Nom" required />
        </div>

        <div v-if="!isLoginMode" class="field">
          <input v-model="form.phone" type="text" placeholder="Téléphone" required />
        </div>

        <div class="field">
          <input v-model="form.email" type="email" placeholder="Email" required />
        </div>

        <div class="field">
          <input v-model="form.password" type="password" placeholder="Mot de passe" required />
        </div>

        <button type="submit" class="btn-primary">
          {{ isLoginMode ? 'Se connecter' : "S'inscrire" }}
        </button>
      </form>
    </div>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const { user, login, register, logout } = useAuth()

const isLoginMode = ref(true)
const errorMessage = ref('')
const successMessage = ref('')
const router = useRouter()

const form = ref({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  password: '',
})

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  try {
    if (isLoginMode.value) {
      await login({
        email: form.value.email,
        password: form.value.password,
      })
      successMessage.value = 'Connexion réussie !'
      await router.push('/leads/dashboard')
    } else {
      await register(form.value)
      successMessage.value = 'Compte créé avec succès !'
      isLoginMode.value = true
    }
  } catch (err) {
    errorMessage.value = err?.data?.statusMessage || 'Une erreur est survenue.'
  }
}

const handleLogout = async () => {
  try {
    await logout()
    successMessage.value = 'Déconnecté avec succès.'
  } catch (err) {
    errorMessage.value = 'Erreur lors de la déconnexion.'
  }
}
</script>

<style scoped>
</style>