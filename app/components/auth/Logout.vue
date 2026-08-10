<script lang="ts" setup>
import { ref } from "vue";
const { logout } = useAuth();
const errorMessage = ref("");
const successMessage = ref("");
const handleLogout = async () => {
  try {
    await logout();
    successMessage.value = "Déconnecté avec succès.";
  } catch (err) {
    errorMessage.value = "Erreur lors de la déconnexion.";
  }
};
</script>

<template>
  <button
    @click="handleLogout"
    class="btn-danger"
  >
    Se déconnecter

    <span
      v-if="errorMessage"
      class="error"
    >
      {{ errorMessage }}
    </span>
    <span
      v-if="successMessage"
      class="success"
    >
      {{ successMessage }}
    </span>
  </button>
</template>

<style scoped></style>
