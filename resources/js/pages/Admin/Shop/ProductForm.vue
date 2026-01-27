<script setup lang="ts">
import AdminLayout from '@/layouts/AdminLayout.vue';
import { Head, Link, useForm, usePage } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, ImagePlus } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import NotificationContainer from '@/components/NotificationContainer.vue';
import { useNotification } from '@/composables/useNotification';

defineOptions({
    layout: AdminLayout,
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
    product?: Product | null;
    categories: string[];
}

const props = defineProps<Props>();

const isEditing = !!props.product;
const previewImage = ref<string | null>(props.product?.image ? `/storage/${props.product.image}` : null);

const form = useForm({
    name: props.product?.name || '',
    slug: props.product?.slug || '',
    description: props.product?.description || '',
    price: props.product?.price || 0,
    stock: props.product?.stock || 0,
    category: props.product?.category || 'merch',
    image: null as File | null,
    active: props.product?.active ?? true,
});

const { success, error } = useNotification();
const page = usePage();

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
)

const generateSlug = () => {
    const slug = form.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    form.slug = slug;
};

const onImageChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
        form.image = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.value = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
};

const submit = () => {
    // Toujours forcer FormData pour supporter l'image optionnelle et éviter les corps vides
    if (isEditing && props.product?.id) {
        form
            .transform((data) => ({ ...data, _method: 'put' }))
            .post(`/admin/products/${props.product.id}`, {
                forceFormData: true,
                onSuccess: () => {
                    form.reset('image');
                },
                onFinish: () => {
                    form.transform((data) => data); // reset transform
                },
            });
    } else {
        form.post('/admin/products', {
            forceFormData: true,
            onSuccess: () => {
                form.reset('image');
            },
        });
    }
};


</script>

