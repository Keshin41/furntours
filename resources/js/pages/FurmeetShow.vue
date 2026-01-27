<script setup lang="ts">
import AppHeaderLayout from '@/layouts/app/AppHeaderLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

defineOptions({
    layout: AppHeaderLayout,
});

interface FurMeet {
    id: number;
    title: string;
    date: string;
    description: string;
    category: string | null;
    image_url: string | null;
    is_published: boolean;
}

interface Props {
    furMeet: FurMeet;
    previousFurMeet: FurMeet | null;
    nextFurMeet: FurMeet | null;
}

const props = defineProps<Props>();

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const isUpcoming = (dateString: string) => {
    return new Date(dateString) >= new Date();
};
</script>

<template>
    <div>
        <Head :title="props.furMeet.title" />

        <!-- Hero Section avec image -->
        <section class="relative h-[60vh] w-full overflow-hidden">
            <!-- Image de fond -->
            <div 
                v-if="props.furMeet.image_url"
                :style="{ backgroundImage: `url(${props.furMeet.image_url})` }"
                class="absolute inset-0 bg-cover bg-center"
            ></div>
            <div 
                v-else
                class="absolute inset-0 bg-gradient-to-br from-[#2c3e50] to-[#34495e]"
            ></div>

            <!-- Overlay sombre -->
            <div class="absolute inset-0 bg-black/60"></div>

            <!-- Contenu -->
            <div class="relative z-10 flex h-full flex-col items-center justify-center px-4 text-white">
                <!-- Titre -->
                <h1 class="mb-6 text-center text-4xl font-bold md:text-5xl lg:text-6xl">
                    {{ props.furMeet.title }}
                </h1>

                <!-- Badge à venir/passé -->
                <div class="mt-4">
                    <span 
                        v-if="isUpcoming(props.furMeet.date)"
                        class="rounded-full bg-green-500/20 px-4 py-2 text-sm font-semibold text-green-400 border border-green-500/30"
                    >
                        À venir
                    </span>
                    <span 
                        v-else
                        class="rounded-full bg-gray-500/20 px-4 py-2 text-sm font-semibold text-gray-400 border border-gray-500/30"
                    >
                        Événement passé
                    </span>
                </div>
            </div>
        </section>

        <!-- Section Description -->
        <section class="bg-dark py-20">
            <div class="container mx-auto px-4">
                <div class="mx-auto max-w-6xl">
                    <!-- Description principale -->
                    <div class="mb-12 rounded-lg border border-light-blue/30 bg-blue/20 p-8">
                        <h2 class="mb-6 text-3xl font-bold text-light-blue">
                            À propos de cet événement
                        </h2>
                        <div 
                            class="prose prose-invert max-w-none 
                                   [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:text-light-blue [&_h1]:mb-6 [&_h1]:mt-8
                                   [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-light-blue [&_h2]:mb-4 [&_h2]:mt-6
                                   [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-light-blue [&_h3]:mb-3 [&_h3]:mt-5
                                   [&_p]:text-gray-300 [&_p]:mb-4 [&_p]:leading-relaxed
                                   [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:text-gray-300
                                   [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:text-gray-300
                                   [&_li]:mb-2
                                   [&_strong]:text-white [&_strong]:font-semibold
                                   [&_em]:text-gray-200 [&_em]:italic
                                   [&_a]:text-light-blue [&_a]:underline [&_a]:hover:text-cyan-300
                                   [&_span[style*='color']]:inline [&_span[style*='font-size']]:inline
                                   [&_div[data-google-map]]:my-6 [&_div[data-google-map]]:aspect-video 
                                   [&_div[data-google-map]]:overflow-hidden [&_div[data-google-map]]:rounded-lg 
                                   [&_div[data-google-map]]:border [&_div[data-google-map]]:border-light-blue/30 
                                   [&_div[data-google-map]_iframe]:h-full [&_div[data-google-map]_iframe]:w-full" 
                            v-html="props.furMeet.description"
                        ></div>
                    </div>

                    <!-- Navigation entre les FurMeets -->
                    <div class="mb-12 flex items-center justify-between gap-4">
                        <Link
                            v-if="props.nextFurMeet"
                            :href="`/furmeets/${props.nextFurMeet.id}`"
                            class="flex items-center gap-2 rounded-lg border-2 border-light-blue bg-transparent px-6 py-3 text-white transition-colors hover:bg-light-blue/20"
                        >
                            <ChevronLeft class="h-5 w-5" />
                            <span>Suivant</span>
                        </Link>
                        <div v-else class="w-32"></div>

                        <Link
                            v-if="props.previousFurMeet"
                            :href="`/furmeets/${props.previousFurMeet.id}`"
                            class="flex items-center gap-2 rounded-lg border-2 border-light-blue bg-transparent px-6 py-3 text-white transition-colors hover:bg-light-blue/20"
                        >
                            <span>Précédent</span>
                            <ChevronRight class="h-5 w-5" />
                        </Link>
                        <div v-else class="w-32"></div>
                    </div>

                    <!-- Boutons d'action -->
                    <div class="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Button
                            as="a"
                            href="https://t.me/furntours"
                            target="_blank"
                            size="lg"
                            class="bg-transparent border-2 border-light-blue hover:bg-light-blue/20 text-white px-8 py-6 text-lg font-[600]"
                        >
                            Rejoindre sur Telegram
                        </Button>

                        <Button
                            as="a"
                            href="/furmeets"
                            size="lg"
                            class="bg-transparent border-2 border-yellow text-white hover:bg-yellow/20 px-8 py-6 text-lg font-[600]"
                        >
                            Voir tous les FurMeets
                        </Button>
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>
