<template>
  <div class="auth-container">
    <h1>Webdevoo Lead</h1>
    <p class="subtitle">
      Espace d'authentification
    </p>

    <div
      v-if="user"
      class="card success-card"
    >
      <h3>Bienvenue, {{ user.firstName }} {{ user.lastName }} !</h3>
      <p><strong>Email :</strong> {{ user.email }}</p>
      <NuxtLink
        to="/leads/dashboard"
        class="btn-valid"
      >
        Accéder au dashboard
      </NuxtLink>
      <Logout />
    </div>

    <div
      v-else
      class="card"
    >
      <div class="tabs">
        <button 
          type="button"
          :class="{ active: isLoginMode }" 
          class="tab-btn"
          @click="isLoginMode = true"
        >
          Connexion
        </button>
        <button 
          type="button"
          :class="{ active: !isLoginMode }" 
          class="tab-btn"
          @click="isLoginMode = false"
        >
          Inscription
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div
          v-if="!isLoginMode"
          class="row"
        >
          <input
            v-model="form.firstName"
            type="text"
            placeholder="Prénom"
            required
          >
          <input
            v-model="form.lastName"
            type="text"
            placeholder="Nom"
            required
          >
        </div>

        <div
          v-if="!isLoginMode"
          class="field"
        >
          <input
            v-model="form.phone"
            type="text"
            placeholder="Téléphone"
            required
          >
        </div>

        <div class="field">
          <input
            v-model="form.email"
            type="email"
            placeholder="Email"
            required
          >
        </div>

        <div class="field">
          <input
            v-model="form.password"
            type="password"
            placeholder="Mot de passe"
            required
          >
        </div>

        <button
          type="submit"
          class="btn-primary"
        >
          {{ isLoginMode ? 'Se connecter' : "S'inscrire" }}
        </button>
      </form>
    </div>

    <p
      v-if="errorMessage"
      class="error"
    >
      {{ errorMessage }}
    </p>
    <p
      v-if="successMessage"
      class="success"
    >
      {{ successMessage }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Logout from '~/components/auth/Logout.vue'

const { user, accessToken, login, register, logout } = useAuth()
const router = useRouter()

// Sécurité : Si l'état utilisateur existe mais que le token n'est plus là (expiré/invalide),
// on nettoie automatiquement la session pour ne pas bloquer l'affichage sur index.
if (user.value && !accessToken.value) {
  await logout()
}

const isLoginMode = ref(true)
const errorMessage = ref('')
const successMessage = ref('')

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
</script>

<style scoped>
.tabs {
  display: flex;
  background-color: #f1f5f9;
  padding: 4px;
  border-radius: var(--border-radius-base, 8px);
  margin-bottom: 1.5rem;
  gap: 4px;
}

.tab-btn {
  flex: 1;
  padding: 10px;
  background: transparent;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-gray-text, #64748b);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: var(--color-dark, #1e293b);
  }

  &.active {
    background: var(--color-white, #ffffff);
    color: var(--color-primary, #2563eb);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary, #2563eb);
    outline-offset: 2px;
  }
}

.btn-valid {
  width: max-content;
  display: block;
  padding: .5rem 1rem;
  background-color: var(--color-success, #16a34a);
  color: white;
  border-radius: .4rem;
  margin: .75rem 0;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
}

@media (max-width: 480px) {
  .auth-container {
    margin: 20px 1rem;
    padding: 16px;
  }

  .row {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>