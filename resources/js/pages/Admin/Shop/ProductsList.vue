<script setup lang="ts">
import AdminLayout from '@/layouts/AdminLayout.vue';
import { Head, Link, usePage, router } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { PlusCircle, CheckCircle, Pencil, Trash2, Package } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import { computed } from 'vue';
import NotificationContainer from '@/components/NotificationContainer.vue';
import { useNotification } from '@/composables/useNotification';


defineOptions({
    layout: AdminLayout,
});


interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
    category: string;
    active: boolean;
    image?: string;
}

interface Props {
    products: Product[];
}

const props = defineProps<Props>();
const page = usePage();

const { success, error } = useNotification();

watch(
    () => page.props.flash,
    (flash: any) => {
        if (flash?.success) {
            success('Succès', flash.success);
        }
        if (flash?.error) {
            error('Erreur', flash.error);
        }
    },
    { immediate: true, deep: true }
);

const deleteProduct = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        router.delete(`/admin/products/${id}`);
    }
};

const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
        merch: '🛍️ Merch',
        membership: '👥 Adhésion',
        ticket: '🎫 Ticket',
    };
    return labels[category] || category;
};

const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
        merch: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        membership: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        ticket: 'bg-green-500/20 text-green-400 border-green-500/30',
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
};

// Récupérer l'utilisateur connecté
const currentUser = computed(() => page.props.auth?.user);

const canEdit = computed(() => {
    if (!currentUser.value) return false;
    return currentUser.value.role_level === 'master' || 
           (currentUser.value.permissions?.includes('manage_products') ?? false);
});
</script>

<template>
    <div>
        <Head title="Admin - Gestion des Produits" />

        <NotificationContainer />

        <!-- Hero Section -->
        <section class="container mx-auto px-4">
            <div class="mx-auto max-w-7xl mb-8">
                <div class="flex items-center justify-between">
                    <h1 class="font-bold text-light-blue text-4xl md:text-5xl">
                        Gestion de la <span class="text-blue">Boutique</span>
                    </h1>
                    <Link v-if="canEdit" href="/admin/products/create" as="button">
                        <Button
                            class="bg-gradient-to-r from-light-blue to-cyan-500 px-6 py-3 font-semibold text-[#2c3e50] hover:from-cyan-300 hover:to-light-blue hover:shadow-lg hover:shadow-light-blue/30"
                        >
                            <PlusCircle class="h-5 w-5 mr-2" />
                            Ajouter un produit
                        </Button>
                    </Link>
                </div>
            </div>
        </section>

        <!-- Products Grid -->
        <section class="container mx-auto px-4">
            <div class="mx-auto max-w-7xl">
                <!-- Stats -->
                <div class="grid gap-4 md:grid-cols-3 mb-8">
                    <div class="rounded-lg border border-light-blue/30 bg-blue/20 p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-light-blue/70">Total Produits</p>
                                <p class="text-3xl font-bold text-light-blue">{{ products.length }}</p>
                            </div>
                            <Package class="h-10 w-10 text-light-blue/50" />
                        </div>
                    </div>
                    <div class="rounded-lg border border-light-blue/30 bg-blue/20 p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-light-blue/70">Stock Total</p>
                                <p class="text-3xl font-bold text-light-blue">
                                    {{ products.reduce((sum, p) => sum + p.stock, 0) }}
                                </p>
                            </div>
                            <Package class="h-10 w-10 text-light-blue/50" />
                        </div>
                    </div>
                    <div class="rounded-lg border border-light-blue/30 bg-blue/20 p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-light-blue/70">Actifs</p>
                                <p class="text-3xl font-bold text-light-blue">
                                    {{ products.filter(p => p.active).length }}
                                </p>
                            </div>
                            <CheckCircle class="h-10 w-10 text-light-blue/50" />
                        </div>
                    </div>
                </div>

                <!-- Table -->
                <div v-if="props.products.length > 0" class="rounded-lg border border-light-blue/30 bg-blue/20 overflow-hidden">
                    <table class="w-full">
                        <thead class="border-b border-light-blue/30 bg-blue/30">
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-semibold text-light-blue">Produit</th>
                                <th class="px-6 py-4 text-left text-sm font-semibold text-light-blue">Catégorie</th>
                                <th class="px-6 py-4 text-right text-sm font-semibold text-light-blue">Prix</th>
                                <th class="px-6 py-4 text-right text-sm font-semibold text-light-blue">Stock</th>
                                <th class="px-6 py-4 text-center text-sm font-semibold text-light-blue">Statut</th>
                                <th v-if="canEdit" class="px-6 py-4 text-right text-sm font-semibold text-light-blue">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="product in products"
                                :key="product.id"
                                class="border-b border-light-blue/20 hover:bg-blue/30 transition-colors"
                            >
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div
                                            v-if="product.image"
                                            class="h-10 w-10 rounded overflow-hidden bg-light-blue/20"
                                        >
                                            <img
                                                :src="`/storage/${product.image}`"
                                                :alt="product.name"
                                                class="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div v-else class="h-10 w-10 rounded bg-light-blue/20 flex items-center justify-center">
                                            <Package class="h-5 w-5 text-light-blue/50" />
                                        </div>
                                        <div>
                                            <p class="font-medium text-white">{{ product.name }}</p>
                                            <p class="text-xs text-light-blue/60">{{ product.slug }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <span
                                        :class="`inline-block px-3 py-1 rounded border text-xs font-medium ${getCategoryColor(
                                            product.category
                                        )}`"
                                    >
                                        {{ getCategoryLabel(product.category) }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-right font-semibold text-light-blue">
                                    {{ Number(product.price).toFixed(2) }}€
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <span
                                        :class="[
                                            'px-3 py-1 rounded text-xs font-medium',
                                            product.stock > 10
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : product.stock > 0
                                                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                  : 'bg-red-500/20 text-red-400 border border-red-500/30',
                                        ]"
                                    >
                                        {{ product.stock }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span
                                        :class="[
                                            'inline-block px-3 py-1 rounded text-xs font-medium',
                                            product.active
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : 'bg-red-500/20 text-red-400 border border-red-500/30',
                                        ]"
                                    >
                                        {{ product.active ? 'Actif' : 'Inactif' }}
                                    </span>
                                </td>
                                <td v-if="canEdit" class="px-6 py-4 text-right">
                                    <div class="flex gap-2 justify-end">
                                        <Link :href="`/admin/products/${product.id}/edit`" as="button">
                                            <Button
                                                size="sm"
                                                class="bg-blue/30 text-light-blue hover:bg-blue/50 border border-light-blue/30"
                                            >
                                                <Pencil class="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            size="sm"
                                            @click="deleteProduct(product.id)"
                                            class="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                                        >
                                            <Trash2 class="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Empty State -->
                <div v-else class="rounded-lg border-2 border-dashed border-muted p-12 text-center">
                    <Package class="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p class="mb-4 text-lg text-muted-foreground">
                        Aucun produit pour le moment.
                    </p>
                    <Link href="/admin/products/create" as="button">
                        <Button v-if="canEdit"
                            class="bg-gradient-to-r from-light-blue to-cyan-500 px-6 py-3 font-semibold text-[#2c3e50] hover:from-cyan-300 hover:to-light-blue"
                        >
                            Créer le premier produit
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    </div>
</template>
