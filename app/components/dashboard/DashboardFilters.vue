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
        placeholder="Rechercher par société, mission, contact..."
        class="search-input" 
        @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
      >
    </div>

    <div class="status-tabs">
      <button 
        :class="['tab-btn', selectedStatus === 'all' ? 'active' : '']"
        @click="$emit('update:selectedStatus', 'all')"
      >
        Tous
      </button>
      <button 
        :class="['tab-btn', selectedStatus === 'pending' ? 'active' : '']"
        @click="$emit('update:selectedStatus', 'pending')"
      >
        En attente
      </button>
      <button 
        :class="['tab-btn', selectedStatus === 'accepted' ? 'active' : '']"
        @click="$emit('update:selectedStatus', 'accepted')"
      >
        Validés / Payés
      </button>
      <button 
        :class="['tab-btn', selectedStatus === 'refused' ? 'active' : '']"
        @click="$emit('update:selectedStatus', 'refused')"
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
  border: 1px solid #e5e7eb;
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
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;
  &:focus { border-color: #2563eb; }
}
.status-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.tab-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background-color: #f3f4f6; }
  &.active {
    background-color: #2563eb;
    color: white;
    border-color: #2563eb;
  }
}
</style>