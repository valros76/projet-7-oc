<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const authStore = useAuth() // Utilisation du store d'auth existant

const leadId = Number(route.params.id)

const form = reactive<Partial<Lead>>({
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
  commissionRate: '10',
  status: 'pending',
  referrerId: undefined
})

const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Récupération directe du rôle via le Ref user du composable auth
const isAdmin = computed(() => authStore.user.value?.role === 'admin')

// Règle : Un apporteur ne peut modifier QUE si le statut est 'accepted'
const isEditableByApporteur = computed(() => {
  if (isAdmin.value) return true
  return form.status === 'accepted'
})

const fetchLead = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    // Récupération du lead
    const res: any = await $api(`/api/leads/${leadId}`)
    const lead = res.lead

    form.companyName = lead.companyName || ''
    form.contactFirstName = lead.contactFirstName || ''
    form.contactLastName = lead.contactLastName || ''
    form.clientSiret = lead.clientSiret || ''
    form.clientEmail = lead.clientEmail || ''
    form.clientPhone = lead.clientPhone || ''
    form.missionTitle = lead.missionTitle || ''
    form.missionStartDate = lead.missionStartDate ? lead.missionStartDate.split('T')[0] : ''
    form.durationDays = lead.durationDays
    form.isIndefiniteDuration = lead.isIndefiniteDuration || false
    form.commissionRate = lead.commissionRate || '10'
    form.status = lead.status || 'pending'
    form.referrerId = lead.referrerId
  } catch (err: any) {
    errorMessage.value = err?.data?.message || 'Impossible de charger les informations du lead.'
  } finally {
    loading.value = false
  }
}

const handleUpdate = async () => {
  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const payload = {
      ...form,
      clientSiret: form.clientSiret ? form.clientSiret.replace(/\D/g, '') : null,
      clientPhone: form.clientPhone ? form.clientPhone.replace(/^(?:\+33|0033)/, '0').replace(/\D/g, '') : ''
    }

    await $api(`/api/leads/${leadId}`, {
      method: 'PUT',
      body: payload
    })

    successMessage.value = 'Lead mis à jour avec succès.'
    setTimeout(() => {
      router.push('/leads/dashboard')
    }, 1500)
  } catch (err: any) {
    errorMessage.value = err?.data?.message || 'Erreur lors de la mise à jour.'
  } finally {
    saving.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement ce lead ?')) return

  deleting.value = true
  errorMessage.value = ''

  try {
    await $api(`/api/leads/${leadId}`, {
      method: 'DELETE'
    })
    router.push('/leads/dashboard')
  } catch (err: any) {
    errorMessage.value = err?.data?.message || 'Erreur lors de la suppression.'
    deleting.value = false
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending': return { label: 'En attente', class: 'badge-pending' }
    case 'accepted': return { label: 'Validé', class: 'badge-accepted' }
    case 'refused': return { label: 'Refusé', class: 'badge-refused' }
    case 'paid': return { label: 'Payé', class: 'badge-paid' }
    default: return { label: status, class: 'badge-default' }
  }
}

onMounted(() => {
  fetchLead()
})
</script>

