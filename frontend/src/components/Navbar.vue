<script setup>
import { ref } from 'vue';
import { useTheme } from '../composables/useTheme.js';
import { useCart } from '../composables/useCart.js';
import { useAuth } from '../composables/useAuth.js';
import OrdersModal from './OrdersModal.vue';
import AdminPanel from './AdminPanel.vue';

// Declara los eventos que este componente puede emitir hacia App.vue
const emit = defineEmits(['reload-products']);

const { isDark, toggleTheme } = useTheme();
const { totalItems, isCartOpen } = useCart();
const { currentUser, isAuthOpen, logout } = useAuth();

const isOrdersOpen = ref(false);
const isAdminOpen = ref(false);
</script>

<template>
  <header class="navbar">
    <div class="nav-container">
      <div class="brand">
        <span class="logo-tostadas">TOSTADAS</span>
        <span class="logo-topin">TOPIN</span>
      </div>

      <nav class="actions">
        <button @click="toggleTheme" class="nav-link theme-btn" type="button">
          {{ isDark ? '☀️' : '🌙' }}
        </button>

        <template v-if="currentUser">
          <span class="divider">/</span>
          <button @click="isOrdersOpen = true" class="nav-link" type="button">
            {{ currentUser.rol === 'cliente' ? 'Mis Pedidos' : 'Gestión Pedidos' }}
          </button>
        </template>

        <template v-if="currentUser && (currentUser.rol === 'administrador' || currentUser.rol === 'empleado')">
          <span class="divider">/</span>
          <button @click="isAdminOpen = true" class="nav-link admin-btn" type="button">
            Admin
          </button>
        </template>

        <span class="divider">/</span>

        <template v-if="currentUser">
          <span class="user-name">
            {{ currentUser.nombre }} 
            <small class="role-tag">({{ currentUser.rol }})</small>
          </span>
          <button @click="logout" class="nav-link logout-btn" type="button">(Salir)</button>
        </template>
        <template v-else>
          <button @click="isAuthOpen = true" class="nav-link auth-btn" type="button">
            Ingresar
          </button>
        </template>

        <span class="divider">/</span>

        <button @click="isCartOpen = true" class="nav-link cart-btn" type="button">
          <span>Carrito</span>
          <span v-if="totalItems > 0" class="cart-count">({{ totalItems }})</span>
        </button>
      </nav>
    </div>

    <!-- Pasa la señal hacia App.vue cuando un producto cambie -->
    <AdminPanel 
      :isOpen="isAdminOpen" 
      @close="isAdminOpen = false" 
      @product-updated="emit('reload-products')" 
    />

    <OrdersModal v-if="currentUser" :isOpen="isOrdersOpen" @close="isOrdersOpen = false" />
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
}

.nav-container {
  max-width: 1040px;
  margin: 0 auto;
  padding: 1.25rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  display: flex;
  gap: 0.35rem;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.logo-tostadas { color: var(--brand-brown); }
.logo-topin { color: var(--brand-orange); }

.actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-link {
  background: none;
  border: none;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.2s;
}

.nav-link:hover { color: var(--text-primary); }
.admin-btn { color: var(--brand-orange); font-weight: 700; }
.auth-btn { color: var(--brand-orange); font-weight: 600; }
.logout-btn { color: var(--danger, #c0392b); font-size: 0.75rem; }

.user-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
}

.role-tag {
  font-size: 0.7rem;
  color: var(--brand-orange);
  text-transform: capitalize;
}

.divider {
  font-size: 0.8rem;
  color: var(--border-color);
}

.cart-btn {
  color: var(--text-primary);
  font-weight: 600;
}

.cart-count {
  color: var(--brand-orange);
  font-weight: 700;
  margin-left: 0.25rem;
}
</style>