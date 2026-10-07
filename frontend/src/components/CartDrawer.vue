<script setup>
import { ref } from 'vue';
import { useCart } from '../composables/useCart.js';
import { useAuth } from '../composables/useAuth.js';

const { cart, isCartOpen, updateQuantity, removeFromCart, totalPrice } = useCart();
const { currentUser } = useAuth();

const isSubmitting = ref(false);
const orderSuccess = ref(false);
const errorMessage = ref(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const checkout = async () => {
  if (cart.value.length === 0) return;
  isSubmitting.value = true;
  errorMessage.value = null;

  try {
    const payload = {
      usuario_id: currentUser.value ? currentUser.value.id : null,
      total: totalPrice.value,
      items: cart.value
    };

    const res = await fetch(`${API_URL}/api/v1/pedidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.status === 'OK') {
      orderSuccess.value = true;
      setTimeout(() => {
        cart.value = [];
        orderSuccess.value = false;
        isCartOpen.value = false;
        window.location.reload(); // Refresca existencias
      }, 2000);
    } else {
      errorMessage.value = data.message;
    }
  } catch (err) {
    errorMessage.value = 'Error de conexión al enviar el pedido.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div v-if="isCartOpen" class="overlay" @click.self="isCartOpen = false">
    <aside class="drawer">
      <div class="drawer-header">
        <h2>Tu Pedido</h2>
        <button @click="isCartOpen = false" class="close-btn">&times;</button>
      </div>

      <div v-if="orderSuccess" class="success-box">
        <p>¡Pedido confirmado con éxito!</p>
      </div>

      <div v-else-if="cart.length === 0" class="empty-cart">
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

      <div class="drawer-footer" v-if="cart.length > 0 && !orderSuccess">
        <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
        <div class="total-row">
          <span>Total:</span>
          <strong>${{ totalPrice.toFixed(2) }}</strong>
        </div>
        <button @click="checkout" :disabled="isSubmitting" class="checkout-btn">
          {{ isSubmitting ? 'Procesando...' : 'Confirmar Pedido' }}
        </button>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
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
  border-left: 1px solid var(--border-color);
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.8rem;
  color: var(--text-primary);
}

.empty-cart, .success-box {
  padding: 3rem 0;
  text-align: center;
  color: var(--text-muted);
}

.success-box p {
  color: #27ae60;
  font-weight: 600;
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
  margin-bottom: 0.6rem;
}

.item-title {
  font-size: 0.95rem;
  font-weight: 600;
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
}

.qty-picker button {
  background: none;
  border: none;
  padding: 0.2rem 0.6rem;
  color: var(--text-primary);
}

.qty-picker span {
  padding: 0 0.5rem;
  font-size: 0.85rem;
}

.remove-btn {
  background: none;
  border: none;
  color: var(--danger);
  font-size: 0.8rem;
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
}

.error-text {
  color: var(--danger);
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.checkout-btn {
  width: 100%;
  background-color: var(--accent);
  color: #fff;
  border: none;
  padding: 0.8rem;
  border-radius: var(--radius);
  font-weight: 600;
}

.checkout-btn:disabled {
  opacity: 0.6;
}
</style>