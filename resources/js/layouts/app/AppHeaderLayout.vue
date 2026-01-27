<script setup lang="ts">
import AppContent from '@/components/AppContent.vue';
import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';
import AppShell from '@/components/AppShell.vue';
import { useKonamiCode } from '@/composables/useKonamiCode';
import type { BreadcrumbItemType } from '@/types';

interface Props {
    breadcrumbs?: BreadcrumbItemType[];
}

withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});

// Activer le code Konami sur toutes les pages
useKonamiCode();
</script>

<template>
    <AppShell variant="header" class="flex min-h-screen flex-col overflow-visible">
        <AppHeader :breadcrumbs="breadcrumbs" />
        <AppContent class="flex-1">
            <slot />
        </AppContent>
        <AppFooter />
    </AppShell>
</template>
