<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useCart } from '@/composables/useCart';
import { useNotification } from '@/composables/useNotification';
import { Link } from '@inertiajs/vue3';
import { ShoppingCart, Trash2, X, Plus, Minus } from 'lucide-vue-next';

const { cartItems, removeFromCart, updateQuantity, itemCount, total } = useCart();
const { warning } = useNotification();
</script>

<template>
    <Popover>
        <PopoverTrigger :as-child="true">
            <Button
                variant="ghost"
                size="icon"
                class="relative h-9 w-9 text-blue hover:text-light-blue"
            >
                <ShoppingCart class="h-5 w-5" />
                <span
                    v-if="itemCount > 0"
                    class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-yellow to-yellow text-xs font-bold text-[#2c3e50]"
                >
                    {{ itemCount }}
                </span>
            </Button>
        </PopoverTrigger>
        <PopoverContent class="w-80 p-0" align="end">
            <div class="flex items-center justify-between border-b border-light-blue/30 bg-blue/20 px-4 py-3">
                <h3 class="font-semibold text-light-blue">Mon Panier</h3>
                <span class="text-sm text-light-blue/60">{{ itemCount }} article(s)</span>
            </div>

            <!-- Empty State -->
            <div v-if="cartItems.length === 0" class="flex flex-col items-center justify-center py-8 px-4">
                <ShoppingCart class="h-12 w-12 text-light-blue/30 mb-3" />
                <p class="text-sm text-light-blue/60 text-center">Votre panier est vide</p>
            </div>

            <!-- Cart Items -->
            <div v-else class="max-h-[400px] overflow-y-auto">
                <div
                    v-for="item in cartItems"
                    :key="item.id"
                    class="flex gap-3 border-b border-light-blue/20 p-4 hover:bg-blue/10 transition-colors"
                >
                    <!-- Image -->
                    <div class="h-16 w-16 flex-shrink-0 rounded overflow-hidden bg-blue/20">
                        <img
                            v-if="item.image"
                            :src="`/storage/${item.image}`"
                            :alt="item.name"
                            class="h-full w-full object-cover"
                        />
                        <div v-else class="h-full w-full flex items-center justify-center">
                            <ShoppingCart class="h-6 w-6 text-light-blue/30" />
                        </div>
                    </div>

                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-medium text-white truncate">{{ item.name }}</h4>
                        <p class="text-sm font-semibold text-light-blue mt-1">
                            {{ (item.price * item.quantity).toFixed(2) }}€
                        </p>
                        <div class="flex items-center gap-1 mt-2">
                            <button
                                @click="() => {
                                    if (item.quantity > 1) {
                                        updateQuantity(item.id, item.quantity - 1);
                                    }
                                }"
                                class="h-6 w-6 flex items-center justify-center rounded hover:bg-light-blue/20 text-light-blue/60 hover:text-light-blue transition-colors"
                            >
                                <Minus class="h-3 w-3" />
                            </button>
                            <span class="w-6 text-center text-xs font-medium text-light-blue">{{ item.quantity }}</span>
                            <button
                                @click="() => {
                                    if (item.quantity < item.stock) {
                                        updateQuantity(item.id, item.quantity + 1);
                                    } else {
                                        warning('Stock insuffisant', `Maximum disponible: ${item.stock}`);
                                    }
                                }"
                                class="h-6 w-6 flex items-center justify-center rounded hover:bg-light-blue/20 text-light-blue/60 hover:text-light-blue transition-colors"
                            >
                                <Plus class="h-3 w-3" />
                            </button>
                        </div>
                    </div>

                    <!-- Remove Button -->
                    <button
                        @click="removeFromCart(item.id)"
                        class="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded hover:bg-red-500/20 text-light-blue/60 hover:text-red-400 transition-colors"
                    >
                        <Trash2 class="h-4 w-4" />
                    </button>
                </div>
            </div>

            <!-- Footer -->
            <div v-if="cartItems.length > 0" class="border-t border-light-blue/30 bg-blue/20 p-4 space-y-3">
                <div class="flex items-center justify-between">
                    <span class="font-semibold text-light-blue">Total</span>
                    <span class="text-xl font-bold text-light-blue">{{ total.toFixed(2) }}€</span>
                </div>
                <Link href="/boutique/panier" as="button" class="w-full">
                    <Button class="w-full bg-gradient-to-r from-light-blue to-cyan-500 text-[#2c3e50] hover:from-cyan-300 hover:to-light-blue font-semibold">
                        Voir le panier
                    </Button>
                </Link>
            </div>
        </PopoverContent>
    </Popover>
</template>
