<script setup lang="ts">
import AppHeaderLayout from '@/layouts/app/AppHeaderLayout.vue';
import FurMeetCard from '@/components/FurMeetCard.vue';
import { Head } from '@inertiajs/vue3';

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

interface Props {
    furMeets: FurMeet[];
}

const props = defineProps<Props>();
</script>

<template>
    <div>
        <Head title="FurMeets" />

        <!-- Hero Section -->
        <section class="relative bg-gradient-to-br from-[#2c3e50] to-[#34495e] pt-20 pb-10">
            <div class="container mx-auto px-4">
                <div class="mx-auto max-w-4xl text-center">
                    <h1 class="mb-6 text-5xl font-bold text-light-blue md:text-6xl">
                        Tous nos <span class="text-blue">FurMeet™</span>
                    </h1>
                    <p class="text-xl text-gray-300 md:text-2xl">
                        Découvrez tous nos événements passés et à venir
                    </p>
                    <!-- Information -->
                    <div class="text-center">
                        <p class="mx-auto max-w-2xl text-lg text-muted-foreground">
                            Si vous avez un furbar et que vous voulez un {ville}.furbar.fr, vous pouvez DM 
                            <a href="https://t.me/pandarch" target="_blank" class="text-blue hover:underline">@pandarch</a>
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Section FurMeets -->
        <section class="bg-dark py-20">
            <div class="container mx-auto px-4">

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
    </div>
</template>