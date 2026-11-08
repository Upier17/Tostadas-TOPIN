
<script setup>
const year = new Date().getFullYear();
</script>

<template>
  <footer class="footer">
    <div class="footer-container">

      <div class="footer-brand">
        <h2>TOSTADAS <span>TOPIN</span></h2>
        <p>
          Tradición, sabor y calidad en cada tostada.
          Elaboramos productos pensando en compartir
          lo mejor de nuestra cocina contigo.
        </p>
      </div>

      <div class="footer-links">
        <h3>Explora</h3>
        <a href="#">Inicio</a>
        <a href="#nosotros">Nosotros</a>
      </div>

      <div class="footer-contact">
        <h3>Contáctanos</h3>
        <p>¿Tienes alguna pregunta sobre nuestros productos?</p>
        <a href="mailto:contacto@tostadastopin.com">
          Envíanos un correo
        </a>
      </div>

    </div>

    <div class="footer-bottom">
      <p>© {{ year }} Tostadas TOPIN. Todos los derechos reservados.</p>
      <span>Hecho con dedicación y tradición.</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--surface-secondary);
  color: var(--text-primary);
  border-top: 1px solid var(--border-color);
  padding: 3.5rem 2rem 1.5rem;
}

.footer-container {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr;
  gap: 3rem;
  padding-bottom: 3rem;
}

.footer-brand h2 {
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  margin-bottom: 1rem;
}

.footer-brand h2 span {
  color: var(--accent);
}

.footer-brand p,
.footer-contact p {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.8;
  max-width: 340px;
}

.footer-links,
.footer-contact {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.footer-links h3,
.footer-contact h3 {
  font-size: 0.95rem;
  margin-bottom: 0.3rem;
}

.footer a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.footer a:hover {
  color: var(--accent);
}

.footer-bottom {
  max-width: 1100px;
  margin: 0 auto;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  color: var(--text-muted);
  font-size: 0.8rem;
}

.footer-bottom p {
  margin: 0;
}

@media (max-width: 700px) {
  .footer-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
</style>
