<script setup lang="ts">
import AppHeaderLayout from '@/layouts/app/AppHeaderLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, Package } from 'lucide-vue-next';
import { useCart } from '@/composables/useCart';
import { useNotification } from '@/composables/useNotification';
import NotificationContainer from '@/components/NotificationContainer.vue';
import { ref } from 'vue';

defineOptions({
    layout: AppHeaderLayout,
});

const { cartItems, updateQuantity, removeFromCart, clearCart, total } = useCart();
const { error, warning, success } = useNotification();

const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
        merch: '🛍️ Merch',
        membership: '👥 Adhésion',
        ticket: '🎫 Ticket',
    };
    return labels[category] || category;
};

const incrementQuantity = (productId: number, currentQuantity: number, stock: number) => {
    if (currentQuantity < stock) {
        try {
            updateQuantity(productId, currentQuantity + 1);
        } catch (err: any) {
            error('Erreur', err.message);
        }
    } else {
        warning('Stock insuffisant', `Maximum disponible: ${stock}`);
    }
};

const decrementQuantity = (productId: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
        updateQuantity(productId, currentQuantity - 1);
    }
};

const isConfirmingClear = ref(false);

const confirmClearCart = () => {
    if (isConfirmingClear.value) {
        clearCart();
        success('Panier vidé avec succès');
        isConfirmingClear.value = false;
    } else {
        isConfirmingClear.value = true;
        warning('Vider le panier ?', 'Cliquez à nouveau pour confirmer');
        setTimeout(() => {
            isConfirmingClear.value = false;
        }, 3000);
    }
};
</script>

<template>
    <div class="min-h-screen bg-dark py-12 px-4 sm:px-6 lg:px-8">
        <Head title="Mon Panier - Fur'n'Tours" />

        <NotificationContainer />

        <!-- Header -->
        <section class="container mx-auto px-4 py-12">
            <div class="mx-auto max-w-4xl">
                <div class="flex items-center gap-4 mb-8">
                    <Link href="/boutique" as="button">
                        <Button class="bg-blue/30 text-light-blue hover:bg-blue/50 border border-light-blue/30">
                            <ArrowLeft class="h-5 w-5 mr-2" />
                            Retour à la boutique
                        </Button>
                    </Link>
                    <h1 class="font-bold text-light-blue text-4xl flex items-center gap-3">
                        <ShoppingCart class="h-10 w-10" />
                        Mon Panier
                    </h1>
                </div>

                <!-- Empty State -->
                <div v-if="cartItems.length === 0" class="text-center py-16 rounded-lg border border-light-blue/30 bg-blue/20">
                    <Package class="h-20 w-20 mx-auto mb-6 text-light-blue/30" />
                    <h2 class="text-2xl font-bold text-light-blue mb-2">Votre panier est vide</h2>
                    <p class="text-light-blue/60 mb-6">
                        Découvrez nos produits et ajoutez-les à votre panier !
                    </p>
                    <Link href="/boutique" as="button">
                        <Button class="bg-gradient-to-r from-light-blue to-cyan-500 px-6 py-3 font-semibold text-[#2c3e50] hover:from-cyan-300 hover:to-light-blue">
                            Voir la boutique
                        </Button>
                    </Link>
                </div>

                <!-- Cart Items -->
                <div v-else class="space-y-6">
                    <!-- Items List -->
                    <div class="space-y-4">
                        <div
                            v-for="item in cartItems"
                            :key="item.id"
                            class="rounded-lg border border-light-blue/30 bg-blue/20 p-6 hover:border-light-blue/50 transition-all"
                        >
                            <div class="flex gap-6">
                                <!-- Image -->
                                <div class="h-24 w-24 flex-shrink-0 rounded overflow-hidden bg-blue/30">
                                    <img
                                        v-if="item.image"
                                        :src="`/storage/${item.image}`"
                                        :alt="item.name"
                                        class="h-full w-full object-cover"
                                    />
                                    <div v-else class="h-full w-full flex items-center justify-center">
                                        <ShoppingCart class="h-10 w-10 text-light-blue/30" />
                                    </div>
                                </div>

                                <!-- Info -->
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 class="text-xl font-bold text-white">{{ item.name }}</h3>
                                            <p class="text-sm text-light-blue/60 mt-1">{{ getCategoryLabel(item.category) }}</p>
                                        </div>
                                        <button
                                            @click="removeFromCart(item.id)"
                                            class="p-2 rounded hover:bg-red-500/20 text-light-blue/60 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 class="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div class="flex items-center justify-between mt-4">
                                        <!-- Quantity Controls -->
                                        <div class="flex items-center gap-3">
                                            <span class="text-sm text-light-blue/70">Quantité:</span>
                                            <div class="flex items-center gap-2 bg-blue/30 rounded border border-light-blue/30">
                                                <button
                                                    @click="decrementQuantity(item.id, item.quantity)"
                                                    :disabled="item.quantity <= 1"
                                                    class="p-2 hover:bg-blue/50 disabled:opacity-50 disabled:cursor-not-allowed text-light-blue transition-colors"
                                                >
                                                    <Minus class="h-4 w-4" />
                                                </button>
                                                <span class="w-12 text-center font-semibold text-white">{{ item.quantity }}</span>
                                                <button
                                                    @click="incrementQuantity(item.id, item.quantity, item.stock)"
                                                    :disabled="item.quantity >= item.stock"
                                                    class="p-2 hover:bg-blue/50 disabled:opacity-50 disabled:cursor-not-allowed text-light-blue transition-colors"
                                                >
                                                    <Plus class="h-4 w-4" />
                                                </button>
                                            </div>
                                            <span class="text-xs text-light-blue/50">
                                                ({{ item.stock }} disponible{{ item.stock > 1 ? 's' : '' }})
                                            </span>
                                        </div>

                                        <!-- Price -->
                                        <div class="text-right">
                                            <div class="text-sm text-light-blue/60">Prix unitaire: {{ Number(item.price).toFixed(2) }}€</div>
                                            <div class="text-2xl font-bold text-light-blue mt-1">
                                                {{ (Number(item.price) * item.quantity).toFixed(2) }}€
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Summary -->
                    <div class="rounded-lg border border-light-blue/30 bg-blue/20 p-6">
                        <div class="space-y-3">
                            <div class="flex items-center justify-between text-light-blue/70">
                                <span>Sous-total</span>
                                <span>{{ total.toFixed(2) }}€</span>
                            </div>
                            <div class="flex items-center justify-between text-light-blue/70">
                                <span>Frais de livraison</span>
                                <span>Calculés à l'étape suivante</span>
                            </div>
                            <div class="border-t border-light-blue/30 pt-3 flex items-center justify-between">
                                <span class="text-xl font-semibold text-light-blue">Total</span>
                                <span class="text-3xl font-bold text-light-blue">{{ total.toFixed(2) }}€</span>
                            </div>
                        </div>

                        <div class="flex gap-3 mt-6">
                            <Button
                                @click="confirmClearCart"
                                class="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                            >
                                Vider le panier
                            </Button>
                            <Link href="/boutique/checkout" as="button" class="flex-1">
                                <Button
                                    class="w-full bg-gradient-to-r from-light-blue to-cyan-500 text-[#2c3e50] hover:from-cyan-300 hover:to-light-blue font-semibold shadow-lg hover:shadow-xl transition-all"
                                >
                                    Passer la commande
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
