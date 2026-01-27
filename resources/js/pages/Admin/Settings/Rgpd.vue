<script setup lang="ts">
import AdminLayout from '@/layouts/AdminLayout.vue';
import RichTextEditor from '@/components/RichTextEditor.vue';
import { Head, useForm, usePage } from '@inertiajs/vue3';
import { watch, computed } from 'vue';
import { Button } from '@/components/ui/button';
import { useNotification } from '@/composables/useNotification';
import NotificationContainer from '@/components/NotificationContainer.vue';

defineOptions({
    layout: AdminLayout,
});

interface Rgpd {
    title: string;
    content: string;
    updated_at?: string | null;
}

const props = defineProps<{ rgpd: Rgpd }>();
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

const form = useForm({
    title: props.rgpd?.title ?? 'Politique de Confidentialité (RGPD)',
    content: props.rgpd?.content ?? '',
});

const lastUpdated = computed(() => props.rgpd?.updated_at ?? null);

const submit = () => {
    form.put('/admin/settings/rgpd', {
        preserveScroll: true,
    });
};
</script>

<template>
    <div>
        <Head title="Politique de Confidentialité (RGPD)" />

        <NotificationContainer />

        <section class="container mx-auto px-4 py-8">
            <div class="mx-auto max-w-5xl">
                <div class="mb-6">
                    <h1 class="text-3xl md:text-4xl font-bold text-light-blue">Politique de Confidentialité (RGPD)</h1>
                    <p class="text-gray-300 mt-2">
                        Rédigez ou mettez à jour la politique RGPD en utilisant l'éditeur riche. Le contenu est affiché tel quel sur le site public.
                    </p>
                    <p v-if="lastUpdated" class="text-sm text-gray-400 mt-1">
                        Dernière mise à jour : {{ lastUpdated }}
                    </p>
                </div>

                <div class="grid gap-6 lg:grid-cols-2">
                    <div class="space-y-4">
                        <div>
                            <label for="title" class="mb-2 block text-sm font-medium text-gray-200">Titre</label>
                            <input
                                id="title"
                                v-model="form.title"
                                type="text"
                                class="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white focus:border-light-blue focus:outline-none focus:ring-2 focus:ring-light-blue/50"
                            />
                            <div v-if="form.errors.title" class="mt-1 text-sm text-red-400">{{ form.errors.title }}</div>
                        </div>

                        <div>
                            <label class="mb-2 block text-sm font-medium text-gray-200">Contenu</label>
                            <RichTextEditor v-model="form.content" />
                            <div v-if="form.errors.content" class="mt-1 text-sm text-red-400">{{ form.errors.content }}</div>
                        </div>

                        <div class="flex gap-3">
                            <Button
                                type="button"
                                :disabled="form.processing"
                                class="bg-gradient-to-r from-light-blue to-cyan-500 px-6 py-3 font-semibold text-[#2c3e50] hover:from-cyan-300 hover:to-light-blue hover:shadow-lg hover:shadow-light-blue/30"
                                @click="submit"
                            >
                                {{ form.processing ? 'Enregistrement...' : 'Enregistrer la politique RGPD' }}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                class="border-gray-600 text-gray-200 hover:bg-gray-700"
                                @click="form.reset('title', 'content')"
                            >
                                Réinitialiser les champs
                            </Button>
                        </div>

                        <div
                            v-if="page.props.flash?.success"
                            class="rounded-lg border border-green-500/50 bg-green-500/10 px-4 py-3 text-green-300"
                        >
                            {{ page.props.flash.success }}
                        </div>
                    </div>

                    <div class="rounded-lg border border-light-blue/30 bg-dark/60 p-4">
                        <h2 class="mb-3 text-lg font-semibold text-light-blue">Aperçu public</h2>
                        <div class="formatted-content max-w-none text-gray-100" v-html="form.content"></div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
