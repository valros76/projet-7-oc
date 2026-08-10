<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  isOpen: boolean
  lead: any | null
}>()

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}

// Fermeture avec la touche Échap pour l'accessibilité
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeyDown))
onUnmounted(() => window.removeEventListener('keydown', handleKeyDown))
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div 
      class="modal-container" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modal-title"
    >
      <header class="modal-header">
        <h2 id="modal-title" class="modal-title">
          {{ lead ? `Détails du lead - ${lead.companyName}` : 'Nouveau Lead' }}
        </h2>
        <button 
          type="button" 
          class="close-btn" 
          @click="handleClose"
          aria-label="Fermer la modale"
        >
          ✕
        </button>
      </header>

      <div class="modal-body">
        <slot>
          <div v-if="lead" class="lead-details">
            <p><strong>Société :</strong> {{ lead.companyName }}</p>
            <p><strong>Mission :</strong> {{ lead.missionTitle }}</p>
            <p><strong>Date de soumission :</strong> {{ lead.createdAt }}</p>
            <p><strong>Statut :</strong> {{ lead.status }}</p>
          </div>
        </slot>
      </div>

      <footer class="modal-footer">
        <slot name="footer">
          <button type="button" class="btn-secondary" @click="handleClose">Fermer</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: white;
  width: 100%;
  max-width: 550px;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 90vh;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #64748b;
  padding: 0.25rem;
  border-radius: 4px;

  &:hover {
    color: #0f172a;
    background-color: #f1f5f9;
  }

  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-secondary {
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-weight: 500;
  color: #334155;
  cursor: pointer;

  &:hover {
    background-color: #f1f5f9;
  }

  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
}

.lead-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  color: #334155;
}
</style>