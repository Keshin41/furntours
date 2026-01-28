<script setup lang="ts">
import AppHeaderLayout from '@/layouts/app/AppHeaderLayout.vue';
import FurMeetCard from '@/components/FurMeetCard.vue';
import { Button } from '@/components/ui/button';
import { Head } from '@inertiajs/vue3';
import { ChevronDown } from 'lucide-vue-next';
import { getSocialIcon } from '@/lib/utils';
import { computed } from 'vue';

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
}

interface Statistic {
    telegram_members: number;
    association_members: number;
    furmeets_count: number;
    hero_video_url: string;
}

interface Staff {
    id: number;
    name: string;
    role: string;
    photo: string | null;
    social_links: Array<{ platform: string; url: string }> | null;
    order: number;
}

interface Props {
    furMeets: FurMeet[];
    statistics: Statistic;
    staff: Staff[];
}

const props = defineProps<Props>();

const scrollToContent = () => {
    window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
    });
};

const nextFurMeet = computed(() => {
    const upcomingMeets = props.furMeets
        .map(furMeet => ({
            ...furMeet,
            dateObj: new Date(furMeet.date)
        }))
        .filter(furMeet => furMeet.dateObj >= new Date())
        .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
    
    return upcomingMeets.length > 0 ? upcomingMeets[0] : null;
});

</script>