<template>
  <div class="lead-detail-container">
    <div class="lead-detail-wrapper">
      <header class="form-header">
        <div>
          <h1>Détail du Lead</h1>
          <NuxtLink to="/leads/dashboard" class="btn-secondary">← Retour au tableau de bord</NuxtLink>
        </div>
        <div v-if="!loading" class="header-actions">
          <span v-if="form.status" class="badge" :class="getStatusBadge(form.status).class">
            {{ getStatusBadge(form.status).label }}
          </span>
          <button 
            v-if="isAdmin" 
            @click="handleDelete" 
            class="btn-danger" 
            :disabled="deleting"
          >
            {{ deleting ? 'Suppression...' : 'Supprimer' }}
          </button>
        </div>
      </header>

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

      <div v-if="!loading && !isEditableByApporteur" class="warning-banner">
        ⚠️ Ce lead est en attente ou refusé. Il ne peut être modifié que lorsqu'il aura été accepté par un administrateur.
      </div>

      <div v-if="loading" class="loading-state">
        Chargement des détails...
      </div>

      <form v-else @submit.prevent="handleUpdate" class="lead-form">
        
        <fieldset v-if="isAdmin" class="admin-fieldset">
          <legend>Administration</legend>
          <div class="form-row">
            <div class="form-group">
              <label for="status">Statut du lead</label>
              <select id="status" v-model="form.status" class="form-control">
                <option value="pending">En attente</option>
                <option value="accepted">Validé (Accepté)</option>
                <option value="refused">Refusé</option>
                <option value="paid">Payé</option>
              </select>
            </div>
            <div class="form-group">
              <label for="commissionRate">Taux de commission (%)</label>
              <input id="commissionRate" v-model="form.commissionRate" type="text" placeholder="10" />
            </div>
          </div>
        </fieldset>

        <fieldset :disabled="!isEditableByApporteur">
          <legend>Informations de la Société</legend>
          <div class="form-group">
            <label for="companyName">Nom de la société *</label>
            <input id="companyName" v-model="form.companyName" type="text" required />
          </div>
          <div class="form-group">
            <label for="clientSiret">SIRET du client</label>
            <input id="clientSiret" v-model="form.clientSiret" type="text" placeholder="14 chiffres" />
          </div>
        </fieldset>

        <fieldset :disabled="!isEditableByApporteur">
          <legend>Contact sur place</legend>
          <div class="form-row">
            <div class="form-group">
              <label for="contactFirstName">Prénom</label>
              <input id="contactFirstName" v-model="form.contactFirstName" type="text" />
            </div>
            <div class="form-group">
              <label for="contactLastName">Nom</label>
              <input id="contactLastName" v-model="form.contactLastName" type="text" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="clientEmail">Email *</label>
              <input id="clientEmail" v-model="form.clientEmail" type="email" required />
            </div>
            <div class="form-group">
              <label for="clientPhone">Téléphone</label>
              <input id="clientPhone" v-model="form.clientPhone" type="tel" />
            </div>
          </div>
        </fieldset>

        <fieldset :disabled="!isEditableByApporteur">
          <legend>Détails de la mission</legend>
          <div class="form-group">
            <label for="missionTitle">Intitulé de la mission *</label>
            <input id="missionTitle" v-model="form.missionTitle" type="text" required />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="missionStartDate">Date de début souhaitée</label>
              <input id="missionStartDate" v-model="form.missionStartDate" type="date" />
            </div>
            <div class="form-group" v-if="!isAdmin">
              <label>Taux de commission (%) [Verrouillé]</label>
              <input :value="form.commissionRate + '%'" type="text" disabled class="disabled-input" />
            </div>
          </div>
          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" v-model="form.isIndefiniteDuration" />
              Durée indéterminée
            </label>
          </div>
          <div class="form-group" v-if="!form.isIndefiniteDuration">
            <label for="durationDays">Durée estimée (en jours)</label>
            <input id="durationDays" v-model.number="form.durationDays" type="number" />
          </div>
        </fieldset>

        <div class="form-actions" v-if="isEditableByApporteur">
          <button type="submit" class="btn-primary" :disabled="saving">
            {{ saving ? 'Enregistrement...' : 'Enregistrer les modifications' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.lead-detail-container {
  min-height: 100vh;
  background-color: #f4f6f9;
  padding: 2rem 1rem;
}
.lead-detail-wrapper {
  max-width: 800px;
  margin: 0 auto;
  background: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}
.form-header h1 {
  font-size: 1.5rem;
  color: #111827;
  margin: 0 0 0.25rem 0;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
.admin-fieldset {
  background-color: #f8fafc;
  border-color: #cbd5e1;
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
.form-group input, .form-control {
  padding: 0.65rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.9rem;
}
.disabled-input {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}
.checkbox-group {
  flex-direction: row;
  align-items: center;
}
.badge {
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}
.badge-pending { background-color: #fef3c7; color: #92400e; }
.badge-accepted { background-color: #d1fae5; color: #065f46; }
.badge-refused { background-color: #fee2e2; color: #991b1b; }
.badge-paid { background-color: #dbeafe; color: #1e40af; }

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
.btn-danger {
  background-color: #dc2626;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.85rem;
}
.warning-banner {
  padding: 0.75rem;
  background-color: #fef3c7;
  color: #92400e;
  border-radius: 4px;
  font-size: 0.9rem;
  border: 1px solid #fde68a;
}
.error-message {
  padding: 0.75rem;
  background-color: #fee2e2;
  color: #991b1b;
  border-radius: 4px;
  font-size: 0.9rem;
}
.success-message {
  padding: 0.75rem;
  background-color: #d1fae5;
  color: #065f46;
  border-radius: 4px;
  font-size: 0.9rem;
}
.loading-state, .empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}
</style>