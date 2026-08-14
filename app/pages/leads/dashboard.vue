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

const { data: leadsData, pending: loading, refresh } = await useFetch<any>('/api/leads', {
  $fetch: useNuxtApp().$api
})

const rawLeads = computed(() => {
  const val = leadsData.value
  if (Array.isArray(val)) return val
  if (val && typeof val === 'object') {
    if (Array.isArray((val as any).leads)) return (val as any).leads
    if (Array.isArray((val as any).data)) return (val as any).data
  }
  return []
})

const searchQuery = ref('')
const selectedStatus = ref('all')
const currentPage = ref(1)
const itemsPerPage = ref(5)

const isModalOpen = ref(false)
const selectedLead = ref<any | null>(null)

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

const kpis = computed(() => {
  const total = rawLeads.value.length
  const pending = rawLeads.value.filter((l: any) => l.status === 'pending').length
  const accepted = rawLeads.value.filter((l: any) => l.status === 'accepted').length
  const finished = rawLeads.value.filter((l: any) => l.status === 'finished').length
  return { total, pending, accepted, finished }
})

const filteredLeads = computed(() => {
  return rawLeads.value.filter((lead: any) => {
    const company = lead.companyName || ''
    const mission = lead.missionTitle || ''
    const matchesSearch = company.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          mission.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = selectedStatus.value === 'all' || lead.status === selectedStatus.value
    return matchesSearch && matchesStatus
  })
})

const totalPages = computed(() => Math.ceil(filteredLeads.value.length / itemsPerPage.value) || 1)

const paginatedLeads = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredLeads.value.slice(start, end)
})

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