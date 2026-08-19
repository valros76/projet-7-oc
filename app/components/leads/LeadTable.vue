<script setup lang="ts">
import BadgeStatus from '~/components/common/BadgeStatus.vue'

defineProps<{
  leadsList: any[]
  loading: boolean
}>()

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })
}

const viewOneLead = (lead: Partial<Lead>) => {
  navigateTo(`/leads/${lead.id}`)
};
</script>

<template>
  <div
    class="table-responsive-wrapper"
    role="region"
    aria-label="Liste des leads"
    tabindex="0"
  >
    <div
      v-if="loading"
      class="loading-state"
      aria-live="polite"
    >
      Chargement des données en cours...
    </div>

    <table
      v-else
      class="leads-table"
    >
      <caption>Tableau récapitulatif des apporteurs d'affaires et de leurs leads</caption>
      <thead>
        <tr>
          <th scope="col">
            Société
          </th>
          <th scope="col">
            Mission
          </th>
          <th scope="col">
            Date de soumission
          </th>
          <th scope="col">
            Statut
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="lead in leadsList"
          :key="lead.id"
          class="lead-row"
          @click="viewOneLead(lead)"
        >
          <td
            data-label="Société"
            class="font-bold"
          >
            {{ lead.companyName }}
          </td>
          <td data-label="Mission">
            {{ lead.missionTitle }}
          </td>
          <td data-label="Date">
            {{ formatDate(lead.createdAt) }}
          </td>
          <td data-label="Statut">
            <BadgeStatus :status="lead.status" />
          </td>
        </tr>
        <tr v-if="leadsList.length === 0">
          <td
            colspan="4"
            class="empty-state"
          >
            Aucun lead enregistré pour le moment.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-responsive-wrapper {
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow-x: auto; /* Permet le scroll horizontal propre sur mobile */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  outline: none;

  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  }
}

.leads-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
  min-width: 600px; /* Force un minimum pour éviter l'écrasement sur mobile */
}

.leads-table caption {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.leads-table th {
  background-color: #f8fafc;
  padding: 0.75rem 1rem;
  color: #334155;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
}

.leads-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  color: #475569;
  vertical-align: middle;
}

.font-bold { 
  font-weight: 600; 
  color: #0f172a; 
}

.loading-state, .empty-state {
  padding: 3rem;
  text-align: center;
  color: #64748b;
  font-size: 0.95rem;
}

.lead-row{
  cursor:pointer;
  background-color:inherit;
  transition:background-color .375s ease-out;

  &:hover{
    background-color:#ededed;
  }
}
</style>