<script setup>
import { ref } from 'vue';
import { useTheme } from '../composables/useTheme.js';
import { useCart } from '../composables/useCart.js';
import { useAuth } from '../composables/useAuth.js';
import OrdersModal from './OrdersModal.vue';
import AdminPanel from './AdminPanel.vue';

const emit = defineEmits(['reload-products']);

const { isDark, toggleTheme } = useTheme();
const { totalItems, isCartOpen } = useCart();
const { currentUser, isAuthOpen, logout } = useAuth();

const isMenuOpen = ref(false);
const isOrdersOpen = ref(false);
const isAdminOpen = ref(false);

const handleLogout = () => {
  logout();
  isMenuOpen.value = false;
};

const openCartFromMenu = () => {
  isCartOpen.value = true;
  isMenuOpen.value = false;
};
</script>

<template>
  <header class="navbar">
    <div class="nav-container">
      <div class="brand">
        <span class="logo-tostadas">TOSTADAS</span>
        <span class="logo-topin">TOPIN</span>
      </div>

      <nav class="desktop-actions">
        <button 
          @click="toggleTheme" 
          class="nav-link theme-btn flex-center" 
          type="button"
          :title="isDark ? 'Modo Claro' : 'Modo Oscuro'"
        >
          <svg v-if="isDark" class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg v-else class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
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
            <small v-if="currentUser.rol !== 'cliente'" class="role-tag">({{ currentUser.rol }})</small>
          </span>
          <button @click="logout" class="nav-link logout-btn" type="button">(Salir)</button>
        </template>
        <template v-else>
          <button @click="isAuthOpen = true" class="nav-link auth-btn" type="button">
            Ingresar
          </button>
        </template>

        <span class="divider">/</span>

        <button @click="isCartOpen = true" class="nav-link cart-btn flex-center" type="button">
          <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span>Carrito</span>
          <span v-if="totalItems > 0" class="cart-count">({{ totalItems }})</span>
        </button>
      </nav>

      <div class="mobile-header-right">
        <span v-if="currentUser" class="user-name mobile-user">
          {{ currentUser.nombre }}
          <small v-if="currentUser.rol !== 'cliente'" class="role-tag">({{ currentUser.rol }})</small>
        </span>
        <button v-else @click="isAuthOpen = true" class="nav-link auth-btn" type="button">
          Ingresar
        </button>

        <button 
          @click="isMenuOpen = !isMenuOpen" 
          class="hamburger-btn" 
          :class="{ active: isMenuOpen }"
          type="button"
          :aria-label="isMenuOpen ? 'Cerrar menú' : 'Abrir menú'"
        >
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
    </div>

    <Transition name="menu-drawer">
      <div v-if="isMenuOpen" class="mobile-menu-overlay" @click.self="isMenuOpen = false">
        <div class="mobile-menu-content">
          <nav class="mobile-menu-nav">
            <button @click="openCartFromMenu" class="mobile-menu-item cart-menu-item flex-center" type="button">
              <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span>Carrito</span>
              <span v-if="totalItems > 0" class="cart-count">({{ totalItems }})</span>
            </button>

            <button 
              @click="toggleTheme(); isMenuOpen = false;" 
              class="mobile-menu-item flex-center" 
              type="button"
              :title="isDark ? 'Modo Claro' : 'Modo Oscuro'"
            >
              <svg v-if="isDark" class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              <svg v-else class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </button>

            <button 
              v-if="currentUser" 
              @click="isOrdersOpen = true; isMenuOpen = false;" 
              class="mobile-menu-item" 
              type="button"
            >
              {{ currentUser.rol === 'cliente' ? 'Mis Pedidos' : 'Gestión Pedidos' }}
            </button>

            <button 
              v-if="currentUser && (currentUser.rol === 'administrador' || currentUser.rol === 'empleado')" 
              @click="isAdminOpen = true; isMenuOpen = false;" 
              class="mobile-menu-item admin-highlight" 
              type="button"
            >
              Panel Admin
            </button>
          </nav>

          <div v-if="currentUser" class="mobile-menu-footer">
            <button @click="handleLogout" class="mobile-logout-btn flex-center" type="button">
              <svg class="icon-svg logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>(Salir) Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

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

.brand {
  display: flex;
  gap: 0.35rem;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.logo-tostadas { color: var(--brand-brown); }
.logo-topin { color: var(--brand-orange); }

.desktop-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mobile-header-right,
.mobile-menu-overlay {
  display: none;
}

.flex-center {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.icon-svg {
  width: 15px;
  height: 15px;
  stroke: currentColor;
}

.nav-link {
  background: none;
  border: none;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.2s ease;
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
  margin-left: 0.2rem;
}

@media (max-width: 768px) {
  .nav-container {
    padding: 1rem 1.25rem;
  }

  .desktop-actions {
    display: none;
  }

  .mobile-header-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .mobile-user {
    font-size: 0.8rem;
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .hamburger-btn {
    background: none;
    border: 1px solid var(--border-color);
    border-radius: var(--radius, 6px);
    width: 36px;
    height: 36px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    padding: 0;
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }

  .hamburger-btn:hover {
    background-color: var(--bg-secondary);
  }

  .hamburger-line {
    width: 18px;
    height: 2px;
    background-color: var(--brand-orange);
    border-radius: 2px;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
  }

  .hamburger-btn.active .hamburger-line:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }

  .hamburger-btn.active .hamburger-line:nth-child(2) {
    opacity: 0;
  }

  .hamburger-btn.active .hamburger-line:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  .mobile-menu-overlay {
    display: flex;
    position: fixed;
    top: 58px;
    inset: 58px 0 0 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 90;
    justify-content: center;
    align-items: flex-start;
    padding: 1.5rem 1rem;
  }

  .mobile-menu-content {
    width: 100%;
    max-width: 320px;
    background-color: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius, 8px);
    padding: 1.75rem 1.25rem 1.25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }

  .mobile-menu-nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.18rem;
    width: 100%;
  }

  .mobile-menu-item {
    background: none;
    border: none;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .mobile-menu-item:hover {
    color: var(--brand-orange);
  }

  .mobile-menu-item.admin-highlight {
    color: var(--brand-orange);
    font-weight: 700;
  }

  .mobile-menu-footer {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .mobile-logout-btn {
    background: none;
    border: none;
    color: var(--danger, #c0392b);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
  }

  .logout-icon {
    color: var(--danger, #c0392b);
  }
}

.menu-drawer-enter-active,
.menu-drawer-leave-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.menu-drawer-enter-active .mobile-menu-content,
.menu-drawer-leave-active .mobile-menu-content {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.menu-drawer-enter-from,
.menu-drawer-leave-to {
  opacity: 0;
}

.menu-drawer-enter-from .mobile-menu-content,
.menu-drawer-leave-to .mobile-menu-content {
  opacity: 0;
  transform: translateY(-12px) scale(0.97);
}
</style>