<script setup lang="ts">
import AppHeaderLayout from '@/layouts/app/AppHeaderLayout.vue';
import { Head } from '@inertiajs/vue3';

interface Rgpd {
    title: string;
    content: string;
    updated_at?: string | null;
}

defineOptions({
    layout: AppHeaderLayout,
});

const props = defineProps<{ rgpd: Rgpd }>();
</script>

<style scoped>
.rgpd-content :deep(h1) {
    font-size: 2.25rem;
    line-height: 2.5rem;
    font-weight: bold;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: #67e8f9;
}

.rgpd-content :deep(h1:first-child) {
    margin-top: 0;
}

.rgpd-content :deep(h2) {
    font-size: 1.875rem;
    line-height: 2.25rem;
    font-weight: bold;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: #67e8f9;
}

.rgpd-content :deep(h2:first-child) {
    margin-top: 0;
}

.rgpd-content :deep(h3) {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: bold;
    margin-top: 1.25rem;
    margin-bottom: 0.625rem;
    color: #67e8f9;
}

.rgpd-content :deep(h3:first-child) {
    margin-top: 0;
}

.rgpd-content :deep(p) {
    margin-bottom: 1rem;
    line-height: 1.75;
}

.rgpd-content :deep(p:last-child) {
    margin-bottom: 0;
}

.rgpd-content :deep(ul),
.rgpd-content :deep(ol) {
    padding-left: 1.5rem;
    margin-top: 0.75rem;
    margin-bottom: 1rem;
}

.rgpd-content :deep(ul) {
    list-style-type: disc;
}

.rgpd-content :deep(ol) {
    list-style-type: decimal;
}

.rgpd-content :deep(li) {
    margin-bottom: 0.5rem;
}

.rgpd-content :deep(a) {
    color: #67e8f9;
    text-decoration: underline;
}

.rgpd-content :deep(a:hover) {
    color: #22d3ee;
}

.rgpd-content :deep(strong) {
    font-weight: 700;
}
</style>

<template>
    <div>
        <Head :title="props.rgpd?.title ?? 'RGPD'" />

        <section class="bg-gradient-to-b from-dark to-[#1a2332] py-12">
            <div class="container mx-auto px-4">
                <div class="mx-auto max-w-4xl text-center">
                    <h1 class="text-4xl md:text-5xl font-bold text-light-blue">
                        <span class="text-yellow">{{ props.rgpd?.title ?? 'Politique de Confidentialité (RGPD)' }}</span>
                    </h1>
                    <p v-if="props.rgpd?.updated_at" class="mt-3 text-gray-300 text-sm">
                        Dernière mise à jour : {{ props.rgpd.updated_at }}
                    </p>
                </div>
            </div>
        </section>

        <section class="bg-dark py-12">
            <div class="container mx-auto px-4">
                <div class="mx-auto max-w-5xl rounded-lg border border-light-blue/30 bg-dark/60 p-8">
                    <div class="rgpd-content prose prose-invert max-w-none text-gray-100" v-html="props.rgpd?.content"></div>
                </div>
            </div>
        </section>
    </div>
</template>
