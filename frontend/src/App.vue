<script setup>
import { ref, onMounted } from 'vue';

const apiStatus = ref('Cargando...');
const backendUrl = 'http://localhost:3000/api/v1/health';

const checkBackendStatus = async () => {
  try {
    const response = await fetch(backendUrl);
    const data = await response.json();
    apiStatus.value = `${data.message} (${data.status})`;
  } catch (error) {
    apiStatus.value = 'Error al conectar con la API REST Backend';
    console.error(error);
  }
};

onMounted(() => {
  checkBackendStatus();
});
</script>

<template>
  <main class="container">
    <h1>🥑 Tostadas TOPIN - Entorno de Desarrollo</h1>
    <div class="card">
      <h2>Estado de la API Backend (Node.js + Express):</h2>
      <p :class="{ ok: apiStatus.includes('OK'), error: !apiStatus.includes('OK') }">
        {{ apiStatus }}
      </p>
    </div>
  </main>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 2rem auto;
  font-family: sans-serif;
  text-align: center;
}
.card {
  border: 1px solid #ccc;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1rem;
}
.ok {
  color: #2e7d32;
  font-weight: bold;
}
.error {
  color: #c62828;
  font-weight: bold;
}
</style>