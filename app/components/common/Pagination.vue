<script setup lang="ts">
defineProps<{
  currentPage: number
  totalPages: number
}>()

defineEmits(['update:currentPage'])
</script>

<template>
  <nav class="pagination-nav" role="navigation" aria-label="Pagination des résultats">
    <button 
      type="button" 
      class="page-btn" 
      :disabled="currentPage <= 1"
      @click="$emit('update:currentPage', currentPage - 1)"
      aria-label="Aller à la page précédente"
    >
      Précédent
    </button>

    <span class="page-info" aria-current="page">
      Page <strong>{{ currentPage }}</strong> sur <strong>{{ totalPages }}</strong>
    </span>

    <button 
      type="button" 
      class="page-btn" 
      :disabled="currentPage >= totalPages"
      @click="$emit('update:currentPage', currentPage + 1)"
      aria-label="Aller à la page suivante"
    >
      Suivant
    </button>
  </nav>
</template>

<style scoped>
.pagination-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  width: 100%;
}

.page-btn {
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #f1f5f9;
    border-color: #94a3b8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f8fafc;
  }

  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
}

.page-info {
  font-size: 0.9rem;
  color: #475569;
}

@media (max-width: 480px) {
  .pagination-nav {
    flex-direction: column;
    gap: 0.75rem;
  }
  .page-btn {
    width: 100%;
  }
}
</style>