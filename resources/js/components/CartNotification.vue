<script setup lang="ts">
import { useCartNotification } from '@/composables/useCartNotification';
import { X, ShoppingCart } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

const { notification, isVisible, hide } = useCartNotification();
</script>

<template>
    <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-300 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
    >
        <div
            v-if="isVisible && notification"
            class="fixed top-24 right-4 z-[9999] w-80 backdrop-blur-md bg-[#2c3e50]/95 border border-light-blue/40 rounded-lg shadow-[0_0_20px_rgba(0,212,255,0.3)] overflow-hidden"
        >
            <!-- Header -->
            <div class="flex items-center justify-between px-4 py-3 border-b border-light-blue/20">
                <div class="flex items-center gap-2">
                    <ShoppingCart class="h-5 w-5 text-light-blue" />
                    <span class="font-semibold text-light-blue">Ajouté au panier</span>
                </div>
                <Button
                    @click="hide"
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
                        :alt="notification.name"
                        class="h-full w-full object-cover"
                    />
                    <div v-else class="h-full w-full flex items-center justify-center">
                        <ShoppingCart class="h-8 w-8 text-light-blue/30" />
                    </div>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-light-blue text-sm mb-1 truncate">
                        {{ notification.name }}
                    </h3>
                    <div class="text-light-blue/70 text-sm space-y-1">
                        <p>Quantité: <span class="text-light-blue font-medium">{{ notification.quantity }}</span></p>
                        <p class="text-lg font-bold text-light-blue">{{ Number(notification.price).toFixed(2) }}€</p>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>
