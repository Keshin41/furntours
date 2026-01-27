<script setup lang="ts">
import AppHeaderLayout from '@/layouts/app/AppHeaderLayout.vue';
import { Head } from '@inertiajs/vue3';

interface Cgu {
    title: string;
    content: string;
    updated_at?: string | null;
}

defineOptions({
    layout: AppHeaderLayout,
});

const props = defineProps<{ cgu: Cgu }>();
</script>

<style scoped>
.cgu-content :deep(h1) {
    font-size: 2.25rem;
    line-height: 2.5rem;
    font-weight: bold;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: #67e8f9;
}

.cgu-content :deep(h1:first-child) {
    margin-top: 0;
}

.cgu-content :deep(h2) {
    font-size: 1.875rem;
    line-height: 2.25rem;
    font-weight: bold;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: #67e8f9;
}

.cgu-content :deep(h2:first-child) {
    margin-top: 0;
}

.cgu-content :deep(h3) {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: bold;
    margin-top: 1.25rem;
    margin-bottom: 0.625rem;
    color: #67e8f9;
}

.cgu-content :deep(h3:first-child) {
    margin-top: 0;
}

.cgu-content :deep(p) {
    margin-bottom: 1rem;
    line-height: 1.75;
}

.cgu-content :deep(p:last-child) {
    margin-bottom: 0;
}

.cgu-content :deep(ul),
.cgu-content :deep(ol) {
    padding-left: 1.5rem;
    margin-top: 0.75rem;
    margin-bottom: 1rem;
}

.cgu-content :deep(ul) {
    list-style-type: disc;
}

.cgu-content :deep(ol) {
    list-style-type: decimal;
}

.cgu-content :deep(li) {
    margin-bottom: 0.5rem;
}

.cgu-content :deep(a) {
    color: #67e8f9;
    text-decoration: underline;
}

.cgu-content :deep(a:hover) {
    color: #22d3ee;
}

.cgu-content :deep(strong) {
    font-weight: 700;
}
</style>

<template>
    <div>
        <Head :title="props.cgu?.title ?? 'CGU'" />

        <section class="bg-gradient-to-b from-dark to-[#1a2332] py-12">
            <div class="container mx-auto px-4">
                <div class="mx-auto max-w-4xl text-center">
                    <h1 class="text-4xl md:text-5xl font-bold text-light-blue">
                        <span class="text-yellow">{{ props.cgu?.title ?? 'Conditions Générales d\'Utilisation' }}</span>
                    </h1>
                    <p v-if="props.cgu?.updated_at" class="mt-3 text-gray-300 text-sm">
                        Dernière mise à jour : {{ props.cgu.updated_at }}
                    </p>
                </div>
            </div>
        </section>

        <section class="bg-dark py-12">
            <div class="container mx-auto px-4">
                <div class="mx-auto max-w-5xl rounded-lg border border-light-blue/30 bg-dark/60 p-8">
                    <div class="cgu-content prose prose-invert max-w-none text-gray-100" v-html="props.cgu?.content"></div>
                </div>
            </div>
        </section>
    </div>
</template>
