<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/vue3';
import { Calendar, ArrowRight } from 'lucide-vue-next';

interface FurMeet {
    id: number;
    title: string;
    date: string;
    description: string;
}

interface Props {
    furMeet: FurMeet;
}

const props = defineProps<Props>();

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

const isUpcoming = (dateString: string) => {
    return new Date(dateString) >= new Date();
};

// Extraire le texte pur de la description HTML en ignorant les iframes
const getTextFromHtml = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    
    // Supprimer toutes les iframes et les divs contenant des cartes Google Maps
    const iframes = div.querySelectorAll('iframe');
    iframes.forEach(iframe => iframe.remove());
    
    const mapDivs = div.querySelectorAll('div[data-google-map]');
    mapDivs.forEach(mapDiv => mapDiv.remove());
    
    return div.textContent || div.innerText || '';
};
</script>

<template>
    <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-light-blue/30 to-blue/10 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-blue/50">
        <!-- Titre avec fond coloré -->
        <div class="bg-gradient-to-br from-light-blue/80 to-blue/80 p-6">
            <h3 class="text-center text-2xl font-bold text-white drop-shadow-lg md:text-3xl">
                {{ furMeet.title }}
            </h3>
        </div>

        <!-- Contenu de la carte -->
        <div class="space-y-4 p-6">
            <!-- Date -->
            <div class="flex items-center gap-2 text-sm text-light-blue">
                <Calendar class="h-4 w-4" />
                <span>{{ formatDate(furMeet.date) }}</span>
            </div>

            <!-- Description -->
            <p class="line-clamp-3 text-sm text-gray-300">
                {{ getTextFromHtml(furMeet.description) }}
            </p>

            <!-- Bouton Lire plus -->
            <Button
                as="a"
                :href="`/furmeets/${furMeet.id}`"
                variant="ghost"
                size="sm"
                class="group/btn w-full text-light-blue hover:bg-blue/20 hover:text-blue"
            >
                Lire plus
                <ArrowRight class="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
        </div>
    </div>
</template>
