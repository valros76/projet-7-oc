<script setup lang="ts">
import Logout from '~/components/auth/Logout.vue'

definePageMeta({
  middleware: "auth",
})

const { $api } = useNuxtApp()
const authStore = useAuth()

watchEffect(() => {
  if (authStore.user.value && authStore.user.value.role !== 'admin') {
    navigateTo('/leads/dashboard')
  }
})

const usersList = ref<any[]>([])
const loading = ref(true)
const errorMessage = ref("")
const successMessage = ref("")

const fetchUsers = async () => {
  loading.value = true
  errorMessage.value = ""
  try {
    const res: any = await $api("/api/users")
    usersList.value = res.users || []
  } catch (err: any) {
    errorMessage.value = err?.data?.message || "Erreur lors du chargement des utilisateurs."
  } finally {
    loading.value = false
  }
}

const updateUserRole = async (userId: number, newRole: string) => {
  errorMessage.value = ""
  successMessage.value = ""
  try {
    await $api(`/api/users/${userId}`, {
      method: "PUT",
      body: { role: newRole }
    })
    successMessage.value = "Rôle mis à jour avec succès."
    await fetchUsers()
  } catch (err: any) {
    errorMessage.value = err?.data?.message || "Erreur lors de la modification du rôle."
  }
}

const deleteUser = async (userId: number, userName: string) => {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userName} ?`)) {
    return
  }

  errorMessage.value = ""
  successMessage.value = ""
  try {
    await $api(`/api/users/${userId}`, {
      method: "DELETE"
    })
    successMessage.value = "Utilisateur supprimé avec succès."
    await fetchUsers()
  } catch (err: any) {
    errorMessage.value = err?.data?.message || "Erreur lors de la suppression de l'utilisateur."
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="admin-container">
    <div class="admin-wrapper">
      <header class="admin-header">
        <div>
          <h1>Gestion des utilisateurs</h1>
          <p class="subtitle">Administrez les comptes et les rôles de la plateforme</p>
        </div>
        <div class="header-actions">
          <NuxtLink to="/leads/dashboard" class="btn-secondary">← Retour au tableau de bord</NuxtLink>
          <Logout />
        </div>
      </header>

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

      <div v-if="loading" class="loading-state">Chargement des utilisateurs...</div>

      <div v-else class="table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Rôle</th>
              <th>Inscrit le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in usersList" :key="user.id">
              <td data-label="Utilisateur" class="font-bold">
                {{ user.firstName }} {{ user.lastName }}
              </td>
              <td data-label="Email">{{ user.email }}</td>
              <td data-label="Téléphone">{{ user.phone || '-' }}</td>
              <td data-label="Rôle">
                <span :class="['badge', user.role === 'admin' ? 'badge-admin' : 'badge-referrer']">
                  {{ user.role === 'admin' ? 'Administrateur' : 'Apporteur' }}
                </span>
              </td>
              <td data-label="Inscrit le">{{ formatDate(user.createdAt) }}</td>
              <td data-label="Actions" class="actions-cell">
                <select 
                  :value="user.role" 
                  @change="(e: any) => updateUserRole(user.id, e.target.value)"
                  class="role-select"
                >
                  <option value="referrer">Apporteur</option>
                  <option value="admin">Administrateur</option>
                </select>
                <button 
                  @click="deleteUser(user.id, `${user.firstName} ${user.lastName}`)" 
                  class="btn-delete"
                  title="Supprimer l'utilisateur"
                >
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-container {
  min-height: 100vh;
  background-color: #f4f6f9;
  padding: 2rem 1rem;
}
.admin-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.admin-header h1 {
  font-size: 1.75rem;
  color: #1f2937;
  margin: 0;
}
.subtitle {
  color: #6b7280;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.table-container {
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}
.admin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}
.admin-table th {
  background-color: #f9fafb;
  padding: 0.75rem 1rem;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
}
.admin-table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  color: #4b5563;
  vertical-align: middle;
}
.font-bold {
  font-weight: 600;
  color: #111827;
}
.badge {
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
}
.badge-admin {
  background-color: #dbeafe;
  color: #1e40af;
}
.badge-referrer {
  background-color: #f3f4f6;
  color: #374151;
}
.actions-cell {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.role-select {
  padding: 0.35rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.8rem;
  background-color: white;
  cursor: pointer;
}
.btn-delete {
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 0.3rem 0.5rem;
  cursor: pointer;
  font-size: 0.8rem;
  &:hover {
    background-color: #fee2e2;
    border-color: #f87171;
  }
}
.btn-secondary {
  color: #2563eb;
  text-decoration: underline;
  font-size: 0.9rem;
  font-weight: 500;
}
.loading-state {
  background: white;
  padding: 3rem;
  text-align: center;
  border-radius: 8px;
  color: #6b7280;
}
.error-message {
  padding: 0.75rem;
  background-color: #fee2e2;
  color: #991b1b;
  border-radius: 6px;
}
.success-message {
  padding: 0.75rem;
  background-color: #d1fae5;
  color: #065f46;
  border-radius: 6px;
}

@media (max-width: 768px) {
  .admin-table, .admin-table thead, .admin-table tbody, .admin-table th, .admin-table td, .admin-table tr {
    display: block;
  }
  .admin-table thead {
    display: none;
  }
  .admin-table tr {
    background: white;
    margin-bottom: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
  }
  .admin-table td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 0;
    border-bottom: 1px solid #f3f4f6;
    text-align: right;
  }
  .admin-table td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #374151;
    text-align: left;
    margin-right: 1rem;
  }
  .actions-cell {
    justify-content: flex-end;
  }
}
</style>