import { ref } from 'vue';

const isDark = ref(false);

export function useTheme() {
    const applyTheme = () => {
        if (isDark.value) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const initTheme = () => {
        const savedTheme = localStorage.getItem('topin-theme');
        if (savedTheme) {
            isDark.value = savedTheme === 'dark';
        } else {
            isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        applyTheme();
    };

    const toggleTheme = () => {
        isDark.value = !isDark.value;
        localStorage.setItem('topin-theme', isDark.value ? 'dark' : 'light');
        applyTheme();
    };

    return { isDark, toggleTheme, initTheme };
}