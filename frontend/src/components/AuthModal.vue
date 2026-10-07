<script setup>
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth.js';

const { isAuthOpen, login, register } = useAuth();

const isLoginView = ref(true);
const nombre = ref('');
const email = ref('');
const password = ref('');
const errorMsg = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  errorMsg.value = '';
  loading.value = true;
  
  try {
    let res;
    if (isLoginView.value) {
      res = await login(email.value, password.value);
    } else {
      if (!nombre.value) {
        errorMsg.value = 'Ingresa tu nombre completo.';
        loading.value = false;
        return;
      }
      res = await register(nombre.value, email.value, password.value);
    }

    if (!res.ok) {
      errorMsg.value = res.message || 'Ocurrió un error al procesar la solicitud.';
    } else {
      nombre.value = '';
      email.value = '';
      password.value = '';
    }
  } catch (err) {
    errorMsg.value = 'Error de conexión con el servidor.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div v-if="isAuthOpen" class="overlay" @click.self="isAuthOpen = false">
    <div class="auth-card">
      <div class="auth-header">
        <h3>{{ isLoginView ? 'Iniciar Sesión' : 'Crear Cuenta' }}</h3>
        <button @click="isAuthOpen = false" class="close-btn">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div v-if="!isLoginView" class="field-group">
          <label>Nombre</label>
          <input v-model="nombre" type="text" placeholder="Tu nombre completo" required />
        </div>

        <div class="field-group">
          <label>Correo Electrónico</label>
          <input v-model="email" type="email" placeholder="correo@ejemplo.com" required />
        </div>

        <div class="field-group">
          <label>Contraseña</label>
          <input v-model="password" type="password" placeholder="••••••••" required />
        </div>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? 'Procesando...' : (isLoginView ? 'Entrar' : 'Registrarse') }}
        </button>
      </form>

      <div class="auth-footer">
        <button @click="isLoginView = !isLoginView; errorMsg = '';" class="switch-btn">
          {{ isLoginView ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.auth-card {
  width: 100%;
  max-width: 380px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius, 8px);
  padding: 1.75rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.auth-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.auth-header h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-muted);
  cursor: pointer;
}

.auth-form {
  display: flex;
  flex-direction: column;
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

.field-group input {
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}

.field-group input:focus {
  border-color: var(--brand-orange);
}

.error-msg {
  color: var(--danger, #c0392b);
  font-size: 0.8rem;
  margin-top: 0.2rem;
}

.submit-btn {
  background-color: var(--brand-orange);
  color: #fff;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.submit-btn:disabled {
  opacity: 0.6;
}

.auth-footer {
  margin-top: 1.25rem;
  text-align: center;
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
}

.switch-btn {
  background: none;
  border: none;
  font-size: 0.8rem;
  color: var(--brand-orange);
  font-weight: 500;
  cursor: pointer;
}
</style>