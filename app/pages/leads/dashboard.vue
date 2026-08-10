<script setup lang="ts">
definePageMeta({
  middleware: "auth"
});

const { $api } = useNuxtApp();
const authStore = useAuth();

const leadsList = ref<any[]>([]);
const loading = ref(true);
const errorMessage = ref("");

const totalLeads = computed(() => leadsList.value.length);
const pendingLeads = computed(() => leadsList.value.filter(l => l.status === "pending").length);
const acceptedLeads = computed(() => leadsList.value.filter(l => l.status === "accepted" || l.status === "paid").length);

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return { label: "En attente", class: "badge-pending" }
    case "accepted":
      return { label: "Validé", class: "badge-accepted" }
    case "rejected":
      return { label: "Refusé", class: "badge-rejected" }
    case "paid":
      return { label: "Payé", class: "badge-paid" }
    default:
      return { label: status, class: "badge-default" }
  }
};

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
};

onMounted(() => {
  fetchLeads()
});
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-wrapper">
      <header class="dashboard-header">
        <div>
          <h1>Tableau de bord - Apporteur</h1>
          <p class="subtitle">Suivez l'état de vos opportunités d'affaires</p>
        </div>
        <NuxtLink to="/leads/new" class="btn-primary">+ Nouveau Lead</NuxtLink>
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

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div v-if="loading" class="loading-state">
        Chargement de vos leads...
      </div>

      <div v-else-if="leadsList.length === 0" class="empty-state">
        <p>Aucun lead n'a été créé pour le moment.</p>
        <NuxtLink to="/leads/new" class="btn-secondary">Créer votre premier lead</NuxtLink>
      </div>

      <div v-else class="table-container">
        <table class="leads-table">
          <thead>
            <tr>
              <th>Statut</th>
              <th>Début estimé</th>
              <th>Société</th>
              <th>Mission</th>
              <th>Contact & Coordonnées</th>
              <th>Commission</th>
              <th>Créé le</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lead in leadsList" :key="lead.id">
              <td data-label="Statut">
                <span class="badge" :class="getStatusBadge(lead.status).class">
                  {{ getStatusBadge(lead.status).label }}
                </span>
              </td>
              <td data-label="Début estimé">{{ formatDate(lead.missionStartDate) }}</td>
              <td data-label="Société" class="font-bold">{{ lead.companyName }}</td>
              <td data-label="Mission">{{ lead.missionTitle }}</td>
              <td data-label="Contact & Coordonnées">
                <div class="contact-info-wrapper">
                  <div class="contact-name">{{ lead.contactFirstName }} {{ lead.contactLastName }}</div>
                  <div class="text-muted" v-if="lead.clientEmail">
                    ✉️ <a :href="`mailto:${encodeURIComponent(lead.clientEmail)}`">{{ lead.clientEmail }}</a>
                  </div>
                  <div class="text-muted" v-if="lead.clientPhone">
                    📞 <a :href="`tel:${lead.clientPhone}`">{{ lead.clientPhone }}</a>
                  </div>
                </div>
              </td>
              <td data-label="Commission">{{ lead.commissionRate }}%</td>
              <td data-label="Créé le">{{ formatDate(lead.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
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
.leads-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}
.leads-table th {
  background-color: #f9fafb;
  padding: 0.75rem 1rem;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
}
.leads-table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  color: #4b5563;
  vertical-align: top;
}
.font-bold { font-weight: 600; color: #111827; }
.contact-name { font-weight: 500; color: #111827; margin-bottom: 0.15rem; }
.text-muted { color: #6b7280; font-size: 0.8rem; line-height: 1.2; word-break: break-all; }

/* Badges */
.badge {
  width:max-content;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
}
.badge-pending { background-color: #fef3c7; color: #92400e; }
.badge-accepted { background-color: #d1fae5; color: #065f46; }
.badge-rejected { background-color: #fee2e2; color: #991b1b; }
.badge-paid { background-color: #dbeafe; color: #1e40af; }

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

/* --- RESPONSIVE MOBILE CSS (< 768px) --- */
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: stretch;
  }
  .dashboard-header .btn-primary {
    text-align: center;
  }
  .table-container {
    background: transparent;
    border: none;
  }
  .leads-table, 
  .leads-table thead, 
  .leads-table tbody, 
  .leads-table th, 
  .leads-table td, 
  .leads-table tr {
    display: block;
  }
  .leads-table thead {
    display: none;
  }
  .leads-table tr {
    background: white;
    margin-bottom: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  .leads-table td {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0.6rem 0;
    border-bottom: 1px solid #f3f4f6;
    text-align: right;
  }
  .leads-table td:last-child {
    border-bottom: none;
  }
  .leads-table td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #374151;
    text-align: left;
    margin-right: 1rem;
    flex-shrink: 0;
  }
  .contact-info-wrapper {
    text-align: right;
  }
}
</style>