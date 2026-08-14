<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: string
}>()

const badgeConfig = computed(() => {
  switch (props.status) {
    case 'pending':
      return { label: 'En attente', class: 'badge-pending' }
    case 'accepted':
      return { label: 'Validé', class: 'badge-accepted' }
    case 'refused':
      return { label: 'Refusé', class: 'badge-refused' }
    case 'finished':
      return { label: 'Clôturé / Payé', class: 'badge-paid' }
    default:
      return { label: props.status, class: 'badge-default' }
  }
})
</script>

<template>
  <span class="badge" :class="badgeConfig.class">
    {{ badgeConfig.label }}
  </span>
</template>