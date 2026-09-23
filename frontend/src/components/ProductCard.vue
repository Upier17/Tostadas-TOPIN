<script setup>
import { useCart } from '../composables/useCart.js';

defineProps({
  product: {
    type: Object,
    required: true
  }
});

const { addToCart } = useCart();
</script>

<template>
  <div class="menu-item" :class="{ 'is-out': product.existencias === 0 }">
    <div class="photo-container">
      <img 
        :src="product.imagen_url || 'https://via.placeholder.com/400x300?text=Tostada'" 
        :alt="product.nombre" 
        class="photo"
        loading="lazy"
      />
    </div>

    <div class="details">
      <div class="header">
        <h3 class="name">{{ product.nombre }}</h3>
        <span class="price">${{ Number(product.precio).toFixed(2) }}</span>
      </div>

      <p class="description">{{ product.descripcion }}</p>

      <div class="action-row">
        <span v-if="product.existencias > 0 && product.existencias <= 5" class="low-stock-text">
          Últimas {{ product.existencias }} piezas
        </span>
        <span v-else></span>

        <button 
          @click="addToCart(product)" 
          :disabled="product.existencias === 0"
          class="btn-add"
          type="button"
        >
          {{ product.existencias === 0 ? 'Agotado' : '+ Agregar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-item {
  display: flex;
  flex-direction: column;
  background-color: transparent;
  transition: opacity 0.25s ease;
}

.menu-item.is-out {
  opacity: 0.5;
}

/* Encuadre sutil de la imagen */
.photo-container {
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 4px;
  background-color: var(--bg-secondary);
  margin-bottom: 1rem;
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}

.menu-item:hover:not(.is-out) .photo {
  transform: scale(1.03);
}

/* Tipografía fina y espacio */
.details {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 0.4rem;
}

.name {
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--text-primary);
}

.price {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--brand-orange);
  font-feature-settings: "tnum";
}

.description {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.5;
  font-weight: 400;
  margin-bottom: 1.2rem;
  flex-grow: 1;
}

/* Acción sutil */
.action-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.low-stock-text {
  font-size: 0.75rem;
  color: var(--brand-orange);
  font-weight: 400;
  font-style: italic;
}

.btn-add {
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0;
  letter-spacing: 0.02em;
  transition: color 0.2s ease, opacity 0.2s ease;
}

.btn-add:hover:not(:disabled) {
  color: var(--brand-orange);
}

.btn-add:disabled {
  color: var(--text-muted);
  cursor: not-allowed;
  font-weight: 400;
}
</style>