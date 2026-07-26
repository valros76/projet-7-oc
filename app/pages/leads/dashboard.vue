<script setup lang="ts">
import type { LeadsApiResponse } from '@shared/types'

definePageMeta({
  middleware: 'auth'
})

const { $api } = useNuxtApp()
const { user, logout } = useAuth()

const { data: response, refresh, error } = await useAsyncData<LeadsApiResponse>('leads-list', () => 
  $api('/api/leads')
)

const leads = computed(() => response.value?.leads || [])
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-wrapper">
      
      <header class="dashboard-header">
        <div class="header-info">
          <h1>Tableau de bord - Apporteur</h1>
          <p v-if="user" class="subtitle">Connecté en tant que : <strong>{{ user.firstName }} {{ user.lastName }}</strong></p>
        </div>
        <div class="header-actions">
          <NuxtLink to="/leads/new" class="btn-primary">
            + Nouveau Lead
          </NuxtLink>
          <button @click="logout" class="btn-danger">
            Se déconnecter
          </button>
        </div>
      </header>

      <section class="dashboard-card">
        <h2>Mes Leads enregistrés</h2>

        <div v-if="error" class="error-message">
          Erreur lors du chargement des leads.
        </div>

        <div v-else-if="leads.length === 0" class="empty-state">
          Aucun lead pour le moment. Créez votre première opportunité !
        </div>

        <div v-else class="table-responsive">
          <table class="leads-table">
            <thead>
              <tr>
                <th>Société</th>
                <th>Contact</th>
                <th>Mission</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="lead in leads" :key="lead.id">
                <td class="font-weight-bold">{{ lead.companyName }}</td>
                <td>{{ lead.contactFirstName }} {{ lead.contactLastName }}</td>
                <td>{{ lead.missionTitle }}</td>
                <td>
                  <span class="badge" :class="`badge-${lead.status}`">
                    {{ lead.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

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
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dashboard-header {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.dashboard-header h1 {
  font-size: 1.5rem;
  color: #333333;
  margin-bottom: 0.25rem;
}

.subtitle {
  color: #666666;
  font-size: 0.9rem;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.dashboard-card {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.dashboard-card h2 {
  font-size: 1.2rem;
  color: #333333;
  margin-bottom: 1rem;
}

.table-responsive {
  overflow-x: auto;
}

.leads-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.leads-table th,
.leads-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.9rem;
  color: #4b5563;
}

.leads-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.font-weight-bold {
  font-weight: 600;
  color: #111827;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-pending {
  background-color: #fef3c7;
  color: #92400e;
}

.badge-accepted {
  background-color: #d1fae5;
  color: #065f46;
}

.badge-refused {
  background-color: #fee2e2;
  color: #991b1b;
}

.badge-finished {
  background-color: #dbeafe;
  color: #1e40af;
}

.error-message {
  padding: 1rem;
  background-color: #fee2e2;
  color: #991b1b;
  border-radius: 6px;
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 0;
  color: #6b7280;
  font-size: 0.95rem;
}
</style>