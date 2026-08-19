<script setup lang="ts">
defineProps<{
  leads: any[]
  isAdmin: boolean
}>()

const emit = defineEmits(['view', 'updateStatus'])

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
    case "finished": return { label: "Terminé", class: "badge-paid" }
    default: return { label: status, class: "badge-default" }
  }
}
</script>

<template>
  <div class="table-container">
    <table class="leads-table">
      <thead>
        <tr>
          <th>Statut</th>
          <th v-if="isAdmin">
            Apporteur
          </th>
          <th>Début estimé</th>
          <th>Société</th>
          <th>Mission</th>
          <th>Contact & Coordonnées</th>
          <th>Commission</th>
          <th v-if="isAdmin">
            Actions Rapides
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="lead in leads"
          :key="lead.id"
          class="interactive-dashboard-row"
          @click="emit('view', lead)"
        >
          <td data-label="Statut">
            <span
              class="badge"
              :class="getStatusBadge(lead.status).class"
            >
              {{ getStatusBadge(lead.status).label }}
            </span>
          </td>
          <td
            v-if="isAdmin"
            data-label="Apporteur"
          >
            <div class="font-bold">
              {{ lead.referrerFirstName }} {{ lead.referrerLastName }}
            </div>
            <div class="text-muted">
              {{ lead.referrerEmail }}
            </div>
          </td>
          <td data-label="Début estimé">
            {{ formatDate(lead.missionStartDate) }}
          </td>
          <td
            data-label="Société"
            class="font-bold"
          >
            {{ lead.companyName }}
          </td>
          <td data-label="Mission">
            {{ lead.missionTitle }}
          </td>
          <td data-label="Contact & Coordonnées">
            <div class="contact-info-wrapper">
              <div class="contact-name">
                {{ lead.contactFirstName }} {{ lead.contactLastName }}
              </div>
              <div
                v-if="lead.clientEmail"
                class="text-muted"
              >
                ✉️ <a
                  :href="`mailto:${encodeURIComponent(lead.clientEmail)}`"
                  @click.stop
                >{{ lead.clientEmail }}</a>
              </div>
              <div
                v-if="lead.clientPhone"
                class="text-muted"
              >
                📞 <a
                  :href="`tel:${lead.clientPhone}`"
                  @click.stop
                >{{ lead.clientPhone }}</a>
              </div>
            </div>
          </td>
          <td data-label="Commission">
            {{ lead.commissionRate }}%
          </td>
          
          <td
            v-if="isAdmin"
            data-label="Actions Rapides"
            @click.stop
          >
            <select 
              :value="lead.status" 
              class="quick-status-select"
              @change="(e: any) => emit('updateStatus', lead.id, e.target.value)"
            >
              <option value="pending">
                En attente
              </option>
              <option value="accepted">
                Validé
              </option>
              <option value="refused">
                Refusé
              </option>
              <option value="finished">
                Terminé
              </option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
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
  vertical-align: middle;
}
.font-bold { font-weight: 600; color: #111827; }
.contact-name { font-weight: 500; color: #111827; margin-bottom: 0.15rem; }
.text-muted { color: #6b7280; font-size: 0.8rem; line-height: 1.2; word-break: break-all; }

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

.quick-status-select {
  padding: 0.35rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.8rem;
  background-color: white;
  cursor: pointer;
}

.interactive-dashboard-row {
  cursor: pointer;
  &:hover { background-color: #f9fafb; }
}

@media (max-width: 768px) {
  .table-container { background: transparent; border: none; }
  .leads-table, .leads-table thead, .leads-table tbody, .leads-table th, .leads-table td, .leads-table tr { display: block; }
  .leads-table thead { display: none; }
  .leads-table tr { background: white; margin-bottom: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem; }
  .leads-table td { display: flex; justify-content: space-between; align-items: flex-start; padding: 0.6rem 0; border-bottom: 1px solid #f3f4f6; text-align: right; }
  .leads-table td::before { content: attr(data-label); font-weight: 600; color: #374151; text-align: left; margin-right: 1rem; }
}
</style>