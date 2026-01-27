<script setup lang="ts">
import AdminLayout from '@/layouts/AdminLayout.vue';
import { Head, Link, usePage } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { PlusCircle, CheckCircle } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';
import { getTextFromHtml } from '@/lib/utils';

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
    furMeets: FurMeet[];
}

const props = defineProps<Props>();
const page = usePage();

const currentUser = computed(() => page.props.auth?.user);

const canManageFurmeets = computed(() => {
    if (!currentUser.value) return false;
    // Master can always manage furmeets
    if (currentUser.value.role_level === 'master') return true;
    // Others need the manage_furmeets permission
    return currentUser.value.permissions?.includes('manage_furmeets') ?? false;
});

const successMessage = ref<string | null>(null);

// Récupérer le message flash
watch(
    () => page.props.flash,
    (flash: any) => {
        if (flash?.success) {
            successMessage.value = flash.success;
            setTimeout(() => {
                successMessage.value = null;
            }, 5000);
        }
    },
    { immediate: true, deep: true }
);

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

</script>

<template>
    <div>
        <Head title="Admin - FurMeets" />

        <!-- Message de succès -->
        <div
            v-if="successMessage"
            class="fixed top-30 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/20 px-6 py-4 text-green-400 shadow-lg animate-in fade-in slide-in-from-top-5"
        >
            <CheckCircle class="h-5 w-5" />
            <span class="font-medium">{{ successMessage }}</span>
        </div>

        <!-- Hero Section -->
        <section class="container mx-auto px-4">
            <div class="mx-auto max-w-7xl mb-8">
                <div class="flex items-center justify-between">
                    <h1 class="font-bold text-light-blue text-4xl md:text-5xl">
                        Gestion des <span class="text-blue">FurMeet™</span>
                    </h1>
                    <Button
                        v-if="canManageFurmeets"
                        as="a"
                        href="/admin/furmeets/create"
                        class="bg-gradient-to-r from-light-blue to-cyan-500 px-6 py-3 font-semibold text-[#2c3e50] hover:from-cyan-300 hover:to-light-blue hover:shadow-lg hover:shadow-light-blue/30"
                    >
                        <PlusCircle class="h-5 w-5 mr-2" />
                        Créer un FurMeet
                    </Button>
                </div>
            </div>
        </section>

        <!-- List Section -->
        <section class="container mx-auto px-4">
            <div class="mx-auto max-w-7xl">
                <!-- Table -->
                <div v-if="props.furMeets.length > 0" class="overflow-hidden rounded-lg border border-light-blue/30 bg-blue/20">
                        <table class="w-full">
                            <thead class="bg-[#2c3e50]">
                                <tr>
                                    <th class="px-6 py-4 text-left text-sm font-semibold text-light-blue">ID</th>
                                    <th class="px-6 py-4 text-left text-sm font-semibold text-light-blue">Titre</th>
                                    <th class="px-6 py-4 text-left text-sm font-semibold text-light-blue">Date</th>
                                    <th class="px-6 py-4 text-left text-sm font-semibold text-light-blue">Statut</th>
                                    <th class="px-6 py-4 text-left text-sm font-semibold text-light-blue">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="furMeet in props.furMeets"
                                    :key="furMeet.id"
                                    class="border-t border-gray-700 hover:bg-blue/10 transition-colors"
                                >
                                    <td class="px-6 py-4 text-sm text-gray-300">{{ furMeet.id }}</td>
                                    <td class="px-6 py-4">
                                        <div>
                                            <p class="font-medium text-white">{{ furMeet.title }}</p>
                                            <p class="text-sm text-gray-400 line-clamp-1">{{ getTextFromHtml(furMeet.description).substring(0, 100) }}...</p>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-gray-300">
                                        {{ formatDate(furMeet.date) }}
                                    </td>
                                    <td class="px-6 py-4">
                                        <span
                                            v-if="furMeet.is_published"
                                            class="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400"
                                        >
                                            Publié
                                        </span>
                                        <span
                                            v-else
                                            class="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-medium text-yellow-400"
                                        >
                                            Brouillon
                                        </span>
                                    </td>
                                    <td class="px-6 py-4">
                                        <Button
                                            v-if="canManageFurmeets"
                                            as="a"
                                            :href="`/admin/furmeets/${furMeet.id}/edit`"
                                            size="sm"
                                            class="bg-blue/30 text-light-blue hover:bg-blue/50 border border-light-blue/30"
                                        >
                                            Modifier
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                <!-- Empty State -->
                <div v-else class="rounded-lg border-2 border-dashed border-muted p-12 text-center">
                        <p class="mb-4 text-lg text-muted-foreground">
                            Aucun FurMeet créé pour le moment.
                        </p>
                        <Button
                            v-if="canManageFurmeets"
                            as="a"
                            href="/admin/furmeets/create"
                            class="bg-gradient-to-r from-light-blue to-cyan-500 px-6 py-3 font-semibold text-[#2c3e50] hover:from-cyan-300 hover:to-light-blue"
                        >
                            Créer le premier FurMeet
                        </Button>
                </div>
            </div>
        </section>
    </div>
</template>
