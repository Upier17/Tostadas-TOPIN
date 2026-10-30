<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close']);
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
          <!-- Título principal -->
          <section class="intro-section">
            <h2 class="title">Nuestra Historia y Compromiso</h2>
            <p class="history-text">
              Nacidos en el corazón del área metropolitana de Monterrey, <strong>Tostadas TOPIN</strong> surgió de la pasión por mantener viva la tradición gastronómica regia. Nos especializamos en la elaboración de tostadas artesanales preparadas al momento, utilizando únicamente ingredientes frescos, guisos tradicionales y la auténtica receta de la casa.
            </p>
          </section>

          <hr class="divider" />

          <!-- Misión y Visión en dos columnas simétricas -->
          <section class="grid-columns">
            <div class="col-box">
              <h3>Misión</h3>
              <p>
                Ofrecer tostadas y guisos regios de la más alta calidad con ingredientes frescos, garantizando una experiencia rápida, accesible y con la sazón casera que nos caracteriza.
              </p>
            </div>
            <div class="col-box">
              <h3>Visión</h3>
              <p>
                Consolidarnos como la opción preferida de tostadas artesanales en la región, modernizando nuestra atención y procesos digitales sin perder la esencia y la calidez tradicional.
              </p>
            </div>
          </section>

          <hr class="divider" />

          <!-- Valores de la Empresa -->
          <section class="values-section">
            <h3>Nuestros Valores</h3>
            <ul class="values-list">
              <li>
                <strong>Calidad Artesanal:</strong> Cuidado riguroso en la preparación de cada guiso y tostada.
              </li>
              <li>
                <strong>Calidez en el Servicio:</strong> Atención cercana y rápida enfocada en la satisfacción del cliente.
              </li>
              <li>
                <strong>Pasión por la Tradición:</strong> Orgullo por las recetas regias y el sabor local.
              </li>
              <li>
                <strong>Higiene y Frescura:</strong> Selección de insumos frescos y altos estándares de limpieza.
              </li>
            </ul>
          </section>
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
  max-width: 680px;
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
  margin-bottom: 1.5rem;
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
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 0.75rem;
}

.history-text {
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.history-text strong {
  color: var(--text-primary);
}

.divider {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 1.75rem 0;
}

.grid-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.col-box h3,
.values-section h3 {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.col-box p {
  font-size: 0.88rem;
  color: var(--text-muted);
  line-height: 1.55;
}

.values-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.85rem;
}

.values-list li {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.45;
}

.values-list strong {
  color: var(--brand-orange);
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
}
</style>