<script setup>
import { ref, watch, onMounted } from 'vue';
import { useAuth } from '../composables/useAuth.js';

const props = defineProps({
  isOpen: Boolean
});
const emit = defineEmits(['close', 'product-updated']);

const { currentUser } = useAuth();
const activeTab = ref('inventory'); // 'inventory' | 'products' | 'users'

const productos = ref([]);
const usuarios = ref([]);
const loading = ref(false);
const error = ref('');

// Formulario de Producto Nuevo / Edición
const isEditing = ref(false);
const currentProductId = ref(null);
const formProduct = ref({
  nombre: '',
  descripcion: '',
  precio: 0,
  existencias: 0,
  imagen_url: ''
});

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Cargar información de productos y usuarios de forma independiente
const loadAdminData = async () => {
  loading.value = true;
  error.value = '';

  // 1. Obtener productos (no se interrumpe si la ruta de usuarios falla)
  try {
    const resProd = await fetch(`${API_URL}/api/v1/productos`);
    const dataProd = await resProd.json();
    if (dataProd.status === 'OK' && Array.isArray(dataProd.data)) {
      productos.value = dataProd.data;
    }
  } catch (err) {
    console.error('Error al consultar productos:', err);
    error.value = 'No se pudo conectar con la base de datos.';
  }

  // 2. Obtener usuarios
  try {
    const resUser = await fetch(`${API_URL}/api/v1/admin/usuarios`);
    if (resUser.ok) {
      const dataUser = await resUser.json();
      if (dataUser.status === 'OK' && Array.isArray(dataUser.data)) {
        usuarios.value = dataUser.data;
      }
    }
  } catch (err) {
    console.error('Error al consultar usuarios:', err);
  } finally {
    loading.value = false;
  }
};

// Carga inicial al montar si la ventana ya inició visible
onMounted(() => {
  if (props.isOpen) {
    loadAdminData();
  }
});

// Carga automática inmediata cada vez que 'isOpen' pasa a ser 'true'
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      loadAdminData();
    }
  },
  { immediate: true }
);

// PB-15: Actualización rápida de stock
const updateStock = async (product, delta) => {
  const newStock = Math.max(0, product.existencias + delta);
  try {
    const res = await fetch(`${API_URL}/api/v1/admin/productos/${product.id}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ existencias: newStock })
    });
    const data = await res.json();
    if (data.status === 'OK') {
      product.existencias = newStock;
      emit('product-updated');
    }
  } catch (err) {
    alert('No se pudo actualizar el stock');
  }
};

// PB-14: Guardar (Crear o Editar) Producto
const saveProduct = async () => {
  const endpoint = isEditing.value 
    ? `${API_URL}/api/v1/admin/productos/${currentProductId.value}`
    : `${API_URL}/api/v1/admin/productos`;

  const method = isEditing.value ? 'PUT' : 'POST';

  try {
    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formProduct.value)
    });
    const data = await res.json();

    if (data.status === 'OK') {
      resetForm();
      await loadAdminData();
      emit('product-updated');
      activeTab.value = 'inventory';
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert('Error al guardar el producto');
  }
};

const editProduct = (prod) => {
  isEditing.value = true;
  currentProductId.value = prod.id;
  formProduct.value = { ...prod };
  activeTab.value = 'products';
};

const deleteProduct = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar este producto del menú?')) return;

  try {
    const res = await fetch(`${API_URL}/api/v1/admin/productos/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.status === 'OK') {
      await loadAdminData();
      emit('product-updated');
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert('Error al eliminar producto');
  }
};

// PB-16: Cambiar rol de usuario
const updateUserRole = async (user, newRole) => {
  try {
    const res = await fetch(`${API_URL}/api/v1/admin/usuarios/${user.id}/rol`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rol: newRole })
    });
    const data = await res.json();
    if (data.status === 'OK') {
      user.rol = newRole;
    }
  } catch (err) {
    alert('Error al actualizar el rol de usuario');
  }
};

