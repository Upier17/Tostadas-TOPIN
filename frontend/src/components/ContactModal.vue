<script setup>
import { ref } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close']);

const nombre = ref('');
const email = ref('');
const asunto = ref('');
const mensaje = ref('');

const isSubmitting = ref(false);
const showSuccess = ref(false);

const handleSubmit = () => {
  if (!email.value || !mensaje.value) return;

  isSubmitting.value = true;

  // Simulación de envío a servidor (1.2 segundos)
  setTimeout(() => {
    isSubmitting.value = false;
    showSuccess.value = true;

    // Reset del formulario después de 2.5 segundos
    setTimeout(() => {
      showSuccess.value = false;
      nombre.value = '';
      email.value = '';
      asunto.value = '';
      mensaje.value = '';
      emit('close');
    }, 2500);
  }, 1200);
};
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
      <div class="modal-card">
        <!-- Encabezado con botón de cierre -->
        <header class="modal-header">
          <div class="brand-tag">TOSTADAS TOPIN</div>
          <button @click="emit('close')" class="close-btn" type="button" aria-label="Cerrar modal">&times;</button>
        </header>

        <div class="modal-body">
          <h2 class="title">Contáctanos</h2>
          <p class="subtitle">
            ¿Tienes alguna duda, evento especial o sugerencia sobre nuestro menú? Déjanos un mensaje y te responderemos a la brevedad.
          </p>

          <!-- Estado de éxito de envío -->
          <div v-if="showSuccess" class="success-box">
            <span class="success-icon">✓</span>
            <h3>¡Mensaje enviado con éxito!</h3>
            <p>Gracias por escribirnos. Nuestro equipo se pondrá en contacto contigo pronto.</p>
          </div>

          <!-- Formulario de contacto -->
          <form v-else @submit.prevent="handleSubmit" class="contact-form">
            <div class="form-row">
              <div class="field-group">
                <label for="contact-nombre">Nombre completo</label>
                <input 
                  id="contact-nombre"
                  v-model="nombre" 
                  type="text" 
                  placeholder="Ej. Juan Pérez" 
                  required 
                />
              </div>

              <div class="field-group">
                <label for="contact-email">Correo electrónico</label>
                <input 
                  id="contact-email"
                  v-model="email" 
                  type="email" 
                  placeholder="correo@ejemplo.com" 
                  required 
                />
              </div>
            </div>

            <div class="field-group">
              <label for="contact-asunto">Asunto</label>
              <input 
                id="contact-asunto"
                v-model="asunto" 
                type="text" 
                placeholder="Ej. Evento privado / Cotización" 
                required 
              />
            </div>

            <div class="field-group">
              <label for="contact-mensaje">Mensaje</label>
              <textarea 
                id="contact-mensaje"
                v-model="mensaje" 
                rows="4" 
                placeholder="Escribe aquí tus comentarios o preguntas..." 
                required
              ></textarea>
            </div>

            <button type="submit" class="submit-btn" :disabled="isSubmitting">
              {{ isSubmitting ? 'Enviando...' : 'Enviar mensaje' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem 1rem;
}

.modal-card {
  width: 100%;
  max-width: 580px;
  max-height: 85vh;
  overflow-y: auto;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius, 8px);
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  transition: background-color 0.25s ease, border-color 0.25s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.brand-tag {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--brand-orange);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: var(--text-primary);
}

.title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 0.88rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
}

.field-group input,
.field-group textarea {
  padding: 0.65rem 0.85rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius, 6px);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.field-group input:focus,
.field-group textarea:focus {
  border-color: var(--brand-orange);
}

.submit-btn {
  background-color: var(--brand-orange);
  color: #fff;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius, 6px);
  font-weight: 600;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-box {
  text-align: center;
  padding: 2.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.success-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #27ae60;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.success-box h3 {
  font-size: 1.2rem;
  color: var(--text-primary);
}

.success-box p {
  font-size: 0.88rem;
  color: var(--text-muted);
}

/* Transición Vue Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .modal-card {
    padding: 1.25rem;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>