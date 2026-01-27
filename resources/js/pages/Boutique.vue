<script setup lang="ts">
import AppHeaderLayout from '@/layouts/app/AppHeaderLayout.vue';
import { Head, router } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package, Users, Ticket, Filter } from 'lucide-vue-next';
import { ref } from 'vue';
import { useCart } from '@/composables/useCart';
import { useNotification } from '@/composables/useNotification';
import NotificationContainer from '@/components/NotificationContainer.vue';

defineOptions({
    layout: AppHeaderLayout,
});

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    image?: string;
    active: boolean;
}

interface Props {
    products: Product[];
    selectedCategory: string;
}

const props = defineProps<Props>();

const { addToCart: addToCartComposable } = useCart();
const { success, error, warning } = useNotification();

const productQuantities = ref<Record<number, number>>({});

const categories = [
    { value: 'all', label: 'Tout', icon: Package, color: 'from-blue-500 to-cyan-500' },
    { value: 'merch', label: 'Merch', icon: ShoppingCart, color: 'from-blue-500 to-purple-500' },
    { value: 'membership', label: 'Adhésions', icon: Users, color: 'from-purple-500 to-pink-500' },
    { value: 'ticket', label: 'Tickets', icon: Ticket, color: 'from-green-500 to-emerald-500' },
];

const filterByCategory = (category: string) => {
    router.get('/boutique', { category }, { preserveState: true });
};

const addToCart = (product: Product) => {
    const quantity = getProductQuantity(product.id);
    try {
        addToCartComposable({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image: product.image,
            category: product.category,
            stock: product.stock,
        }, quantity);

        // Afficher la notification avec image
        success(product.name, undefined, {
            image: product.image,
            price: product.price,
            quantity: quantity,
        });
        // Réinitialiser la quantité
        setProductQuantity(product.id, 1, product.stock);
    } catch (err: any) {
        if (err.message.startsWith('Stock insuffisant')) {
            warning('Stock insuffisant', `La quantité demandée pour "${product.name}" dépasse le stock disponible. `);
            return;
        }
        error('Erreur', err.message);
    }
};

const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.icon || Package;
};

const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
        merch: 'Merch',
        membership: 'Adhésion',
        ticket: 'Ticket',
    };
    return labels[category] || category;
};

const getProductQuantity = (productId: number) => {
    return productQuantities.value[productId] || 1;
};

const setProductQuantity = (productId: number, quantity: number, stock: number) => {
    const maxQuantity = Math.min(Math.max(1, quantity), stock);
    productQuantities.value[productId] = maxQuantity;
};
</script>

