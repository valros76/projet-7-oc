<script setup lang="ts">
import { ref, computed } from 'vue'
import Logout from '~/components/auth/Logout.vue'
import { useAuth } from '~/composables/auth/useAuth'

const { user } = useAuth()
const isMenuOpen = ref(false)

const isAdmin = computed(() => {
  if (!user.value) return false
  const role = user.value.role?.toLowerCase()
  return role === 'admin' || role === 'administrator'
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<template>
  <header
    class="main-head"
    role="banner"
  >
    <div class="logo-header">
      <h1 class="main-head-title">
        Tableau de bord
      </h1>
    </div>

    <button 
      class="nav-btn" 
      :aria-expanded="isMenuOpen"
      aria-controls="main-navigation"
      :aria-label="isMenuOpen ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'"
      @click="toggleMenu"
    >
      <span
        class="nav-icon"
        aria-hidden="true"
      >{{ isMenuOpen ? '✕' : '☰' }}</span>
    </button>

    <nav 
      id="main-navigation"
      class="main-nav" 
      :class="{ open: isMenuOpen, close: !isMenuOpen }"
      role="navigation"
      aria-label="Navigation principale"
    >
      <template v-if="user">
        <NuxtLink
          to="/leads/dashboard"
          class="main-menu-links"
          @click="closeMenu"
        >
          Dashboard
        </NuxtLink>
        <NuxtLink
          to="/leads/new"
          class="main-menu-links"
          @click="closeMenu"
        >
          Ajouter un lead
        </NuxtLink>
        <NuxtLink
          v-if="isAdmin"
          to="/admin/users"
          class="main-menu-links"
          @click="closeMenu"
        >
          Users
        </NuxtLink>
        <Logout @click="closeMenu" />
      </template>

      <template v-else>
        <NuxtLink
          to="/"
          class="main-menu-links"
          @click="closeMenu"
        >
          Connexion
        </NuxtLink>
      </template>
    </nav>
  </header>
</template>

<style scoped>
.main-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 50;
}

.main-head-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.nav-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #1e293b;
  padding: 0.5rem;
  border-radius: 6px;

  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.main-menu-links {
  color: #475569;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  transition: color 0.2s, background-color 0.2s;

  &:hover, &.router-link-active {
    color: #2563eb;
    background-color: #f1f5f9;
  }

  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
}

@media (max-width: 768px) {
  .nav-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .main-nav {
    position: fixed;
    top: 70px;
    right: 1rem;
    left: 1rem;
    background: white;
    flex-direction: column;
    align-items: stretch;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    transition: opacity 0.2s ease, transform 0.2s ease;
    
    &.close {
      opacity: 0;
      pointer-events: none;
      transform: translateY(-10px);
    }

    &.open {
      opacity: 1;
      pointer-events: all;
      transform: translateY(0);
    }
  }
}
</style>