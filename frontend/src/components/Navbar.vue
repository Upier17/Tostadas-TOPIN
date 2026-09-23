<script setup>
import { useTheme } from '../composables/useTheme.js';
import { useCart } from '../composables/useCart.js';

const { isDark, toggleTheme } = useTheme();
const { totalItems, isCartOpen } = useCart();
</script>

<template>
  <header class="navbar">
    <div class="nav-container">
      <div class="brand">
        <span class="logo-tostadas">TOSTADAS</span>
        <span class="logo-topin">TOPIN</span>
      </div>

      <nav class="actions">
        <button 
          @click="toggleTheme" 
          class="nav-link theme-btn" 
          type="button"
          :aria-label="isDark ? 'Activar modo claro' : 'Activar modo oscuro'"
        >
          {{ isDark ? '☀️' : '🌙' }}
        </button>

        <span class="divider">|</span>

        <button @click="isCartOpen = true" class="nav-link cart-btn" type="button">
          <span>Carrito</span>
          <span v-if="totalItems > 0" class="cart-count">({{ totalItems }})</span>
        </button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.25s ease, border-color 0.25s ease;
}

.nav-container {
  max-width: 1040px;
  margin: 0 auto;
  padding: 1.25rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logotipo */
.brand {
  display: flex;
  gap: 0.35rem;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.logo-tostadas {
  color: var(--brand-brown);
}

.logo-topin {
  color: var(--brand-orange);
}

/* Enlaces y Acciones */
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
  padding: 0;
  letter-spacing: 0.01em;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--text-primary);
}

.theme-btn:hover {
  color: var(--brand-orange);
}

.divider {
  font-size: 0.8rem;
  color: var(--border-color);
  user-select: none;
}

.cart-btn {
  color: var(--text-primary);
  font-weight: 600;
}

.cart-btn:hover {
  color: var(--brand-orange);
}

.cart-count {
  color: var(--brand-orange);
  font-weight: 700;
  margin-left: 0.25rem;
  font-feature-settings: "tnum";
}
</style>