<script setup>
import { useCart } from '../composables/useCart.js';

const { cart, isCartOpen, updateQuantity, removeFromCart, totalPrice } = useCart();
</script>

<template>
  <div v-if="isCartOpen" class="overlay" @click.self="isCartOpen = false">
    <aside class="drawer">
      <div class="drawer-header">
        <h2>Tu Pedido</h2>
        <button @click="isCartOpen = false" class="close-btn" aria-label="Cerrar">&times;</button>
      </div>

      <div v-if="cart.length === 0" class="empty-cart">
        <p>No has agregado productos aún.</p>
      </div>

      <div v-else class="cart-items">
        <div v-for="item in cart" :key="item.id" class="cart-item">
          <div class="item-info">
            <h4 class="item-title">{{ item.nombre }}</h4>
            <span class="item-price">${{ (item.precio * item.cantidad).toFixed(2) }}</span>
          </div>
          
          <div class="item-controls">
            <div class="qty-picker">
              <button @click="updateQuantity(item.id, -1)">-</button>
              <span>{{ item.cantidad }}</span>
              <button @click="updateQuantity(item.id, 1)" :disabled="item.cantidad >= item.existencias">+</button>
            </div>
            <button @click="removeFromCart(item.id)" class="remove-btn">Eliminar</button>
          </div>
        </div>
      </div>

      <div class="drawer-footer" v-if="cart.length > 0">
        <div class="total-row">
          <span>Total:</span>
          <strong>${{ totalPrice.toFixed(2) }}</strong>
        </div>
        <button class="checkout-btn">Confirmar Pedido</button>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 999;
  display: flex;
  justify-content: flex-end;
}

.drawer {
  width: 100%;
  max-width: 380px;
  background-color: var(--bg-surface);
  color: var(--text-primary);
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.25);
  border-left: 1px solid var(--border-color);
  z-index: 1000;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
}

.drawer-header h2 {
  font-size: 1.2rem;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.8rem;
  color: var(--text-primary);
  cursor: pointer;
}

.empty-cart {
  padding: 3rem 0;
  text-align: center;
  color: var(--text-muted);
}

.cart-items {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.cart-item {
  border-bottom: 1px solid var(--border-color);
  padding: 0.85rem 0;
}

.item-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.6rem;
}

.item-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
}

.item-price {
  font-weight: 700;
  color: var(--brand-orange);
}

.item-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.qty-picker {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  background-color: var(--bg-secondary);
}

.qty-picker button {
  background: none;
  border: none;
  padding: 0.25rem 0.65rem;
  color: var(--text-primary);
  font-weight: bold;
}

.qty-picker span {
  padding: 0 0.5rem;
  font-size: 0.85rem;
  color: var(--text-primary);
}

.remove-btn {
  background: none;
  border: none;
  color: var(--danger);
  font-size: 0.8rem;
  cursor: pointer;
}

.drawer-footer {
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.checkout-btn {
  width: 100%;
  background-color: var(--accent);
  color: #ffffff;
  border: none;
  padding: 0.8rem;
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 0.95rem;
  transition: background-color 0.2s ease;
}

.checkout-btn:hover {
  background-color: var(--accent-hover);
}
</style>