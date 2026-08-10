<script setup lang="ts">
defineProps<{
  show: boolean
  message: string
  type?: 'success' | 'error' | 'info'
}>()

defineEmits(['close'])
</script>

<template>
  <Transition name="toast">
    <div 
      v-if="show" 
      class="toast" 
      :class="type || 'success'"
      role="status"
      aria-live="polite"
    >
      <span class="toast-icon" aria-hidden="true">
        {{ type === 'error' ? '❌' : type === 'info' ? 'ℹ️' : '✅' }}
      </span>
      <p class="toast-message">{{ message }}</p>
      <button 
        type="button" 
        class="toast-close" 
        @click="$emit('close')"
        aria-label="Fermer la notification"
      >
        ✕
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #059669;
  z-index: 1100;
  max-width: 400px;
  width: calc(100% - 3rem);
}

.toast.success {
  border-left-color: #059669;
}

.toast.error {
  border-left-color: #dc2626;
}

.toast.info {
  border-left-color: #2563eb;
}

.toast-icon {
  font-size: 1.1rem;
}

.toast-message {
  margin: 0;
  font-size: 0.9rem;
  color: #1e293b;
  font-weight: 500;
  flex: 1;
}

.toast-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  font-size: 1rem;
  padding: 0.2rem;
  border-radius: 4px;

  &:hover {
    color: #0f172a;
  }

  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}

@media (max-width: 640px) {
  .toast {
    right: 1rem;
    left: 1rem;
    bottom: 1rem;
    width: auto;
  }
}
</style>