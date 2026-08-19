<script setup lang="ts">
defineProps<{
  total: number
  pending: number
  accepted: number
  finished: number
}>()
</script>

<template>
  <section
    class="kpi-grid"
    aria-label="Indicateurs clés de performance des leads"
  >
    <article class="kpi-card">
      <span class="kpi-label">Total Leads</span>
      <span class="kpi-value">{{ total }}</span>
    </article>

    <article class="kpi-card">
      <span class="kpi-label">En attente</span>
      <span class="kpi-value kpi-pending">{{ pending }}</span>
    </article>

    <article class="kpi-card">
      <span class="kpi-label">Validés</span>
      <span class="kpi-value kpi-accepted">{{ accepted }}</span>
    </article>

    <article class="kpi-card">
      <span class="kpi-label">Clôturés / Payés</span>
      <span class="kpi-value kpi-finished">{{ finished }}</span>
    </article>
  </section>
</template>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
}

.kpi-card {
  background: white;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }
}

.kpi-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.kpi-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
}

.kpi-pending { 
  color: #d97706; 
}

.kpi-accepted { 
  color: #059669; 
}

.kpi-finished { 
  color: #2563eb; 
}
</style>