<script setup lang="ts">
import AdminLayout from '@/layouts/AdminLayout.vue';
import { Head, Link, usePage } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { FileText, Shield, Scale, BookOpen, Users, Activity, CheckCircle, AlertCircle } from 'lucide-vue-next';
import { computed } from 'vue';

defineOptions({
    layout: AdminLayout,
});

interface SettingCard {
    title: string;
    description: string;
    icon: any;
    href: string;
    color: string;
}

const page = usePage();
const flashMessage = computed(() => page.props.flash as { success?: string; error?: string } | null);

const settings: SettingCard[] = [
    {
        title: 'Statuts de l\'association',
        description: 'Gérer et modifier les statuts officiels de l\'association',
        icon: FileText,
        href: '/admin/settings/status',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        title: 'Règlement intérieur',
        description: 'Éditer le règlement intérieur de l\'association',
        icon: BookOpen,
        href: '/admin/settings/reglement',
        color: 'from-purple-500 to-pink-500'
    },
    {
        title: 'RGPD',
        description: 'Politique de confidentialité et protection des données',
        icon: Shield,
        href: '/admin/settings/rgpd',
        color: 'from-green-500 to-emerald-500'
    },
    {
        title: 'CGU',
        description: 'Conditions générales d\'utilisation du site',
        icon: Scale,
        href: '/admin/settings/cgu',
        color: 'from-orange-500 to-red-500'
    },
    {
        title: 'Membres & Adhérents',
        description: 'Gérer les informations sur les membres et adhérents',
        icon: Users,
        href: '/admin/members',
        color: 'from-indigo-500 to-blue-500'
    },
    {
        title: 'Statistiques',
        description: 'Configuration des statistiques de l\'association',
        icon: Activity,
        href: '/admin/statistics',
        color: 'from-yellow-500 to-amber-500'
    }
];
</script>

<template>
    <div>
        <Head title="Admin - Paramètres" />

        <!-- Flash Messages -->
        <div v-if="flashMessage?.success" class="fixed top-20 left-1/2 -translate-x-1/2 z-50">
            <div class="flex items-center gap-3 rounded-lg border border-green-500/50 bg-green-500/10 px-6 py-3 text-green-300 shadow-lg shadow-green-500/20">
                <CheckCircle class="h-5 w-5 flex-shrink-0" />
                <p>{{ flashMessage.success }}</p>
            </div>
        </div>

        <div v-if="flashMessage?.error" class="fixed top-20 left-1/2 -translate-x-1/2 z-50">
            <div class="flex items-center gap-3 rounded-lg border border-red-500/50 bg-red-500/10 px-6 py-3 text-red-300 shadow-lg shadow-red-500/20">
                <AlertCircle class="h-5 w-5 flex-shrink-0" />
                <p>{{ flashMessage.error }}</p>
            </div>
        </div>

        <!-- Hero Section -->
        <section class="container mx-auto px-4 mb-8">
            <div class="mx-auto max-w-7xl">
                <h1 class="font-bold text-light-blue text-4xl md:text-5xl mb-4">
                    Paramètres <span class="text-blue">& Configuration</span>
                </h1>
                <p class="text-gray-300 text-lg">
                    Gérez les documents légaux, les membres et les statistiques de l'association
                </p>
            </div>
        </section>

        <!-- Settings Grid -->
        <section class="container mx-auto px-4">
            <div class="mx-auto max-w-7xl">
                <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Link
                        v-for="setting in settings"
                        :key="setting.href"
                        :href="setting.href"
                        class="group relative overflow-hidden rounded-lg border border-light-blue/30 bg-gradient-to-br from-blue/20 to-blue/10 p-6 transition-all hover:border-light-blue/60 hover:shadow-xl hover:shadow-light-blue/20"
                    >
                        <!-- Gradient Overlay on Hover -->
                        <div 
                            class="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-10"
                            :class="`bg-gradient-to-br ${setting.color}`"
                        ></div>

                        <!-- Icon -->
                        <div class="relative mb-4">
                            <div 
                                class="inline-flex items-center justify-center rounded-lg p-3 bg-gradient-to-br"
                                :class="setting.color"
                            >
                                <component :is="setting.icon" class="h-6 w-6 text-white" />
                            </div>
                        </div>

                        <!-- Content -->
                        <div class="relative">
                            <h3 class="text-xl font-bold text-light-blue mb-2 group-hover:text-white transition-colors">
                                {{ setting.title }}
                            </h3>
                            <p class="text-gray-400 text-sm leading-relaxed">
                                {{ setting.description }}
                            </p>
                        </div>

                        <!-- Arrow Icon -->
                        <div class="absolute top-6 right-6 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
                            <svg class="h-5 w-5 text-light-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    </div>
</template>