<template>
        <Head title="Accueil" />

        <!-- Hero Section avec vidéo en background -->
        <section class="relative h-screen w-full overflow-hidden">
            <!-- Vidéo en arrière-plan -->
            <video
                autoplay
                loop
                muted
                playsinline
                class="absolute inset-0 h-full w-full object-cover"
            >
                <source :src="props.statistics.hero_video_url" type="video/webm" />
                Votre navigateur ne supporte pas la vidéo.
            </video>

            <!-- Overlay sombre pour améliorer la lisibilité -->
            <div class="absolute inset-0 bg-black/40"></div>

            <!-- Contenu -->
            <div class="mt-32 relative z-10 flex h-full flex-col items-center px-4 text-white">
                <!-- Titre principal -->
                <h1 class="mb-2 text-center text-5xl font-bold md:text-6xl lg:text-7xl">
                    Fur N'Tours
                </h1>

                <!-- Sous-titre -->
                <p class="mb-12 text-center text-lg md:text-xl lg:text-2xl">
                    {{ nextFurMeet ? "Prochaine Fur'Meet le " +nextFurMeet.date : 'Prochaine fur\'Meet à venir bientôt' }}
                </p>

                <!-- Boutons -->
                <div class="mb-16 flex flex-col gap-4 sm:flex-row">
                    <Button
                        as="a"
                        href="https://t.me/furntours"
                        target="_blank"
                        size="lg"
                        class="bg-transparent border-2 border-light-blue hover:bg-light-blue/20 text-white px-6 py-6 text-xl font-[600] [&_svg]:!size-7"
                    >
                        <svg fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                        </svg>
                        TELEGRAM
                    </Button>

                    <Button
                        as="a"
                        href="/boutique"
                        size="lg"
                        class=" bg-transparent border-2 border-yellow text-white hover:bg-yellow/20 px-8 py-6 text-lg font-[600]"
                    >
                        BOUTIQUE
                    </Button>
                </div>

                <!-- Scroll indicator -->
                <button
                    @click="scrollToContent"
                    class="animate-bounce cursor-pointer"
                >
                    <div class="flex flex-col items-center gap-2 text-sm">
                        <span>Scroller pour plus d'info</span>
                        <ChevronDown class="h-6 w-6" />
                    </div>
                </button>

                <!-- Crédit vidéo -->
                <div class="right-4 mt-25 text-xl text-light-blue opacity-70">
                    La vidéo est de <a href="https://www.youtube.com/@Alriou" class="underline hover:opacity-100 text-blue">@ARIOIJ</a>
                </div>
            </div>
        </section>

        <!-- Section FurMeets -->
        <section class="bg-dark py-20">
            <div class="container mx-auto px-4">
                <!-- Titre de la section -->
                <div class="mb-12 text-center">
                    <h2 class="mb-4 text-4xl font-bold md:text-5xl">
                        Nos <span class="text-blue">FurMeet™</span> passés et à venir
                    </h2>
                    <p class="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Si vous avez un furbar et que vous voulez un {ville}.furbar.fr, vous pouvez DM 
                        <a href="https://t.me/pandarch" target="_blank" class="text-blue hover:underline">@pandarch</a>
                    </p>
                    <p class="mt-2 text-sm text-muted-foreground">
                        Pour voir les archives c'est par 
                        <a href="furmeets" class="text-blue hover:underline">ici</a>
                    </p>
                </div>

                <!-- Grille de FurMeets -->
                <div v-if="props.furMeets.length > 0" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <FurMeetCard
                        v-for="furMeet in props.furMeets"
                        :key="furMeet.id"
                        :fur-meet="furMeet"
                    />
                </div>

                <!-- Message si aucun FurMeet -->
                <div v-else class="rounded-lg border-2 border-dashed border-muted p-12 text-center">
                    <p class="text-lg text-muted-foreground">
                        Aucun FurMeet pour le moment. Revenez bientôt !
                    </p>
                </div>
            </div>
        </section>

         <!-- Section Statistiques -->
        <section class="relative bg-dark py-20">
            <div class="container mx-auto px-4">
                <div class="mx-auto max-w-6xl">
                    <h2 class="mb-4 text-center text-4xl font-bold text-light-blue md:text-5xl">
                        Fur N'Tours, en chiffre
                    </h2>
                    <p class="mb-16 text-center text-lg text-gray-400">Rejoignez notre communauté grandissante</p>
                    
                    <div class="grid gap-8 md:grid-cols-3">
                        <!-- Stat 1: Membres -->
                        <div class="group relative overflow-hidden rounded-lg shadow-xl shadow-blue/20 bg-[#ffffff0d] hover:translate-y-[-2px] hover:shadow-yellow/20  transition-all duration-300">
                            <!-- Barre cyan en haut -->
                            <div class="h-1 w-full bg-light-blue"></div>
                            
                            <div class="p-8 text-center">
                                <p class="mb-2 text-sm font-semibold uppercase tracking-wider text-light-blue">
                                    Membres
                                </p>
                                <p class="text-4xl font-bold text-light-blue md:text-5xl">
                                    {{ props.statistics.telegram_members.toLocaleString() }}
                                </p>
                            </div>
                        </div>
                        <!-- Stat 2: Adhérents -->
                        <div class="group relative overflow-hidden rounded-lg shadow-xl shadow-blue/20 bg-[#ffffff0d] hover:translate-y-[-2px] hover:shadow-yellow/20  transition-all duration-300">
                            <!-- Barre cyan en haut -->
                            <div class="h-1 w-full bg-light-blue"></div>
                            
                            <div class="p-8 text-center">
                                <p class="mb-2 text-sm font-semibold uppercase tracking-wider text-light-blue">
                                    Adhérents
                                </p>
                                <p class="text-4xl font-bold text-light-blue md:text-5xl">
                                    {{ props.statistics.association_members }}
                                </p>
                            </div>
                        </div>

                        <!-- Stat 3: FurMeets -->
                        <div class="group relative overflow-hidden rounded-lg shadow-xl shadow-blue/20 bg-[#ffffff0d] hover:translate-y-[-2px] hover:shadow-yellow/20  transition-all duration-300">
                            <!-- Barre cyan en haut -->
                            <div class="h-1 w-full bg-light-blue"></div>
                            
                            <div class="p-8 text-center">
                                <p class="mb-2 text-sm font-semibold uppercase tracking-wider text-light-blue">
                                    Furmeet
                                </p>
                                <p class="text-4xl font-bold text-light-blue md:text-5xl">
                                    {{ props.statistics.furmeets_count }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Section Contact -->
        <section class="relative bg-dark py-20">
            <div class="container mx-auto px-4">
                <div class="mx-auto max-w-6xl">
                    <h2 class="mb-16 text-center text-4xl font-bold text-light-blue md:text-5xl">
                        Nous Contacter
                    </h2>
                    
                    <div class="grid gap-8 md:grid-cols-2">
                        <!-- Colonne de gauche - Informations de contact -->
                        <div class="space-y-6">
                            <!-- Email -->
                            <div class="group relative overflow-hidden rounded-lg border border-light-blue/30 bg-blue/20 p-6 transition-all duration-300 hover:border-light-blue/50 hover:shadow-lg hover:shadow-light-blue/20">
                                <div class="flex items-center gap-4">
                                    <div class="rounded-full bg-light-blue/10 p-3">
                                        <svg class="h-6 w-6 text-light-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <a href="mailto:contact@furntours.fr" class="text-lg text-light-blue hover:text-cyan-300">
                                            contact@furntours.fr
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <!-- Téléphone -->
                            <div class="group relative overflow-hidden rounded-lg border border-light-blue/30 bg-blue/20 p-6 transition-all duration-300 hover:border-light-blue/50 hover:shadow-lg hover:shadow-light-blue/20">
                                <div class="flex items-center gap-4">
                                    <div class="rounded-full bg-light-blue/10 p-3">
                                        <svg class="h-6 w-6 text-light-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <a href="tel:+33123456789" class="text-lg text-light-blue hover:text-cyan-300">
                                            +33 1 23 45 67 89
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <!-- Adresse -->
                            <div class="group relative overflow-hidden rounded-lg border border-light-blue/30 bg-blue/20 p-6 transition-all duration-300 hover:border-light-blue/50 hover:shadow-lg hover:shadow-light-blue/20">
                                <div class="flex items-center gap-4">
                                    <div class="rounded-full bg-light-blue/10 p-3">
                                        <svg class="h-6 w-6 text-light-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="text-lg text-light-blue">
                                            123 Rue de l'Aventure, 75000 Paris
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Colonne de droite - Formulaire -->
                        <div class="relative overflow-hidden rounded-lg border border-light-blue/30 bg-blue/20 p-8">
                            <form class="space-y-4">
                                <!-- Nom -->
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Votre nom"
                                        class="w-full rounded-lg border border-light-blue/20 bg-[#2c3e50] px-4 py-3 text-white placeholder-gray-400 transition-all focus:border-light-blue/50 focus:outline-none focus:ring-2 focus:ring-light-blue/20"
                                    />
                                </div>

                                <!-- Email -->
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Votre email"
                                        class="w-full rounded-lg border border-light-blue/20 bg-[#2c3e50] px-4 py-3 text-white placeholder-gray-400 transition-all focus:border-light-blue/50 focus:outline-none focus:ring-2 focus:ring-light-blue/20"
                                    />
                                </div>

                                <!-- Message -->
                                <div>
                                    <textarea
                                        placeholder="Votre message"
                                        rows="6"
                                        class="w-full rounded-lg border border-light-blue/20 bg-[#2c3e50] px-4 py-3 text-white placeholder-gray-400 transition-all focus:border-light-blue/50 focus:outline-none focus:ring-2 focus:ring-light-blue/20"
                                    ></textarea>
                                </div>

                                <!-- Bouton -->
                                <button
                                    type="submit"
                                    class="w-full rounded-lg bg-gradient-to-r from-light-blue to-cyan-500 px-6 py-3 font-semibold text-[#2c3e50] transition-all hover:from-cyan-300 hover:to-light-blue hover:shadow-lg hover:shadow-light-blue/30"
                                >
                                    Envoyer
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Section Staff -->
        <section class="relative bg-gradient-to-br from-[#2c3e50] to-[#34495e] py-10">
            <div class="container mx-auto px-4">
                <div class="mx-auto max-w-6xl">
                    <h2 class="mb-8 text-center text-4xl font-bold text-cyan-400 md:text-5xl">
                        Le staff
                    </h2>
                    
                    <!-- Grille de staff members -->
                    <div class="flex flex-wrap justify-center gap-8 md:gap-12">
                        <div
                            v-for="member in props.staff"
                            :key="member.id"
                            class="group relative overflow-hidden rounded-4xl border border-cyan-400/30 bg-[#2c4a5c] p-6 w-[20rem] text-center transition-all duration-300 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-400/20"
                        >
                            <!-- Avatar -->
                            <div class="mb-3 flex justify-center">
                                <div class="relative h-32 w-32 overflow-hidden rounded-full border-4 border-cyan-400/30 transition-all duration-300 group-hover:border-cyan-400/50">
                                    <img
                                        v-if="member.photo"
                                        :src="`/storage/${member.photo}`"
                                        :alt="member.name"
                                        class="h-full w-full object-cover"
                                    />
                                    <div
                                        v-else
                                        class="h-full w-full bg-gradient-to-br from-[#2c3e50] to-[#34495e] flex items-center justify-center text-4xl text-cyan-400 font-bold"
                                    >
                                        {{ member.name.charAt(0).toUpperCase() }}
                                    </div>
                                </div>
                            </div>

                            <!-- Nom -->
                            <h3 class="text-3xl font-bold text-cyan-400">{{ member.name }}</h3>
                            
                            <!-- Rôle -->
                            <p class="mb-2 text-xl text-gray-300">{{ member.role }}</p>

                            <!-- Réseaux sociaux -->
                            <div v-if="member.social_links && member.social_links.length > 0" class="flex justify-center gap-3">
                                <a
                                    v-for="(link, index) in member.social_links"
                                    :key="index"
                                    :href="link.url"
                                    target="_blank"
                                    :title="link.platform"
                                    class="rounded-full bg-white/10 p-2 text-gray-300 transition-all hover:bg-cyan-400/20 hover:text-cyan-400"
                                    v-html="getSocialIcon(link.platform)"
                                >
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
</template>