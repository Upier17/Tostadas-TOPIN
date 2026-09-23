import { ref, computed } from 'vue';

const cart = ref([]);
const isCartOpen = ref(false);

export function useCart() {
    const addToCart = (product) => {
        const existingIndex = cart.value.findIndex(item => item.id === product.id);

        if (existingIndex > -1) {
            if (cart.value[existingIndex].cantidad < product.existencias) {
                cart.value[existingIndex].cantidad++;
            }
        } else {
            if (product.existencias > 0) {
                cart.value.push({ ...product, cantidad: 1 });
            }
        }
        isCartOpen.value = true;
    };

    const updateQuantity = (productId, delta) => {
        const item = cart.value.find(i => i.id === productId);
        if (!item) return;

        const newQty = item.cantidad + delta;
        if (newQty <= 0) {
            removeFromCart(productId);
        } else if (newQty <= item.existencias) {
            item.cantidad = newQty;
        }
    };

    const removeFromCart = (productId) => {
        cart.value = cart.value.filter(item => item.id !== productId);
    };

    const totalItems = computed(() => {
        return cart.value.reduce((sum, item) => sum + item.cantidad, 0);
    });

    const totalPrice = computed(() => {
        return cart.value.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    });

    return {
        cart,
        isCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        totalItems,
        totalPrice
    };
}