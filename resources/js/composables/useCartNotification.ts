import { ref } from 'vue';

interface CartNotificationData {
    id: number;
    name: string;
    image?: string;
    price: number;
    quantity: number;
}

const notification = ref<CartNotificationData | null>(null);
const isVisible = ref(false);

let timeoutId: number | null = null;

export function useCartNotification() {
    const show = (product: CartNotificationData) => {
        // Clear previous timeout
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        notification.value = product;
        isVisible.value = true;

        // Auto hide after 3 seconds
        timeoutId = window.setTimeout(() => {
            hide();
        }, 3000);
    };

    const hide = () => {
        isVisible.value = false;
        setTimeout(() => {
            notification.value = null;
        }, 300); // Wait for animation to finish
    };

    return {
        notification,
        isVisible,
        show,
        hide,
    };
}
