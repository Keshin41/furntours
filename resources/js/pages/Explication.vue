<script setup lang="ts">
import AppHeaderLayout from '@/layouts/app/AppHeaderLayout.vue';
import { Head } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';

defineOptions({
    layout: AppHeaderLayout,
});
</script>

<template>
    <div>
        <Head title="C'est quoi un Furry ?" />

        <!-- Hero Section -->
        <section class="bg-gradient-to-b from-dark to-[#1a2332] py-20">
            <div class="container mx-auto px-4">
                <div class="mx-auto max-w-4xl text-center">
                    <h1 class="mb-6 text-5xl font-bold text-light-blue md:text-6xl">
                        Qu'est-ce que le <span class="text-yellow">Furry</span> ?
                    </h1>
                    <p class="text-xl text-gray-300 leading-relaxed">
                        Le Furry est un mouvement culturel qui célèbre l'amour des animaux anthropomorphes, 
                        c'est-à-dire des créatures qui possèdent des caractéristiques humaines et animales. 
                        Les membres de cette communauté, appelés « furries », partagent un intérêt commun 
                        pour l'art, la littérature, la création de personnages et l'expression personnelle 
                        à travers des avatars anthropomorphes.
                    </p>
                </div>
            </div>
        </section>

        <!-- Video Section -->
        <section class="bg-dark py-16">
            <div class="container mx-auto px-4">
                <div class="mx-auto max-w-4xl">
                    <h2 class="mb-6 text-3xl font-bold text-light-blue text-center">
                        Une super vidéo de la part d'Arte pour plus de détails
                    </h2>
                    <div class="aspect-video overflow-hidden rounded-lg border border-light-blue/30 shadow-lg shadow-light-blue/20">
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/wDKs7EGogHU"
                            title="C'est quoi le mouvement du Furry Fandom ?"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                        ></iframe>
                    </div>
                    <p class="mt-4 text-center text-light-blue font-medium">
                        C'est quoi le mouvement du Furry Fandom ?
                    </p>
                </div>
            </div>
        </section>

        <!-- Content Sections -->
        <section class="bg-dark py-16">
            <div class="container mx-auto px-4">
                <div class="mx-auto max-w-4xl space-y-12">
                    <!-- Le Furry Fandom -->
                    <div class="rounded-lg border border-light-blue/30 bg-blue/20 p-8">
                        <h2 class="mb-4 text-3xl font-bold text-light-blue">
                            Le Furry Fandom
                        </h2>
                        <p class="text-gray-300 leading-relaxed text-lg">
                            Le Furry Fandom est une sous-culture née de l'engouement pour les personnages anthropomorphes. 
                            Il englobe diverses formes d'art, de loisirs et de créations, notamment des dessins, des histoires, 
                            des jeux, et bien plus encore. Les furries se rassemblent pour partager leur passion, créant ainsi 
                            une communauté inclusive et créative.
                        </p>
                    </div>

                    <!-- Fursona -->
                    <div class="rounded-lg border border-light-blue/30 bg-blue/20 p-8">
                        <h2 class="mb-4 text-3xl font-bold text-light-blue">
                            C'est quoi un "fursona" ?
                        </h2>
                        <p class="text-gray-300 leading-relaxed text-lg">
                            Un « fursona » est une contraction des mots « furry » et « persona ». Il s'agit d'un avatar 
                            personnel créé par un membre de la communauté furry pour représenter sa propre identité au sein 
                            de cette culture. Les fursonas peuvent être aussi variés que l'imagination le permet, allant des 
                            créatures fantastiques aux animaux réalistes.
                        </p>
                    </div>

                    <!-- Fursuit -->
                    <div class="rounded-lg border border-light-blue/30 bg-blue/20 p-8">
                        <h2 class="mb-4 text-3xl font-bold text-light-blue">
                            C'est quoi une "fursuit" ?
                        </h2>
                        <p class="text-gray-300 leading-relaxed text-lg">
                            Une « fursuit » est une tenue artistique qui représente le fursona d'un individu. Ces costumes 
                            sont souvent portés lors d'événements ou de conventions et sont créés avec une grande attention 
                            aux détails pour refléter fidèlement le caractère du fursona.
                        </p>
                    </div>

                    <!-- Communauté mondiale -->
                    <div class="rounded-lg border border-light-blue/30 bg-blue/20 p-8">
                        <h2 class="mb-4 text-3xl font-bold text-light-blue">
                            Une communauté mondiale
                        </h2>
                        <p class="text-gray-300 leading-relaxed text-lg mb-4">
                            La communauté furry est mondiale et rassemble des personnes partageant les mêmes intérêts à travers 
                            le globe. Des salons et des conventions sont organisés régulièrement, réunissant des passionnés pour 
                            célébrer l'art, la créativité et l'inclusivité.
                        </p>
                        <p class="text-gray-300 leading-relaxed text-lg">
                            Des événements tels que la <span class="font-semibold text-white">Anthrocon</span> aux États-Unis, 
                            <span class="font-semibold text-white">Eurofurence</span> en Europe, et 
                            <span class="font-semibold text-white">ConFuzzled</span> au Royaume-Uni, attirent des milliers de 
                            participants chaque année.
                        </p>
                    </div>

                    <!-- France -->
                    <div class="rounded-lg border border-light-blue/30 bg-blue/20 p-8">
                        <h2 class="mb-4 text-3xl font-bold text-light-blue">
                            Les conventions en France et les associations
                        </h2>
                        <p class="text-gray-300 leading-relaxed text-lg mb-4">
                            En France, la communauté furry est dynamique avec des associations qui offrent une plateforme 
                            d'échange unique. Diverses associations locales comme la 
                            <span class="font-semibold text-white">Normandifurs</span> ou 
                            <span class="font-semibold text-white">nous</span> 🐾 participent à la promotion de la culture 
                            furry en organisant des événements et des rencontres, renforçant ainsi les liens au sein de la 
                            communauté française.
                        </p>
                        <p class="text-gray-300 leading-relaxed text-lg">
                            Nous retrouverons également des conventions spécialisées telle que la 
                            <span class="font-semibold text-white">FBL</span> et la 
                            <span class="font-semibold text-white">Fauntastic</span>.
                        </p>
                    </div>

                    <!-- Call to Action -->
                    <div class="rounded-lg border-2 border-yellow/30 bg-gradient-to-br from-yellow/10 to-light-blue/10 p-8 text-center">
                        <p class="mb-6 text-xl text-gray-200 leading-relaxed">
                            Rejoignez nous dans cette aventure passionnante où l'imagination n'a pas de limites, 
                            et la diversité est célébrée à chaque coin de fourrure ! 🐺🎨
                        </p>
                        <Button
                            as="a"
                            href="https://www.helloasso.com/associations/fur-n-tours"
                            target="_blank"
                            size="lg"
                            class="bg-gradient-to-r from-light-blue to-cyan-500 px-8 py-6 text-lg font-semibold text-[#2c3e50] hover:from-cyan-300 hover:to-light-blue hover:shadow-lg hover:shadow-light-blue/30"
                        >
                            Adhérer à notre association
                        </Button>
                    </div>

                    <!-- Credits -->
                    <div class="border-t border-light-blue/20 pt-8 text-center">
                        <p class="text-sm text-gray-400 mb-2">
                            Cette page est inspirée de celle de la 
                            <a 
                                href="https://normandifurs.fr" 
                                target="_blank"
                                class="text-light-blue hover:text-cyan-300 underline"
                            >
                                Normandifurs
                            </a> 
                            (pour la mise en page et les chapitres).
                        </p>
                        <p class="text-sm text-gray-400">
                            Pour le reste, chatGPT a été utilisé pour en faire la mise en page et structurer le contenu.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>