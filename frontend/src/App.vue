<script setup>
import { ref, onMounted } from 'vue';
import Navbar from './components/Navbar.vue';
import ProductCard from './components/ProductCard.vue';
import CartDrawer from './components/CartDrawer.vue';
import { useTheme } from './composables/useTheme.js';

const { initTheme } = useTheme();
const productos = ref([]);
const loading = ref(true);
const error = ref(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const fetchProductos = async () => {
  try {
    const res = await fetch(`${API_URL}/api/v1/productos`);
    const data = await res.json();
    if (data.status === 'OK') {
      productos.value = data.data;
    } else {
      error.value = 'No se pudo cargar el menú en este momento.';
    }
  } catch (err) {
    error.value = 'No se pudo conectar con el servidor del menú.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  initTheme();
  fetchProductos();
});
</script>

<template>
  <div class="app-layout">
    <Navbar />

    <main class="container">
      <header class="menu-header">
        <h1>Nuestro Menú</h1>
      </header>

      <div v-if="loading" class="state-msg">Cargando...</div>
      <div v-else-if="error" class="state-msg error">{{ error }}</div>

      <section v-else class="menu-grid">
        <ProductCard 
          v-for="producto in productos" 
          :key="producto.id" 
          :product="producto" 
        />
      </section>
    </main>

    <CartDrawer />
  </div>
</template>

<style scoped>
.container {
  max-width: 1040px;
  margin: 0 auto;
  padding: 3.5rem 2rem 5rem;
}

.menu-header {
  margin-bottom: 3rem;
}

.menu-header h1 {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  column-gap: 2.5rem;
  row-gap: 3.5rem;
}

.state-msg {
  padding: 4rem 0;
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.state-msg.error {
  color: var(--danger);
}
</style>