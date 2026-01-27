import { ref, computed, watch } from 'vue';

interface CartItem {
    id: number;
    name: string;
    slug: string;
    price: number;
    quantity: number;
    image?: string;
    category: string;
    stock: number;
}

const CART_STORAGE_KEY = 'furntours_cart';

const cartItems = ref<CartItem[]>([]);

// Charger le panier depuis localStorage au démarrage
const loadCart = () => {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
            cartItems.value = JSON.parse(stored);
        }
    } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        cartItems.value = [];
    }
};

// Sauvegarder le panier dans localStorage
const saveCart = () => {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems.value));
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du panier:', error);
    }
};

// Charger le panier au démarrage
loadCart();

// Sauvegarder automatiquement à chaque modification
watch(cartItems, saveCart, { deep: true });

export function useCart() {
    const addToCart = (product: Omit<CartItem, 'quantity'>, quantity = 1) => {
        const existingItem = cartItems.value.find(item => item.id === product.id);

        if (existingItem) {
            // Vérifier le stock avant d'ajouter
            if (existingItem.quantity + quantity <= product.stock) {
                existingItem.quantity += quantity;
            } else {
                throw new Error(`Stock insuffisant. Maximum disponible: ${product.stock}`);
            }
        } else {
            if (quantity <= product.stock) {
                cartItems.value.push({ ...product, quantity });
            } else {
                throw new Error(`Stock insuffisant. Maximum disponible: ${product.stock}`);
            }
        }
    };

    const removeFromCart = (productId: number) => {
        const index = cartItems.value.findIndex(item => item.id === productId);
        if (index !== -1) {
            cartItems.value.splice(index, 1);
        }
    };

    const updateQuantity = (productId: number, quantity: number) => {
        const item = cartItems.value.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                removeFromCart(productId);
            } else if (quantity <= item.stock) {
                item.quantity = quantity;
            } else {
                throw new Error(`Stock insuffisant. Maximum disponible: ${item.stock}`);
            }
        }
    };

    const clearCart = () => {
        cartItems.value = [];
    };

    const itemCount = computed(() => {
        return cartItems.value.reduce((total, item) => total + item.quantity, 0);
    });

    const total = computed(() => {
        return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
    });

    const isInCart = (productId: number) => {
        return cartItems.value.some(item => item.id === productId);
    };

    const getItemQuantity = (productId: number) => {
        const item = cartItems.value.find(item => item.id === productId);
        return item?.quantity || 0;
    };

    return {
        cartItems: computed(() => cartItems.value),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        total,
        isInCart,
        getItemQuantity,
    };
}
