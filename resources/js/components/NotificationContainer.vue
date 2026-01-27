<script setup lang="ts">
import { useNotification } from '@/composables/useNotification';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, ShoppingCart } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { computed } from 'vue';

const { notifications, remove } = useNotification();

const getIcon = (type: string) => {
    switch (type) {
        case 'success': return CheckCircle;
        case 'error': return AlertCircle;
        case 'warning': return AlertTriangle;
        case 'info': return Info;
        default: return Info;
    }
};

const getColors = (type: string) => {
    switch (type) {
        case 'success':
            return {
                icon: 'text-green-400',
                border: 'border-green-400/40',
                shadow: 'shadow-[0_0_20px_rgba(74,222,128,0.3)]',
            };
        case 'error':
            return {
                icon: 'text-red-400',
                border: 'border-red-400/40',
                shadow: 'shadow-[0_0_20px_rgba(248,113,113,0.3)]',
            };
        case 'warning':
            return {
                icon: 'text-yellow-400',
                border: 'border-yellow-400/40',
                shadow: 'shadow-[0_0_20px_rgba(250,204,21,0.3)]',
            };
        case 'info':
            return {
                icon: 'text-light-blue',
                border: 'border-light-blue/40',
                shadow: 'shadow-[0_0_20px_rgba(0,212,255,0.3)]',
            };
        default:
            return {
                icon: 'text-light-blue',
                border: 'border-light-blue/40',
                shadow: 'shadow-[0_0_20px_rgba(0,212,255,0.3)]',
            };
    }
};

const isCartNotification = (notification: any) => notification.image && notification.price && notification.quantity;
</script>

<template>
    <div class="fixed top-24 right-4 z-[9999] space-y-3 max-w-sm w-full">
        <TransitionGroup
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="translate-x-full opacity-0"
            enter-to-class="translate-x-0 opacity-100"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="translate-x-0 opacity-100"
            leave-to-class="translate-x-full opacity-0"
            move-class="transition-all duration-300"
        >
            <!-- Notification avec image (ajout au panier) -->
            <div
                v-for="notification in notifications.filter(isCartNotification)"
                :key="notification.id"
                class="backdrop-blur-md bg-[#2c3e50]/95 border border-light-blue/40 rounded-lg shadow-[0_0_20px_rgba(0,212,255,0.3)] overflow-hidden"
            >
                <!-- Header -->
                <div class="flex items-center justify-between px-4 py-3 border-b border-light-blue/20">
                    <div class="flex items-center gap-2">
                        <ShoppingCart class="h-5 w-5 text-light-blue" />
                        <span class="font-semibold text-light-blue">Ajouté au panier</span>
                    </div>
                    <Button
                        @click="remove(notification.id)"
                        variant="ghost"
                        size="icon"
                        class="h-6 w-6 text-light-blue/60 hover:text-light-blue hover:bg-light-blue/10"
                    >
                        <X class="h-4 w-4" />
                    </Button>
                </div>

                <!-- Content -->
                <div class="p-4 flex gap-4">
                    <!-- Image -->
                    <div class="h-20 w-20 flex-shrink-0 rounded overflow-hidden bg-blue/30">
                        <img
                            v-if="notification.image"
                            :src="`/storage/${notification.image}`"
                            :alt="notification.title"
                            class="h-full w-full object-cover"
                        />
                        <div v-else class="h-full w-full flex items-center justify-center">
                            <ShoppingCart class="h-8 w-8 text-light-blue/30" />
                        </div>
                    </div>

                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                        <h3 class="font-semibold text-light-blue text-sm mb-1 truncate">
                            {{ notification.title }}
                        </h3>
                        <div class="text-light-blue/70 text-sm space-y-1">
                            <p>Quantité: <span class="text-light-blue font-medium">{{ notification.quantity }}</span></p>
                            <p class="text-lg font-bold text-light-blue">{{ Number(notification.price).toFixed(2) }}€</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Notification classique (erreurs, warnings) -->
            <div
                v-for="notification in notifications.filter(n => !isCartNotification(n))"
                :key="notification.id"
                :class="[
                    'backdrop-blur-md bg-[#2c3e50]/95 border rounded-lg overflow-hidden',
                    getColors(notification.type).border,
                    getColors(notification.type).shadow,
                ]"
            >
                <!-- Header -->
                <div class="flex items-start gap-3 p-4">
                    <component
                        :is="getIcon(notification.type)"
                        :class="['h-5 w-5 flex-shrink-0 mt-0.5', getColors(notification.type).icon]"
                    />
                    
                    <div class="flex-1 min-w-0">
                        <h3 class="font-semibold text-light-blue text-sm mb-1">
                            {{ notification.title }}
                        </h3>
                        <p v-if="notification.description" class="text-light-blue/70 text-xs">
                            {{ notification.description }}
                        </p>
                    </div>

                    <Button
                        @click="remove(notification.id)"
                        variant="ghost"
                        size="icon"
                        class="h-6 w-6 flex-shrink-0 text-light-blue/60 hover:text-light-blue hover:bg-light-blue/10"
                    >
                        <X class="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>
