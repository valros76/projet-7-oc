<script setup lang="ts">
import { ref, computed } from 'vue'
import LeadKpiGrid from '~/components/leads/LeadKpiGrid.vue'
import LeadFilters from '~/components/leads/LeadFilters.vue'
import LeadTable from '~/components/leads/LeadTable.vue'
import LeadModal from '~/components/leads/LeadModal.vue'
import Pagination from '~/components/common/Pagination.vue'
import ToastNotification from '~/components/common/ToastNotification.vue'

definePageMeta({
  middleware: 'auth'
})

// États de l'application
const loading = ref(false)
const searchQuery = ref('')
const selectedStatus = ref('all')
const currentPage = ref(1)
const itemsPerPage = ref(5)

// État de la modale
const isModalOpen = ref(false)
const selectedLead = ref<any | null>(null)

// État du Toast
const toast = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error' | 'info'
})

const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 4000)
}

// Données de test (à remplacer par ton appel API / Store Pinia)
const leadsList = ref([
  { id: 1, companyName: 'Tech Corp', missionTitle: 'Refonte UI/UX', createdAt: '2026-06-10', status: 'pending' },
  { id: 2, companyName: 'Innovate SA', missionTitle: 'Migration Cloud', createdAt: '2026-06-08', status: 'accepted' },
  { id: 3, companyName: 'Digital Flow', missionTitle: 'Audit Sécurité', createdAt: '2026-06-01', status: 'finished' },
  { id: 4, companyName: 'Web Agency', missionTitle: 'Création site e-commerce', createdAt: '2026-05-28', status: 'refused' },
])

// Calcul des KPI
const kpis = computed(() => {
  const total = leadsList.value.length
  const pending = leadsList.value.filter(l => l.status === 'pending').length
  const accepted = leadsList.value.filter(l => l.status === 'accepted').length
  const finished = leadsList.value.filter(l => l.status === 'finished').length
  return { total, pending, accepted, finished }
})

// Filtrage intelligent
const filteredLeads = computed(() => {
  return leadsList.value.filter(lead => {
    const matchesSearch = lead.companyName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          lead.missionTitle.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = selectedStatus.value === 'all' || lead.status === selectedStatus.value
    return matchesSearch && matchesStatus
  })
})

// Pagination des résultats filtrés
const totalPages = computed(() => Math.ceil(filteredLeads.value.length / itemsPerPage.value) || 1)

const paginatedLeads = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredLeads.value.slice(start, end)
})

// Actions UI
const openLeadDetails = (lead: any) => {
  selectedLead.value = lead
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedLead.value = null
}
</script>

<template>
  <NuxtLayout>
    <div class="dashboard-container">
      <LeadKpiGrid v-bind="kpis" />

      <LeadFilters 
        v-model:searchQuery="searchQuery"
        v-model:selectedStatus="selectedStatus"
      />

      <LeadTable 
        :leadsList="paginatedLeads" 
        :loading="loading"
        @row-click="openLeadDetails"
      />

      <Pagination 
        v-if="totalPages > 1"
        v-model:currentPage="currentPage"
        :totalPages="totalPages"
      />

      <LeadModal 
        :isOpen="isModalOpen"
        :lead="selectedLead"
        @close="closeModal"
      >
        <template #footer>
          <button type="button" class="btn-primary" @click="showToast('Action effectuée avec succès !'); closeModal()">
            Valider les modifications
          </button>
        </template>
      </LeadModal>

      <ToastNotification 
        :show="toast.show"
        :message="toast.message"
        :type="toast.type"
        @close="toast.show = false"
      />
    </div>
  </NuxtLayout>
</template>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.btn-primary {
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #1d4ed8;
  }

  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
}
</style>