<template>
    <div>
        <Head :title="`Admin - ${isEditing ? 'Modifier' : 'Créer'} un produit`" />

        <NotificationContainer />

        <!-- Header -->
        <section class="container mx-auto px-4 mb-8">
            <div class="mx-auto max-w-2xl">
                <div class="flex items-center gap-4">
                    <Link href="/admin/products" as="button">
                        <Button class="bg-blue/30 text-light-blue hover:bg-blue/50 border border-light-blue/30">
                            <ArrowLeft class="h-5 w-5 mr-2" />
                            Retour
                        </Button>
                    </Link>
                    <h1 class="font-bold text-light-blue text-3xl">
                        {{ isEditing ? 'Modifier le produit' : 'Créer un nouveau produit' }}
                    </h1>
                </div>
            </div>
        </section>

        <!-- Form -->
        <section class="container mx-auto px-4 mb-8">
            <div class="mx-auto max-w-2xl">
                <form @submit.prevent="submit" class="space-y-6">
                    <!-- Image Upload -->
                    <div class="rounded-lg border border-light-blue/30 bg-blue/20 p-6">
                        <label class="block text-sm font-medium text-light-blue mb-4">Image du produit</label>

                        <div class="flex gap-6">
                            <!-- Preview -->
                            <div class="flex-shrink-0">
                                <div
                                    v-if="previewImage"
                                    class="h-32 w-32 rounded-lg overflow-hidden border-2 border-light-blue/30"
                                >
                                    <img :src="previewImage" :alt="form.name" class="h-full w-full object-cover" />
                                </div>
                                <div v-else class="h-32 w-32 rounded-lg border-2 border-dashed border-light-blue/30 flex items-center justify-center bg-blue/10">
                                    <ImagePlus class="h-8 w-8 text-light-blue/50" />
                                </div>
                            </div>

                            <!-- Upload Input -->
                            <div class="flex-1 flex flex-col justify-center">
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    @change="onImageChange"
                                    class="hidden"
                                />
                                <label
                                    for="image"
                                    class="inline-block bg-blue/30 text-light-blue hover:bg-blue/50 border border-light-blue/30 px-6 py-3 rounded font-semibold cursor-pointer transition-colors"
                                >
                                    Choisir une image
                                </label>
                                <p class="text-xs text-light-blue/60 mt-2">PNG, JPG, GIF (max 2MB)</p>
                            </div>
                        </div>
                    </div>

                    <!-- Basic Info -->
                    <div class="space-y-4">
                        <div>
                            <label for="name" class="block text-sm font-medium text-light-blue mb-2">Nom du produit *</label>
                            <input
                                id="name"
                                v-model="form.name"
                                @blur="generateSlug"
                                type="text"
                                placeholder="Ex: T-Shirt Fur'n'Tours"
                                class="w-full px-4 py-2 bg-blue/30 border border-light-blue/30 rounded text-white placeholder-light-blue/50 focus:outline-none focus:border-light-blue/60"
                            />
                            <span v-if="form.errors.name" class="text-sm text-red-400">{{ form.errors.name }}</span>
                        </div>

                        <div>
                            <label for="slug" class="block text-sm font-medium text-light-blue mb-2">URL slug *</label>
                            <input
                                id="slug"
                                v-model="form.slug"
                                type="text"
                                placeholder="ex-tshirt-furntours"
                                class="w-full px-4 py-2 bg-blue/30 border border-light-blue/30 rounded text-white placeholder-light-blue/50 focus:outline-none focus:border-light-blue/60"
                            />
                            <span v-if="form.errors.slug" class="text-sm text-red-400">{{ form.errors.slug }}</span>
                        </div>

                        <div>
                            <label for="description" class="block text-sm font-medium text-light-blue mb-2">Description</label>
                            <textarea
                                id="description"
                                v-model="form.description"
                                rows="4"
                                placeholder="Décrivez votre produit..."
                                class="w-full px-4 py-2 bg-blue/30 border border-light-blue/30 rounded text-white placeholder-light-blue/50 focus:outline-none focus:border-light-blue/60 resize-none"
                            />
                            <span v-if="form.errors.description" class="text-sm text-red-400">{{ form.errors.description }}</span>
                        </div>
                    </div>

                    <!-- Price & Stock -->
                    <div class="grid gap-4 md:grid-cols-2">
                        <div>
                            <label for="price" class="block text-sm font-medium text-light-blue mb-2">Prix (€) *</label>
                            <input
                                id="price"
                                v-model.number="form.price"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                class="w-full px-4 py-2 bg-blue/30 border border-light-blue/30 rounded text-white placeholder-light-blue/50 focus:outline-none focus:border-light-blue/60"
                            />
                            <span v-if="form.errors.price" class="text-sm text-red-400">{{ form.errors.price }}</span>
                        </div>

                        <div>
                            <label for="stock" class="block text-sm font-medium text-light-blue mb-2">Stock *</label>
                            <input
                                id="stock"
                                v-model.number="form.stock"
                                type="number"
                                min="0"
                                placeholder="0"
                                class="w-full px-4 py-2 bg-blue/30 border border-light-blue/30 rounded text-white placeholder-light-blue/50 focus:outline-none focus:border-light-blue/60"
                            />
                            <span v-if="form.errors.stock" class="text-sm text-red-400">{{ form.errors.stock }}</span>
                        </div>
                    </div>

                    <!-- Category & Status -->
                    <div class="grid gap-4 md:grid-cols-2">
                        <div>
                            <label for="category" class="block text-sm font-medium text-light-blue mb-2">Catégorie *</label>
                            <select
                                id="category"
                                v-model="form.category"
                                class="w-full px-4 py-2 bg-blue/30 border border-light-blue/30 rounded text-white focus:outline-none focus:border-light-blue/60"
                            >
                                <option value="merch">🛍️ Merch</option>
                                <option value="membership">👥 Adhésion</option>
                                <option value="ticket">🎫 Ticket</option>
                            </select>
                            <span v-if="form.errors.category" class="text-sm text-red-400">{{ form.errors.category }}</span>
                        </div>

                        <div class="flex items-end">
                            <label class="flex items-center gap-3 cursor-pointer">
                                <input
                                    v-model="form.active"
                                    type="checkbox"
                                    class="w-5 h-5 rounded border border-light-blue/30 bg-blue/30 accent-light-blue"
                                />
                                <span class="text-sm font-medium text-light-blue">Produit actif</span>
                            </label>
                        </div>
                    </div>

                    <!-- Submit -->
                    <div class="flex gap-4">
                        <Button
                            type="submit"
                            :disabled="form.processing"
                            class="flex-1 bg-gradient-to-r from-light-blue to-cyan-500 px-6 py-3 font-semibold text-[#2c3e50] hover:from-cyan-300 hover:to-light-blue disabled:opacity-50"
                        >
                            <Save class="h-5 w-5 mr-2" />
                            {{ isEditing ? 'Modifier' : 'Créer' }} le produit
                        </Button>
                        <Link href="/admin/products" as="button" class="flex-1">
                            <Button class="w-full bg-blue/30 text-light-blue hover:bg-blue/50 border border-light-blue/30">
                                Annuler
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </section>
    </div>
</template>
