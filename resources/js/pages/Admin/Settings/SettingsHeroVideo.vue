<script setup lang="ts">
import AdminLayout from '@/layouts/AdminLayout.vue';
import { Head, Link, useForm, usePage } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload } from 'lucide-vue-next';
import { watch, ref, computed } from 'vue';
import { useNotification } from '@/composables/useNotification';
import NotificationContainer from '@/components/NotificationContainer.vue';
import InputError from '@/components/InputError.vue';

defineOptions({
    layout: AdminLayout,
});

interface Props {
    heroVideoUrl: string | null;
}

const page = usePage();
const props = defineProps<Props>();
const { success, error } = useNotification();
const previewUrl = ref<string | null>(null);

const videoUrl = computed(() => props.heroVideoUrl ?? '/videos/hero-background.webm');

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
    video: null as File | null,
});

const handleVideoChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
        form.video = file;
        // Créer un aperçu de la nouvelle vidéo
        const reader = new FileReader();
        reader.onload = (e) => {
            previewUrl.value = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
};

const submit = () => {
    form.post('/admin/settings/hero-video', {
        forceFormData: true,
        onSuccess: () => {
            form.reset();
            previewUrl.value = null;
        },
    });
};
</script>

<template>
    <div>
        <Head title="Admin - Vidéo Hero" />

        <NotificationContainer />

        <!-- Back Button -->
        <div class="container mx-auto px-4 mb-6">
            <Link href="/admin/settings" as="button">
                <Button class="bg-blue/30 text-light-blue hover:bg-blue/50 border border-light-blue/30">
                    <ArrowLeft class="h-4 w-4 mr-2" /> Retour aux paramètres
                </Button>
            </Link>
        </div>

        <!-- Hero Section -->
        <section class="container mx-auto px-4 mb-8">
            <div class="mx-auto max-w-7xl">
                <h1 class="font-bold text-light-blue text-4xl md:text-5xl mb-4">
                    Vidéo <span class="text-blue">Hero</span>
                </h1>
                <p class="text-gray-300 text-lg">
                    Uploadez une nouvelle vidéo pour l'afficher en background de l'accueil
                </p>
            </div>
        </section>

        <!-- Content -->
        <section class="container mx-auto px-4 mb-12">
            <div class="mx-auto max-w-4xl">
                <div class="rounded-lg border border-light-blue/30 bg-blue/20 p-8">
                    <form @submit.prevent="submit" class="space-y-8">
                        <!-- Vidéo actuelle -->
                        <div class="space-y-3">
                            <label class="block text-lg font-semibold text-light-blue">
                                Vidéo actuelle
                            </label>
                            <div class="relative h-64 overflow-hidden rounded-lg border border-light-blue/30 bg-dark">
                                <video
                                    v-if="videoUrl"
                                    :src="videoUrl"
                                    controls
                                    class="h-full w-full object-cover"
                                />
                                <div v-else class="flex items-center justify-center h-full text-gray-400">
                                    Aucune vidéo disponible
                                </div>
                            </div>
                        </div>

                        <!-- Upload vidéo -->
                        <div class="space-y-3">
                            <label class="block text-lg font-semibold text-light-blue">
                                Uploader une nouvelle vidéo
                            </label>
                            <div class="relative rounded-lg border-2 border-dashed border-light-blue/30 bg-dark/50 p-8 text-center transition-all hover:border-light-blue/50">
                                <input
                                    type="file"
                                    accept="video/mp4,video/webm,video/ogg"
                                    @change="handleVideoChange"
                                    class="hidden"
                                    id="video-input"
                                />
                                <label for="video-input" class="cursor-pointer flex flex-col items-center gap-3">
                                    <Upload class="h-8 w-8 text-light-blue" />
                                    <div>
                                        <p class="text-light-blue font-semibold">Cliquez pour sélectionner une vidéo</p>
                                        <p class="text-sm text-gray-400 mt-1">ou glissez-déposez un fichier</p>
                                        <p class="text-xs text-gray-500 mt-2">Formats: MP4, WebM, OGG • Max 100MB</p>
                                    </div>
                                </label>
                            </div>
                            <InputError :message="form.errors.video" />
                        </div>

                        <!-- Aperçu nouvelle vidéo -->
                        <div v-if="previewUrl" class="space-y-3">
                            <label class="block text-lg font-semibold text-light-blue">
                                Aperçu de la nouvelle vidéo
                            </label>
                            <div class="relative h-64 overflow-hidden rounded-lg border border-light-blue/30 bg-dark">
                                <video
                                    :src="previewUrl"
                                    controls
                                    class="h-full w-full object-cover"
                                />
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                :disabled="form.processing || !form.video"
                                class="bg-blue text-black hover:bg-blue/80 disabled:opacity-50"
                            >
                                {{ form.processing ? 'Upload en cours...' : 'Sauvegarder' }}
                            </Button>
                            <Link href="/admin/settings" as="button">
                                <Button type="button" class="bg-blue/30 text-light-blue hover:bg-blue/50 border border-light-blue/30">
                                    Annuler
                                </Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    </div>
</template>
