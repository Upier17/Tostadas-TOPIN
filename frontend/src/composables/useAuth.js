import { ref } from 'vue';

const currentUser = ref(JSON.parse(localStorage.getItem('topin-user')) || null);
const token = ref(localStorage.getItem('topin-token') || null);
const isAuthOpen = ref(false);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function useAuth() {
    const login = async (email, password) => {
        const res = await fetch(`${API_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.status === 'OK') {
            currentUser.value = data.user;
            token.value = data.token;
            localStorage.setItem('topin-user', JSON.stringify(data.user));
            localStorage.setItem('topin-token', data.token);
            isAuthOpen.value = false;
            return { ok: true };
        }
        return { ok: false, message: data.message };
    };

    const register = async (nombre, email, password) => {
        const res = await fetch(`${API_URL}/api/v1/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, password })
        });
        const data = await res.json();
        if (data.status === 'OK') {
            currentUser.value = data.user;
            token.value = data.token;
            localStorage.setItem('topin-user', JSON.stringify(data.user));
            localStorage.setItem('topin-token', data.token);
            isAuthOpen.value = false;
            return { ok: true };
        }
        return { ok: false, message: data.message };
    };

    const logout = () => {
        currentUser.value = null;
        token.value = null;
        localStorage.removeItem('topin-user');
        localStorage.removeItem('topin-token');
    };

    return {
        currentUser,
        token,
        isAuthOpen,
        login,
        register,
        logout
    };
}