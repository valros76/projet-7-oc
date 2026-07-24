<script setup lang="ts">
import authMiddleware from '~/middleware/auth'
definePageMeta({
  middleware: [authMiddleware]
})
</script>

<template>
  <div>
    <h1>Mon Tableau de Bord Sécurisé</h1>
  </div>
</template>