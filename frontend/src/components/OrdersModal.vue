<script setup>
import { ref, watch } from 'vue';
import { useAuth } from '../composables/useAuth.js';

const props = defineProps({
  isOpen: Boolean
});
const emit = defineEmits(['close']);

const { currentUser } = useAuth();
const pedidos = ref([]);
const loading = ref(false);
const errorMsg = ref('');

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const fetchPedidos = async () => {
  if (!currentUser.value) return;
  loading.value = true;
  errorMsg.value = '';

  try {
    const params = new URLSearchParams({
      usuario_id: currentUser.value.id,
      rol: currentUser.value.rol
    });

    const res = await fetch(`${API_URL}/api/v1/pedidos?${params.toString()}`);
    const data = await res.json();
    if (data.status === 'OK') {
      pedidos.value = data.data;
    } else {
      errorMsg.value = 'No se pudieron obtener los pedidos.';
    }
  } catch (err) {
    errorMsg.value = 'Error de conexión con el servidor.';
  } finally {
    loading.value = false;
  }
};

const updateEstado = async (pedidoId, nuevoEstado) => {
  if (currentUser.value.rol === 'cliente') return;

  try {
    const res = await fetch(`${API_URL}/api/v1/pedidos/${pedidoId}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        estado: nuevoEstado,
        rol: currentUser.value.rol
      })
    });
    const data = await res.json();
    if (data.status === 'OK') {
      fetchPedidos();
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert('Error al actualizar el estado del pedido');
  }
};

watch(() => props.isOpen, (newVal) => {
  if (newVal) fetchPedidos();
});
</script>

<template>
  <div v-if="isOpen" class="overlay" @click.self="emit('close')">
    <div class="orders-card">
      <div class="orders-header">
        <h3>
          {{ currentUser?.rol === 'cliente' ? 'Mis Pedidos Realizados' : 'Panel de Gestión de Pedidos' }}
        </h3>
        <button @click="emit('close')" class="close-btn">&times;</button>
      </div>

      <div v-if="loading" class="state-msg">Cargando datos...</div>
      <div v-else-if="errorMsg" class="state-msg error">{{ errorMsg }}</div>
      <div v-else-if="pedidos.length === 0" class="state-msg">
        {{ currentUser?.rol === 'cliente' ? 'No has realizado ningún pedido todavía.' : 'No hay pedidos registrados.' }}
      </div>

      <div v-else class="orders-list">
        <div v-for="p in pedidos" :key="p.id" class="order-item">
          <div class="order-info">
            <div class="order-title">
              <strong>Pedido #{{ p.id }}</strong>
              <span v-if="currentUser?.rol !== 'cliente'" class="client-name">— {{ p.cliente }}</span>
            </div>
            <div class="order-meta">
              <span>{{ new Date(p.creado_en).toLocaleString() }}</span>
              <strong class="total">${{ Number(p.total).toFixed(2) }}</strong>
            </div>
          </div>

          <div class="order-status-row">
            <!-- Badge visible para todos -->
            <span class="status-badge" :class="p.estado">{{ p.estado.replace('_', ' ') }}</span>
            
            <!-- Selector de cambio de estado SOLO VISIBLE PARA EMPLEADOS / ADMINS -->
            <select 
              v-if="currentUser?.rol === 'empleado' || currentUser?.rol === 'administrador'"
              :value="p.estado" 
              @change="updateEstado(p.id, $event.target.value)"
              class="status-select"
            >
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En Proceso</option>
              <option value="completado">Completado</option>
              <option value="cancelado">Cancelar Pedido</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.orders-card {
  width: 100%;
  max-width: 580px;
  max-height: 80vh;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius, 8px);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.orders-header h3 {
  font-size: 1.1rem;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-muted);
  cursor: pointer;
}

.state-msg {
  text-align: center;
  padding: 3rem 0;
  color: var(--text-muted);
}

.orders-list {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.order-item {
  border: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  border-radius: 6px;
  padding: 0.85rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-title {
  font-size: 0.95rem;
  color: var(--text-primary);
}

.client-name {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.order-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 0.2rem;
}

.total {
  color: var(--brand-orange);
}

.order-status-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-badge {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.status-badge.pendiente { background: #f39c12; color: #fff; }
.status-badge.en_proceso { background: #3498db; color: #fff; }
.status-badge.completado { background: #27ae60; color: #fff; }
.status-badge.cancelado { background: #e74c3c; color: #fff; }

.status-select {
  padding: 0.3rem 0.5rem;
  font-size: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-surface);
  color: var(--text-primary);
}
</style>