<script setup lang="ts">
import Navbar from '~/components/layout/Navbar.vue'
</script>

<template>
  <div class="app-layout">
    <Navbar />

    <main
      id="main-content"
      class="main-content"
      role="main"
    >
      <slot />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background, #f8fafc);
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
}
</style>