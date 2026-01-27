<script setup lang="ts">
import AdminLayout from '@/layouts/AdminLayout.vue';
import RichTextEditor from '@/components/RichTextEditor.vue';
import { Head, useForm, router } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { usePage } from '@inertiajs/vue3';
import { computed, ref, watch } from 'vue';
import { CheckCircle, AlertCircle } from 'lucide-vue-next';
import { useNotification } from '@/composables/useNotification';
import NotificationContainer from '@/components/NotificationContainer.vue';

defineOptions({
    layout: AdminLayout,
});

const page = usePage();

const canManageFurmeets = computed(() => {
    const user = page.props.auth.user as any;
    return user.role_level === 'master' || (user.permissions && user.permissions.includes('manage_furmeets'));
});

if (!canManageFurmeets.value) {
    router.visit('/admin/furmeets');
}
const { success, error } = useNotification();

// Récupérer les messages flash
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

const form = useForm({
    title: '',
    date: '',
    description: '',
    is_published: false,
});

const submit = () => {
    form.post('/admin/furmeets', {
        onSuccess: () => {
            form.reset();
        },
    });
};
</script>

<template>
    <div>
        <Head title="Créer un FurMeet" />

        <NotificationContainer />

        <!-- Hero Section -->
        <section class="container mx-auto px-4">
            <div class="mx-auto max-w-4xl text-center mb-8">
                <h1 class="font-bold text-light-blue text-4xl md:text-5xl">
                    Créer un <span class="text-blue">FurMeet™</span>
                </h1>
                <p class="mt-4 text-gray-300">Remplissez le formulaire pour créer un nouvel événement</p>
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
                                    Publier immédiatement
                                </label>
                            </div>

                            <!-- Submit Button -->
                            <div class="flex gap-4">
                                <Button
                                    type="submit"
                                    :disabled="form.processing"
                                    class="flex-1 bg-gradient-to-r from-light-blue to-cyan-500 px-6 py-3 font-semibold text-[#2c3e50] hover:from-cyan-300 hover:to-light-blue hover:shadow-lg hover:shadow-light-blue/30"
                                >
                                    {{ form.processing ? 'Création...' : 'Créer le FurMeet' }}
                                </Button>

                                <Button
                                    type="button"
                                    as="a"
                                    href="/admin/furmeets"
                                    class="bg-gray-700 px-6 py-3 font-semibold text-white hover:bg-gray-600"
                                >
                                    Annuler
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
    </div>
</template>
