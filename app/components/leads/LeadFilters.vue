<script setup lang="ts">
defineProps<{
  searchQuery: string
  selectedStatus: string
}>()

defineEmits(['update:searchQuery', 'update:selectedStatus'])
</script>

<template>
  <div class="filters-container">
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input 
        type="text" 
        :value="searchQuery"
        @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        placeholder="Rechercher par société, mission, contact..." 
        class="search-input"
      >
    </div>

    <div class="status-tabs">
      <button 
        type="button"
        @click="$emit('update:selectedStatus', 'all')"
        :class="['tab-btn', { active: selectedStatus === 'all' }]"
      >
        Tous
      </button>
      <button 
        type="button"
        @click="$emit('update:selectedStatus', 'pending')"
        :class="['tab-btn', { active: selectedStatus === 'pending' }]"
      >
        En attente
      </button>
      <button 
        type="button"
        @click="$emit('update:selectedStatus', 'accepted')"
        :class="['tab-btn', { active: selectedStatus === 'accepted' }]"
      >
        Validés
      </button>
      <button 
        type="button"
        @click="$emit('update:selectedStatus', 'finished')"
        :class="['tab-btn', { active: selectedStatus === 'finished' }]"
      >
        Payés / Clôturés
      </button>
      <button 
        type="button"
        @click="$emit('update:selectedStatus', 'refused')"
        :class="['tab-btn', { active: selectedStatus === 'refused' }]"
      >
        Refusés
      </button>
    </div>
  </div>
</template>

<style scoped>
.filters-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  font-size: 0.9rem;
}

.search-input {
  width: 100%;
  padding: 0.6rem 0.75rem 0.6rem 2.25rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  
  &:focus { 
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
}

.status-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid #e2e8f0;
  background-color: #f8fafc;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { 
    background-color: #f1f5f9; 
  }

  &.active {
    background-color: #2563eb;
    color: white;
    border-color: #2563eb;
  }
}
</style>