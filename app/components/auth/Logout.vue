<script setup lang="ts">
const { logout } = useAuth()

const handleLogout = async () => {
  await logout()
}
</script>

<template>
  <button 
    type="button" 
    class="btn-logout" 
    @click="handleLogout"
    aria-label="Se déconnecter de l'application"
  >
    Déconnexion
  </button>
</template>

<style scoped>
.btn-logout {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.95rem;
  color: #dc2626;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  text-align: left;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: #fee2e2;
    color: #991b1b;
  }

  &:focus-visible {
    outline: 2px solid #dc2626;
    outline-offset: 2px;
  }
}
</style>