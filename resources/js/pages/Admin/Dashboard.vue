<script setup lang="ts">
import AdminLayout from '@/layouts/AdminLayout.vue';
import { Head } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { PlusCircle, List, FileText, Eye, Users } from 'lucide-vue-next';

defineOptions({
    layout: AdminLayout,
});

interface FurMeet {
    id: number;
    title: string;
    date: string;
    is_published: boolean;
}

interface Props {
    totalFurMeets: number;
    publishedFurMeets: number;
    draftFurMeets: number;
    recentFurMeets: FurMeet[];
}

const props = defineProps<Props>();

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};
</script>

<template>
    <div>
        <Head title="Admin - Dashboard" />

        <div class="container mx-auto px-4">
            <!-- Hero Section -->
            <div class="mb-8">
                <h1 class="font-bold text-light-blue text-4xl md:text-5xl mb-2">
                    Tableau de bord <span class="text-blue">Admin</span>
                </h1>
                <p class="text-gray-400">Bienvenue sur l'interface d'administration FurTours</p>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <!-- Total FurMeets -->
                <div class="rounded-lg border border-light-blue/30 bg-gradient-to-br from-light-blue/20 to-blue/10 p-6">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-sm font-medium text-gray-400">Total FurMeets</h3>
                        <FileText class="h-5 w-5 text-light-blue" />
                    </div>
                    <p class="text-4xl font-bold text-white">{{ props.totalFurMeets }}</p>
                </div>

                <!-- Published -->
                <div class="rounded-lg border border-green-500/30 bg-gradient-to-br from-green-500/20 to-green-600/10 p-6">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-sm font-medium text-gray-400">Publiés</h3>
                        <Eye class="h-5 w-5 text-green-400" />
                    </div>
                    <p class="text-4xl font-bold text-white">{{ props.publishedFurMeets }}</p>
                </div>

                <!-- Drafts -->
                <div class="rounded-lg border border-yellow-500/30 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 p-6">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-sm font-medium text-gray-400">Brouillons</h3>
                        <FileText class="h-5 w-5 text-yellow-400" />
                    </div>
                    <p class="text-4xl font-bold text-white">{{ props.draftFurMeets }}</p>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-light-blue mb-4">Actions rapides</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                        as="a"
                        href="/admin/furmeets/create"
                        class="bg-gradient-to-r from-light-blue to-cyan-500 px-6 py-8 font-semibold text-[#2c3e50] hover:from-cyan-300 hover:to-light-blue hover:shadow-lg hover:shadow-light-blue/30 text-lg h-auto"
                    >
                        <PlusCircle class="h-6 w-6 mr-3" />
                        Créer un nouveau FurMeet
                    </Button>

                    <Button
                        as="a"
                        href="/admin/furmeets"
                        variant="outline"
                        class="border-light-blue/30 text-light-blue hover:bg-light-blue/10 px-6 py-8 text-lg h-auto"
                    >
                        <List class="h-6 w-6 mr-3" />
                        Voir tous les FurMeets
                    </Button>

                    <Button
                        as="a"
                        href="/admin/staff"
                        variant="outline"
                        class="border-yellow/30 text-yellow hover:bg-yellow/10 px-6 py-8 text-lg h-auto"
                    >
                        <Users class="h-6 w-6 mr-3" />
                        Gérer le Staff
                    </Button>
                </div>
            </div>

            <!-- Recent FurMeets -->
            <div>
                <h2 class="text-2xl font-bold text-light-blue mb-4">FurMeets récents</h2>
                <div v-if="props.recentFurMeets.length > 0" class="rounded-lg border border-light-blue/30 bg-blue/20 overflow-hidden">
                    <div class="divide-y divide-gray-700">
                        <div
                            v-for="furMeet in props.recentFurMeets"
                            :key="furMeet.id"
                            class="p-4 hover:bg-blue/10 transition-colors"
                        >
                            <div class="flex items-center justify-between">
                                <div class="flex-1">
                                    <h3 class="font-medium text-white mb-1">{{ furMeet.title }}</h3>
                                    <div class="flex items-center gap-3 text-sm text-gray-400">
                                        <span>{{ formatDate(furMeet.date) }}</span>
                                        <span
                                            v-if="furMeet.is_published"
                                            class="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400"
                                        >
                                            Publié
                                        </span>
                                        <span
                                            v-else
                                            class="rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-400"
                                        >
                                            Brouillon
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    as="a"
                                    :href="`/admin/furmeets/${furMeet.id}/edit`"
                                    size="sm"
                                    variant="ghost"
                                    class="text-light-blue hover:bg-light-blue/10"
                                >
                                    Modifier
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="rounded-lg border-2 border-dashed border-gray-700 p-8 text-center">
                    <p class="text-gray-400 mb-4">Aucun FurMeet créé pour le moment</p>
                    <Button
                        as="a"
                        href="/admin/furmeets/create"
                        class="bg-gradient-to-r from-light-blue to-cyan-500 px-6 py-3 font-semibold text-[#2c3e50] hover:from-cyan-300 hover:to-light-blue"
                    >
                        <PlusCircle class="h-5 w-5 mr-2" />
                        Créer le premier FurMeet
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>
