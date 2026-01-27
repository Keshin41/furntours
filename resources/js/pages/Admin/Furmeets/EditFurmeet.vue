<script setup lang="ts">
import AdminLayout from '@/layouts/AdminLayout.vue';
import RichTextEditor from '@/components/RichTextEditor.vue';
import { Head, useForm, router, usePage } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { computed, ref, watch } from 'vue';
import { CheckCircle, AlertCircle } from 'lucide-vue-next';

defineOptions({
    layout: AdminLayout,
});

interface FurMeet {
    id: number;
    title: string;
    date: string;
    description: string;
    is_published: boolean;
}

interface Props {
    furMeet: FurMeet;
}

const props = defineProps<Props>();
const page = usePage();

const canManageFurmeets = computed(() => {
    const user = page.props.auth.user as any;
    return user.role_level === 'master' || (user.permissions && user.permissions.includes('manage_furmeets'));
});

if (!canManageFurmeets.value) {
    router.visit('/admin/furmeets');
}

const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

// Récupérer les messages flash
watch(
    () => page.props.flash,
    (flash: any) => {
        if (flash?.success) {
            successMessage.value = flash.success;
            setTimeout(() => {
                successMessage.value = null;
            }, 5000);
        }
        if (flash?.error) {
            errorMessage.value = flash.error;
            setTimeout(() => {
                errorMessage.value = null;
            }, 5000);
        }
    },
    { immediate: true, deep: true }
);

// Formater la date pour l'input datetime-local
const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const form = useForm({
    title: props.furMeet.title,
    date: formatDateForInput(props.furMeet.date),
    description: props.furMeet.description,
    is_published: props.furMeet.is_published,
});

const submit = () => {
    form.put(`/admin/furmeets/${props.furMeet.id}`, {
        onSuccess: () => {
            // Optionnel: rediriger vers la liste
        },
    });
};

const deleteFurMeet = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce FurMeet ?')) {
        router.delete(`/admin/furmeets/${props.furMeet.id}`, {
            onSuccess: () => {
                router.visit('/admin/furmeets');
            },
        });
    }
};
</script>

<template>
    <div>
        <Head title="Modifier un FurMeet" />

        <!-- Message de succès -->
        <div
            v-if="successMessage"
            class="fixed top-46 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/20 px-6 py-4 text-green-400 shadow-lg animate-in fade-in slide-in-from-top-5"
        >
            <CheckCircle class="h-5 w-5" />
            <span class="font-medium">{{ successMessage }}</span>
        </div>

        <!-- Message d'erreur -->
        <div
            v-if="errorMessage"
            class="fixed top-46 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/20 px-6 py-4 text-red-400 shadow-lg animate-in fade-in slide-in-from-top-5"
        >
            <AlertCircle class="h-5 w-5" />
            <span class="font-medium">{{ errorMessage }}</span>
        </div>

        <!-- Hero Section -->
        <section class="container mx-auto px-4">
            <div class="mx-auto max-w-4xl text-center mb-8">
                <h1 class="font-bold text-light-blue text-4xl md:text-5xl">
                    Modifier un <span class="text-blue">FurMeet™</span>
                </h1>
                <p class="mt-4 text-gray-300">FurMeet #{{ props.furMeet.id }}</p>
            </div>
        </section>

        <!-- Form Section -->
        <section class="container mx-auto px-4">
            <div class="mx-auto max-w-6xl">
                <div class="rounded-lg border border-light-blue/30 bg-blue/20 p-8">
                        <form @submit.prevent="submit" class="space-y-6">
                            <!-- Title -->
                            <div>
                                <label for="title" class="mb-2 block text-sm font-medium text-gray-200">
                                    Titre *
                                </label>
                                <input
                                    id="title"
                                    v-model="form.title"
                                    type="text"
                                    required
                                    class="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white focus:border-light-blue focus:outline-none focus:ring-2 focus:ring-light-blue/50"
                                    placeholder="Ex: FurMeet Tours - Janvier 2026"
                                />
                                <div v-if="form.errors.title" class="mt-1 text-sm text-red-400">
                                    {{ form.errors.title }}
                                </div>
                            </div>

                            <!-- Date -->
                            <div>
                                <label for="date" class="mb-2 block text-sm font-medium text-gray-200">
                                    Date *
                                </label>
                                <input
                                    id="date"
                                    v-model="form.date"
                                    type="datetime-local"
                                    required
                                    class="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white focus:border-light-blue focus:outline-none focus:ring-2 focus:ring-light-blue/50"
                                />
                                <div v-if="form.errors.date" class="mt-1 text-sm text-red-400">
                                    {{ form.errors.date }}
                                </div>
                            </div>

                            <!-- Description -->
                            <div>
                                <label for="description" class="mb-2 block text-sm font-medium text-gray-200">
                                    Description *
                                </label>
                                <RichTextEditor v-model="form.description" />
                                <div v-if="form.errors.description" class="mt-1 text-sm text-red-400">
                                    {{ form.errors.description }}
                                </div>
                            </div>

                            <!-- Is Published -->
                            <div class="flex items-center gap-3">
                                <input
                                    id="is_published"
                                    v-model="form.is_published"
                                    type="checkbox"
                                    class="h-5 w-5 rounded border-gray-600 bg-gray-800 text-light-blue focus:ring-2 focus:ring-light-blue/50"
                                />
                                <label for="is_published" class="text-sm font-medium text-gray-200">
                                    Publier
                                </label>
                            </div>

                            <!-- Submit Button -->
                            <div class="flex gap-4">
                                <Button
                                    type="submit"
                                    :disabled="form.processing"
                                    class="flex-1 bg-gradient-to-r from-light-blue to-cyan-500 px-6 py-3 font-semibold text-[#2c3e50] hover:from-cyan-300 hover:to-light-blue hover:shadow-lg hover:shadow-light-blue/30"
                                >
                                    {{ form.processing ? 'Mise à jour...' : 'Mettre à jour' }}
                                </Button>

                                <Button
                                    type="button"
                                    as="a"
                                    href="/admin/furmeets"
                                    class="bg-gray-700 px-6 py-3 font-semibold text-white hover:bg-gray-600"
                                >
                                    Annuler
                                </Button>

                                <Button
                                    type="button"
                                    @click="deleteFurMeet"
                                    class="bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
                                >
                                    Supprimer
                                </Button>
                            </div>
                        </form>
                    </div>
                
            </div>
        </section>
    </div>
</template>
