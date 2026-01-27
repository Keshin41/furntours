import { ref } from 'vue';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationData {
    type: NotificationType;
    title: string;
    description?: string;
    id: number;
    image?: string;
    price?: number;
    quantity?: number;
}

const notifications = ref<NotificationData[]>([]);
let notificationId = 0;

export function useNotification() {
    const show = (type: NotificationType, title: string, description?: string, extra?: { image?: string; price?: number; quantity?: number }) => {
        const id = ++notificationId;
        const notification: NotificationData = {
            type,
            title,
            description,
            id,
            ...extra,
        };

        notifications.value.push(notification);

        // Auto hide after 4 seconds
        setTimeout(() => {
            remove(id);
        }, 4000);
    };

    const remove = (id: number) => {
        const index = notifications.value.findIndex(n => n.id === id);
        if (index !== -1) {
            notifications.value.splice(index, 1);
        }
    };

    const success = (title: string, description?: string, extra?: { image?: string; price?: number; quantity?: number }) => show('success', title, description, extra);
    const error = (title: string, description?: string) => show('error', title, description);
    const warning = (title: string, description?: string) => show('warning', title, description);
    const info = (title: string, description?: string) => show('info', title, description);

    return {
        notifications,
        show,
        remove,
        success,
        error,
        warning,
        info,
    };
}