const resetForm = () => {
  isEditing.value = false;
  currentProductId.value = null;
  formProduct.value = { nombre: '', descripcion: '', precio: 0, existencias: 0, imagen_url: '' };
};
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="emit('close')">
    <div class="modal-box">
      <header class="modal-header">
        <h2>Panel de Administración TOPIN</h2>
        <button @click="emit('close')" class="close-btn">&times;</button>
      </header>

      <!-- Control de Pestañas -->
      <nav class="admin-tabs">
        <button 
          :class="{ active: activeTab === 'inventory' }" 
          @click="activeTab = 'inventory'; loadAdminData();"
        >
          Control de Inventario
        </button>
        <button 
          :class="{ active: activeTab === 'products' }" 
          @click="activeTab = 'products'"
        >
          {{ isEditing ? 'Editar Producto' : 'Nuevo Producto' }}
        </button>
        <button 
          :class="{ active: activeTab === 'users' }" 
          @click="activeTab = 'users'; loadAdminData();"
        >
          Administración de Usuarios
        </button>
      </nav>

      <div v-if="loading" class="state-msg">Cargando datos de la base de datos...</div>
      <div v-else-if="error" class="state-msg error">{{ error }}</div>

      <div v-else class="modal-body">
        <!-- Pestaña 1: Control de Inventario -->
        <section v-if="activeTab === 'inventory'" class="tab-content">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Stock Actual</th>
                <th>Ajuste Rápido</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="productos.length === 0">
                <td colspan="5" class="empty-cell">No se encontraron productos en el inventario.</td>
              </tr>
              <tr v-else v-for="prod in productos" :key="prod.id">
                <td>
                  <strong>{{ prod.nombre }}</strong>
                  <span v-if="prod.existencias <= 5" class="low-stock-warning"> ¡Stock Bajo!</span>
                </td>
                <td>${{ Number(prod.precio).toFixed(2) }}</td>
                <td>
                  <span :class="['stock-badge', { empty: prod.existencias === 0, low: prod.existencias <= 5 }]">
                    {{ prod.existencias }} un.
                  </span>
                </td>
                <td>
                  <div class="qty-controls">
                    <button @click="updateStock(prod, -1)">-</button>
                    <button @click="updateStock(prod, +1)">+</button>
                    <button @click="updateStock(prod, +10)">+10</button>
                  </div>
                </td>
                <td>
                  <button @click="editProduct(prod)" class="action-link">Editar</button>
                  <button @click="deleteProduct(prod.id)" class="action-link danger">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- Pestaña 2: Crear/Editar Producto -->
        <section v-if="activeTab === 'products'" class="tab-content">
          <form @submit.prevent="saveProduct" class="admin-form">
            <div class="form-group">
              <label>Nombre del Producto</label>
              <input v-model="formProduct.nombre" type="text" required placeholder="Ej. Tostada Siberia Especial" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Precio ($ MXN)</label>
                <input v-model.number="formProduct.precio" type="number" step="0.50" min="0" required />
              </div>
              <div class="form-group">
                <label>Existencias Iniciales</label>
                <input v-model.number="formProduct.existencias" type="number" min="0" required />
              </div>
            </div>

            <div class="form-group">
              <label>Descripción</label>
              <textarea v-model="formProduct.descripcion" rows="3" placeholder="Ingredientes o especificaciones..."></textarea>
            </div>

            <div class="form-group">
              <label>URL de la Imagen</label>
              <input v-model="formProduct.imagen_url" type="url" placeholder="https://..." />
            </div>

            <div class="form-actions">
              <button type="button" @click="resetForm(); activeTab = 'inventory';" class="btn-sec">Cancelar</button>
              <button type="submit" class="btn-main">
                {{ isEditing ? 'Guardar Cambios' : 'Registrar Producto' }}
              </button>
            </div>
          </form>
        </section>

        <!-- Pestaña 3: Gestión de Usuarios -->
        <section v-if="activeTab === 'users'" class="tab-content">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo Electrónico</th>
                <th>Rol Actual</th>
                <th>Cambiar Rol</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="usuarios.length === 0">
                <td colspan="5" class="empty-cell">No se encontraron usuarios registrados.</td>
              </tr>
              <tr v-else v-for="u in usuarios" :key="u.id">
                <td>#{{ u.id }}</td>
                <td><strong>{{ u.nombre }}</strong></td>
                <td>{{ u.email }}</td>
                <td><span class="role-tag">{{ u.rol }}</span></td>
                <td>
                  <select :value="u.rol" @change="updateUserRole(u, $event.target.value)" class="role-select">
                    <option value="cliente">Cliente</option>
                    <option value="empleado">Empleado</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1.5rem;
}

.modal-box {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-muted);
  cursor: pointer;
}

.admin-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
}

.admin-tabs button {
  flex: 1;
  padding: 0.85rem 1rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
}

.admin-tabs button.active {
  color: var(--brand-orange);
  border-bottom-color: var(--brand-orange);
  background-color: var(--bg-surface);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.admin-table th, .admin-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.empty-cell {
  text-align: center;
  padding: 2.5rem 1rem;
  color: var(--text-muted);
}

.qty-controls {
  display: flex;
  gap: 0.35rem;
}

.qty-controls button {
  padding: 0.2rem 0.5rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
  font-weight: 600;
}

.stock-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background-color: var(--bg-secondary);
}

.stock-badge.low { color: var(--brand-orange); font-weight: 700; }
.stock-badge.empty { color: var(--danger); font-weight: 700; }

.low-stock-warning {
  color: var(--danger);
  font-size: 0.75rem;
}

.action-link {
  background: none;
  border: none;
  color: var(--brand-orange);
  font-weight: 600;
  margin-right: 0.5rem;
  cursor: pointer;
}

.action-link.danger { color: var(--danger); }

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group input, .form-group textarea, .role-select {
  padding: 0.6rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn-main {
  background-color: var(--brand-orange);
  color: #fff;
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: var(--radius);
  font-weight: 600;
}

.btn-sec {
  background-color: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border-color);
  padding: 0.6rem 1.25rem;
  border-radius: var(--radius);
}

.state-msg {
  padding: 3rem;
  text-align: center;
  color: var(--text-muted);
}
</style>