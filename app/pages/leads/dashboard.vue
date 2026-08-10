<script setup lang="ts">
import Logout from '~/components/auth/Logout.vue'
import DashboardFilters from '~/components/dashboard/DashboardFilters.vue'
import DashboardTable from '~/components/dashboard/DashboardTable.vue'

definePageMeta({
  middleware: "auth",
})

const { $api } = useNuxtApp()
const authStore = useAuth()

const leadsList = ref<any[]>([])
const loading = ref(true)
const errorMessage = ref("")
const successMessage = ref("")

const searchQuery = ref("")
const selectedStatus = ref("all")

const isAdmin = computed(() => authStore.user.value?.role === "admin")

// KPIs calculés sur toute la liste brute
const totalLeads = computed(() => leadsList.value.length)
const pendingLeads = computed(() => leadsList.value.filter((l) => l.status === "pending").length)
const acceptedLeads = computed(() => leadsList.value.filter((l) => ["accepted", "paid", "finished"].includes(l.status)).length)

// Leads filtrés selon la recherche et le statut sélectionné
const filteredLeads = computed(() => {
  return leadsList.value.filter((lead) => {
    // Filtre par statut
    if (selectedStatus.value === 'pending' && lead.status !== 'pending') return false
    if (selectedStatus.value === 'accepted' && !['accepted', 'paid', 'finished'].includes(lead.status)) return false
    if (selectedStatus.value === 'refused' && lead.status !== 'refused') return false

    // Filtre par recherche textuelle
    if (searchQuery.value.trim() !== "") {
      const q = searchQuery.value.toLowerCase()
      const matchCompany = lead.companyName?.toLowerCase().includes(q)
      const matchMission = lead.missionTitle?.toLowerCase().includes(q)
      const matchContact = `${lead.contactFirstName} ${lead.contactLastName}`.toLowerCase().includes(q)
      const matchReferrer = `${lead.referrerFirstName} ${lead.referrerLastName}`.toLowerCase().includes(q)
      
      return matchCompany || matchMission || matchContact || matchReferrer
    }

    return true
  })
})

const fetchLeads = async () => {
  loading.value = true
  errorMessage.value = ""
  try {
    const res: any = await $api("/api/leads")
    leadsList.value = res.leads || []
  } catch (err: any) {
    errorMessage.value = err?.data?.message || "Erreur lors du chargement des leads."
  } finally {
    loading.value = false
  }
}

// Action rapide admin pour modifier le statut à la volée
const updateLeadStatus = async (leadId: number, newStatus: string) => {
  errorMessage.value = ""
  successMessage.value = ""
  try {
    await $api(`/api/leads/${leadId}`, {
      method: "PUT",
      body: { status: newStatus }
    })
    successMessage.value = "Statut mis à jour avec succès."
    await fetchLeads()
  } catch (err: any) {
    errorMessage.value = err?.data?.message || "Erreur lors de la modification du statut."
  }
}

const viewLead = (lead: any) => {
  if (lead.id) {
    navigateTo(`/leads/${lead.id}`)
  }
}

onMounted(() => {
  fetchLeads()
})
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-wrapper">
      <header class="dashboard-header">
        <div>
          <h1>Tableau de bord - {{ isAdmin ? "Administrateur" : "Apporteur" }}</h1>
          <p class="subtitle">
            {{ isAdmin ? "Vue globale de tous les leads de la plateforme" : "Suivez l'état de vos opportunités d'affaires" }}
          </p>
        </div>
        <div class="header-actions">
          <NuxtLink v-if="isAdmin" to="/admin/users" class="btn-secondary">Gérer les utilisateurs</NuxtLink>
          <NuxtLink v-if="!isAdmin" to="/leads/earnings" class="btn-earnings">💹 Mes stats</NuxtLink>
          <NuxtLink to="/leads/new" class="btn-primary">+ Nouveau Lead</NuxtLink>
          <Logout />
        </div>
      </header>

      <div class="kpi-grid">
        <div class="kpi-card">
          <span class="kpi-title">Total Leads</span>
          <span class="kpi-value">{{ totalLeads }}</span>
        </div>
        <div class="kpi-card warning">
          <span class="kpi-title">En attente</span>
          <span class="kpi-value">{{ pendingLeads }}</span>
        </div>
        <div class="kpi-card success">
          <span class="kpi-title">Validés / Payés</span>
          <span class="kpi-value">{{ acceptedLeads }}</span>
        </div>
      </div>

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

      <DashboardFilters 
        v-model:searchQuery="searchQuery" 
        v-model:selectedStatus="selectedStatus" 
      />

      <div v-if="loading" class="loading-state">Chargement de vos leads...</div>

      <div v-else-if="filteredLeads.length === 0" class="empty-state">
        <p>Aucun lead ne correspond à votre recherche.</p>
      </div>

      <DashboardTable 
        v-else 
        :leads="filteredLeads" 
        :isAdmin="isAdmin" 
        @view="viewLead" 
        @updateStatus="updateLeadStatus" 
      />
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #f4f6f9;
  padding: 2rem 1rem;
}
.dashboard-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.dashboard-header h1 {
  font-size: 1.75rem;
  color: #1f2937;
  margin: 0;
}
.subtitle {
  color: #6b7280;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
.kpi-card {
  background: white;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.kpi-title {
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 500;
}
.kpi-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #111827;
}
.btn-primary {
  background-color: #2563eb;
  color: white;
  padding: 0.65rem 1.25rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  white-space: nowrap;
}
.btn-secondary {
  color: #2563eb;
  text-decoration: underline;
  font-size: 0.9rem;
}
.empty-state, .loading-state {
  background: white;
  padding: 3rem;
  text-align: center;
  border-radius: 8px;
  color: #6b7280;
}
.error-message {
  padding: 0.75rem;
  background-color: #fee2e2;
  color: #991b1b;
  border-radius: 6px;
}
.success-message {
  padding: 0.75rem;
  background-color: #d1fae5;
  color: #065f46;
  border-radius: 6px;
}

.btn-earnings {
  background-color: #dbeafe;
  color: #1e40af;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  &:hover {
    background-color: #bfdbfe;
  }
}
</style>