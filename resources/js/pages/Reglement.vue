<script setup lang="ts">
import AppHeaderLayout from '@/layouts/app/AppHeaderLayout.vue';
import { Head } from '@inertiajs/vue3';

interface Reglement {
    title: string;
    content: string;
    updated_at?: string | null;
}

defineOptions({
    layout: AppHeaderLayout,
});

const props = defineProps<{ reglement: Reglement }>();
</script>

<template>
    <div>
        <Head :title="props.reglement?.title ?? 'Règlement intérieur'" />

        <section class="bg-gradient-to-b from-dark to-[#1a2332] py-12">
            <div class="container mx-auto px-4">
                <div class="mx-auto max-w-4xl text-center">
                    <h1 class="text-4xl md:text-5xl font-bold text-light-blue">
                        <span class="text-yellow">{{ props.reglement?.title ?? 'Règlement intérieur' }}</span>
                    </h1>
                    <p v-if="props.reglement?.updated_at" class="mt-3 text-gray-300 text-sm">
                        Dernière mise à jour : {{ props.reglement.updated_at }}
                    </p>
                </div>
            </div>
        </section>

        <section class="bg-dark py-12">
            <div class="container mx-auto px-4">
                <div class="mx-auto max-w-5xl rounded-lg border border-light-blue/30 bg-dark/60 p-8">
                    <div class="formatted-content text-gray-100" v-html="props.reglement?.content"></div>
                </div>
            </div>
        </section>
    </div>
</template>
