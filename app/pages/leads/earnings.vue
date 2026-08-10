<script setup lang="ts">
import Logout from '~/components/auth/Logout.vue'

definePageMeta({
  middleware: "auth",
})

const { $api } = useNuxtApp()

const stats = ref({ pending: 0, validated: 0, paid: 0, total: 0 })
const leadsList = ref<any[]>([])
const loading = ref(true)
const errorMessage = ref("")

const fetchEarnings = async () => {
  loading.value = true
  errorMessage.value = ""
  try {
    const res: any = await $api("/api/leads/earnings")
    stats.value = res.stats || { pending: 0, validated: 0, paid: 0, total: 0 }
    leadsList.value = res.leads || []
  } catch (err: any) {
    errorMessage.value = err?.data?.message || "Erreur lors du chargement de vos données."
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending": return { label: "En attente", class: "badge-pending" }
    case "accepted": return { label: "Validé", class: "badge-accepted" }
    case "refused": return { label: "Refusé", class: "badge-refused" }
    case "finished": return { label: "Payé / Clôturé", class: "badge-paid" }
    default: return { label: status, class: "badge-default" }
  }
}

onMounted(() => {
  fetchEarnings()
})
</script>

<template>
  <div class="earnings-container">
    <div class="earnings-wrapper">
      <header class="earnings-header">
        <div>
          <h1>Mes Performances & Suivi</h1>
          <p class="subtitle">Suivez l'état d'avancement de vos leads et de vos validations</p>
        </div>
        <div class="header-actions">
          <NuxtLink to="/leads/dashboard" class="btn-secondary">← Retour au tableau de bord</NuxtLink>
          <Logout />
        </div>
      </header>

      <div class="kpi-grid">
        <div class="kpi-card">
          <span class="kpi-title">Leads en attente</span>
          <span class="kpi-value">{{ stats.pending }}</span>
        </div>
        <div class="kpi-card warning">
          <span class="kpi-title">Leads validés</span>
          <span class="kpi-value">{{ stats.validated }}</span>
        </div>
        <div class="kpi-card success">
          <span class="kpi-title">Leads payés / soldés</span>
          <span class="kpi-value">{{ stats.paid }}</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-title">Total partagés</span>
          <span class="kpi-value">{{ stats.total }}</span>
        </div>
      </div>

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

      <div v-if="loading" class="loading-state">Chargement de vos données...</div>

      <div v-else class="table-container">
        <table class="earnings-table">
          <thead>
            <tr>
              <th>Société</th>
              <th>Mission</th>
              <th>Date de soumission</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lead in leadsList" :key="lead.id">
              <td data-label="Société" class="font-bold">{{ lead.companyName }}</td>
              <td data-label="Mission">{{ lead.missionTitle }}</td>
              <td data-label="Date">{{ formatDate(lead.createdAt) }}</td>
              <td data-label="Statut">
                <span class="badge" :class="getStatusBadge(lead.status).class">
                  {{ getStatusBadge(lead.status).label }}
                </span>
              </td>
            </tr>
            <tr v-if="leadsList.length === 0">
              <td colspan="4" class="empty-state">Aucun lead enregistré pour le moment.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.earnings-container {
  min-height: 100vh;
  background-color: #f4f6f9;
  padding: 2rem 1rem;
}
.earnings-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.earnings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.earnings-header h1 {
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
.table-container {
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}
.earnings-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}
.earnings-table th {
  background-color: #f9fafb;
  padding: 0.75rem 1rem;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
}
.earnings-table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  color: #4b5563;
  vertical-align: middle;
}
.font-bold { font-weight: 600; color: #111827; }

.badge {
  width: max-content;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
}
.badge-pending { background-color: #fef3c7; color: #92400e; }
.badge-accepted { background-color: #d1fae5; color: #065f46; }
.badge-refused { background-color: #fee2e2; color: #991b1b; }
.badge-paid { background-color: #dbeafe; color: #1e40af; }

.btn-secondary {
  color: #2563eb;
  text-decoration: underline;
  font-size: 0.9rem;
  font-weight: 500;
}
.loading-state, .empty-state {
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
</style>