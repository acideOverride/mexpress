<template>
  <div class="app-container">
    <div class="dashboard">
      <h1>MontPC CRM Dashboard</h1>
      
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Customers</h3>
          <div class="stat-value">{{ customerCount }}</div>
        </div>
        
        <div class="stat-card">
          <h3>Active Tickets</h3>
          <div class="stat-value">{{ ticketCount }}</div>
        </div>
        
        <div class="stat-card">
          <h3>Monthly Revenue</h3>
          <div class="stat-value">${{ revenue.toLocaleString() }}</div>
        </div>
      </div>
      
      <div class="card-panel">
        <h2>Quick Actions</h2>
        <div class="action-buttons">
          <button class="btn-primary" @click="refresh">Refresh Data</button>
          <button class="btn-secondary">View Customers</button>
          <button class="btn-success">View Tickets</button>
          <button class="btn-danger">Create New Ticket</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Dashboard metrics (reactive state)
const customerCount = ref(24)
const ticketCount = ref(13)
const revenue = ref(18500)

// Refresh function to reload data
const refresh = () => {
  customerCount.value = Math.floor(Math.random() * 50) + 10
  ticketCount.value = Math.floor(Math.random() * 30) + 5
  revenue.value = Math.floor(Math.random() * 25000) + 10000
}

// Lifecycle hook
onMounted(() => {
  console.log('Dashboard App mounted successfully')
})
</script>

<style scoped>
/* App container */
.app-container {
  width: 100%;
  min-height: 100vh;
}

/* Dashboard layout */
.dashboard {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
}

h1 {
  font-size: 28px;
  color: #1e40af;
  margin-bottom: 24px;
}

h2 {
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 16px;
}

h3 {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 8px;
}

/* Stats grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  margin: 10px 0 5px 0;
}

/* Card and buttons */
.card-panel {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

button {
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
}

.btn-secondary {
  background-color: #3b82f6;
  color: white;
}

.btn-success {
  background-color: #10b981;
  color: white;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

/* Responsive layout */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>