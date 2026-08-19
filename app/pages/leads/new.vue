<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { $api } = useNuxtApp()
const router = useRouter()

const form = reactive({
  companyName: '',
  contactFirstName: '',
  contactLastName: '',
  clientSiret: '',
  clientEmail: '',
  clientPhone: '',
  missionTitle: '',
  missionStartDate: '',
  durationDays: null as number | null,
  isIndefiniteDuration: false,
  commissionRate: '10'
})

const loading = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  loading.value = true
  errorMessage.value = ''

  try {

    const payload = {
      ...form,
      clientSiret: form.clientSiret ? form.clientSiret.replace(/\D/g, '') : null,
      clientPhone: form.clientPhone
        ? form.clientPhone.replace(/^(?:\+33|0033)/, '0').replace(/\D/g, '')
        : ''
    }

    await $api('/api/leads', {
      method: 'POST',
      body: payload
    })

    // Redirection vers le dashboard après succès
    router.push('/leads/dashboard')
  } catch (err: any) {
    errorMessage.value = err?.data?.message || 'Une erreur est survenue lors de l\'enregistrement.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="lead-form-container">
    <div class="lead-form-wrapper">
      <header class="form-header">
        <h1>+ Créer un nouveau Lead</h1>
        <NuxtLink
          to="/leads/dashboard"
          class="btn-secondary"
        >
          Retour au tableau de bord
        </NuxtLink>
      </header>

      <form
        class="lead-form"
        @submit.prevent="handleSubmit"
      >
        <div
          v-if="errorMessage"
          class="error-message"
        >
          {{ errorMessage }}
        </div>

        <fieldset>
          <legend>Informations de la Société</legend>
          <div class="form-group">
            <label for="companyName">Nom de la société *</label>
            <input
              id="companyName"
              v-model="form.companyName"
              type="text"
              required
              placeholder="Ex: Acme Corp"
            >
          </div>
          <div class="form-group">
            <label for="clientSiret">SIRET du client</label>
            <input
              id="clientSiret"
              v-model="form.clientSiret"
              type="text"
              placeholder="14 chiffres"
            >
          </div>
        </fieldset>

        <fieldset>
          <legend>Contact sur place</legend>
          <div class="form-row">
            <div class="form-group">
              <label for="contactFirstName">Prénom</label>
              <input
                id="contactFirstName"
                v-model="form.contactFirstName"
                type="text"
                placeholder="Jean"
              >
            </div>
            <div class="form-group">
              <label for="contactLastName">Nom</label>
              <input
                id="contactLastName"
                v-model="form.contactLastName"
                type="text"
                placeholder="Dupont"
              >
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="clientEmail">Email *</label>
              <input
                id="clientEmail"
                v-model="form.clientEmail"
                type="email"
                required
                placeholder="jean.dupont@client.com"
              >
            </div>
            <div class="form-group">
              <label for="clientPhone">Téléphone</label>
              <input
                id="clientPhone"
                v-model="form.clientPhone"
                type="tel"
                placeholder="06 12 34 56 78"
              >
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Détails de la mission</legend>
          <div class="form-group">
            <label for="missionTitle">Intitulé de la mission *</label>
            <input
              id="missionTitle"
              v-model="form.missionTitle"
              type="text"
              required
              placeholder="Ex: Refonte application web Nuxt"
            >
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="missionStartDate">Date de début souhaitée</label>
              <input
                id="missionStartDate"
                v-model="form.missionStartDate"
                type="date"
              >
            </div>
            <div class="form-group">
              <label for="commissionRate">Taux de commission (%)</label>
              <input
                id="commissionRate"
                v-model="form.commissionRate"
                type="text"
                placeholder="10"
              >
            </div>
          </div>
          <div class="form-group checkbox-group">
            <label>
              <input
                v-model="form.isIndefiniteDuration"
                type="checkbox"
              >
              Durée indéterminée
            </label>
          </div>
          <div
            v-if="!form.isIndefiniteDuration"
            class="form-group"
          >
            <label for="durationDays">Durée estimée (en jours)</label>
            <input
              id="durationDays"
              v-model.number="form.durationDays"
              type="number"
              placeholder="30"
            >
          </div>
        </fieldset>

        <div class="form-actions">
          <button
            type="submit"
            class="btn-primary"
            :disabled="loading"
          >
            {{ loading ? 'Enregistrement...' : 'Enregistrer le lead' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.lead-form-container {
  min-height: 100vh;
  background-color: #f4f6f9;
  padding: 2rem 1rem;
}
.lead-form-wrapper {
  max-width: 800px;
  margin: 0 auto;
  background: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.form-header h1 {
  font-size: 1.5rem;
  color: #333;
}
.lead-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
fieldset {
  border: 1px solid #e5e7eb;
  padding: 1.25rem;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
legend {
  font-weight: 600;
  color: #374151;
  padding: 0 0.5rem;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.form-group label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #4b5563;
}
.form-group input {
  padding: 0.65rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.9rem;
}
.checkbox-group {
  flex-direction: row;
  align-items: center;
}
.error-message {
  padding: 0.75rem;
  background-color: #fee2e2;
  color: #991b1b;
  border-radius: 4px;
  font-size: 0.9rem;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
}
.btn-primary {
  background-color: #2563eb;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}
.btn-secondary {
  color: #4b5563;
  text-decoration: none;
  font-size: 0.9rem;
}
</style>