<template>
    <div class="bg-dark">
        <Head title="Boutique - Fur'n'Tours" />
        
        <NotificationContainer />

        <!-- Hero Section -->
        <section class="bg-gradient-to-b from-dark to-[#1a2332] container mx-auto px-4 py-8 mb-4">
            <div class="mx-auto max-w-7xl text-center">
                <h1 class="font-bold text-light-blue text-5xl md:text-6xl mb-4">
                    Notre <span class="text-blue">Boutique</span>
                </h1>
                <p class="text-light-blue/70 text-lg md:text-xl max-w-2xl mx-auto">
                    Découvrez notre sélection de produits, adhésions et tickets pour nos événements
                </p>
            </div>
        </section>

        <!-- Category Filters -->
        <section class="container mx-auto px-4 mb-8">
            <div class="mx-auto max-w-7xl">
                <div class="flex items-center gap-2 mb-6">
                    <Filter class="h-5 w-5 text-light-blue" />
                    <span class="text-light-blue font-semibold">Filtrer par catégorie :</span>
                </div>
                <div class="flex flex-wrap gap-3">
                    <button
                        v-for="cat in categories"
                        :key="cat.value"
                        @click="filterByCategory(cat.value)"
                        :class="[
                            'flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all',
                            props.selectedCategory === cat.value
                                ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                                : 'bg-blue/20 text-light-blue border border-light-blue/30 hover:bg-blue/30',
                        ]"
                    >
                        <component :is="cat.icon" class="h-5 w-5" />
                        {{ cat.label }}
                        <span
                            v-if="cat.value === 'all'"
                            class="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs"
                        >
                            {{ props.products.length }}
                        </span>
                        <span
                            v-else
                            class="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs"
                        >
                            {{ props.products.filter(p => p.category === cat.value).length }}
                        </span>
                    </button>
                </div>
            </div>
        </section>

        <!-- Products Grid -->
        <section class="container mx-auto px-4 pb-16">
            <div class="mx-auto max-w-7xl">
                <div v-if="props.products.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div
                        v-for="product in props.products"
                        :key="product.id"
                        class="group rounded-lg border border-light-blue/30 bg-blue/20 overflow-hidden hover:border-light-blue/50 hover:shadow-lg hover:shadow-light-blue/20 transition-all"
                    >
                        <!-- Image -->
                        <div class="relative h-48 bg-blue/30 overflow-hidden">
                            <img
                                v-if="product.image"
                                :src="`/storage/${product.image}`"
                                :alt="product.name"
                                class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div
                                v-else
                                class="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue/40 to-light-blue/20"
                            >
                                <component :is="getCategoryIcon(product.category)" class="h-20 w-20 text-light-blue/30" />
                            </div>
                            
                            <!-- Category Badge -->
                            <div class="absolute top-3 right-3 px-3 py-1 rounded-full bg-blue/80 backdrop-blur-sm border border-light-blue/30">
                                <span class="text-xs font-semibold text-light-blue">
                                    {{ getCategoryLabel(product.category) }}
                                </span>
                            </div>

                            <!-- Stock Badge -->
                            <div
                                v-if="product.stock < 10"
                                :class="[
                                    'absolute top-3 left-3 px-3 py-1 rounded-full backdrop-blur-sm border',
                                    product.stock <= 0
                                        ? 'bg-red-500/80 text-white border-red-400'
                                        : 'bg-yellow-500/80 text-white border-yellow-400',
                                ]"
                            >
                                <span class="text-xs font-semibold">
                                    {{ product.stock <= 0 ? 'Rupture' : `Stock limité (${product.stock})` }}
                                </span>
                            </div>
                        </div>

                        <!-- Content -->
                        <div class="p-6">
                            <h3 class="text-xl font-bold text-white mb-2 group-hover:text-light-blue transition-colors">
                                {{ product.name }}
                            </h3>
                            
                            <p v-if="product.description" class="text-light-blue/60 text-sm mb-4 line-clamp-2">
                                {{ product.description }}
                            </p>

                            <div class="flex items-center justify-between gap-2 mt-4">
                                <div class="text-2xl font-bold text-light-blue">
                                    {{ Number(product.price).toFixed(2) }}€
                                </div>
                                
                                <!-- Quantity Selector -->
                                <div class="flex items-center gap-2 bg-blue/20 rounded-lg border border-light-blue/30 p-1">
                                    <button
                                        @click="setProductQuantity(product.id, getProductQuantity(product.id) - 1, product.stock)"
                                        :disabled="getProductQuantity(product.id) <= 1"
                                        class="h-7 w-7 flex items-center justify-center rounded hover:bg-light-blue/20 disabled:opacity-50 disabled:cursor-not-allowed text-light-blue"
                                    >
                                        −
                                    </button>
                                    <span class="w-8 text-center text-sm font-medium text-light-blue">
                                        {{ getProductQuantity(product.id) }}
                                    </span>
                                    <button
                                        @click="setProductQuantity(product.id, getProductQuantity(product.id) + 1, product.stock)"
                                        :disabled="getProductQuantity(product.id) >= product.stock"
                                        class="h-7 w-7 flex items-center justify-center rounded hover:bg-light-blue/20 disabled:opacity-50 disabled:cursor-not-allowed text-light-blue"
                                    >
                                        +
                                    </button>
                                </div>
                                
                                <Button
                                    @click="addToCart(product)"
                                    :disabled="product.stock <= 0"
                                    :class="[
                                        'font-semibold transition-all',
                                        product.stock <= 0
                                            ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-light-blue to-cyan-500 text-[#2c3e50] hover:from-cyan-300 hover:to-light-blue hover:shadow-lg hover:shadow-light-blue/30',
                                    ]"
                                >
                                    <ShoppingCart class="h-4 w-4 mr-2" />
                                    {{ product.stock <= 0 ? 'Épuisé' : 'Ajouter' }}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-16">
                    <Package class="h-20 w-20 mx-auto mb-6 text-light-blue/30" />
                    <h3 class="text-2xl font-bold text-light-blue mb-2">Aucun produit disponible</h3>
                    <p class="text-light-blue/60 mb-6">
                        Aucun produit ne correspond à votre recherche dans cette catégorie.
                    </p>
                    <Button
                        @click="filterByCategory('all')"
                        class="bg-gradient-to-r from-light-blue to-cyan-500 px-6 py-3 font-semibold text-[#2c3e50] hover:from-cyan-300 hover:to-light-blue"
                    >
                        Voir tous les produits
                    </Button>
                </div>
            </div>
        </section>
    </div>
</template>
