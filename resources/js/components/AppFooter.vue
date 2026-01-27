<script setup lang="ts">
import { Link } from '@inertiajs/vue3';

const currentYear = new Date().getFullYear();
</script>

<template>
    <footer class="border-t border-sidebar-border/80 bg-background">
        <div class="mx-auto max-w-7xl px-4 py-8">
            <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
                <!-- Section 1 -->
                <div>
                    <h3 class="mb-4 text-lg font-semibold">Fur N Tours</h3>
                    <p class="text-sm text-muted-foreground">
                        Notre association n'est affiliée d'aucune manière à l'association Team ChatShark. 
                    </p>
                </div>

                <!-- Section 2 - Liens -->
                <div>
                    <h3 class="mb-4 text-lg font-semibold">Liens rapides</h3>
                    <ul class="space-y-2 text-sm">
                        <li>
                            <Link href="/" class="text-muted-foreground hover:text-foreground">
                                Accueil
                            </Link>
                        </li>
                        <li>
                            <Link href="/boutique" class="text-muted-foreground hover:text-foreground">
                                Boutique
                            </Link>
                        </li>
                        <li>
                            <Link href="/furmeets" class="text-muted-foreground hover:text-foreground">
                                Furmeets
                            </Link> 
                        </li>
                        <li>
                            <Link href="/explication" class="text-muted-foreground hover:text-foreground">
                                C'est quoi un furry ?
                            </Link> 
                        </li>
                    </ul>
                </div>

                <!-- Section 3 - Contact -->
                <div>
                    <h3 class="mb-4 text-lg font-semibold"> </h3>
                    <ul class="space-y-2 text-sm text-muted-foreground">
                         <li>
                            <Link href="/status" class="text-muted-foreground hover:text-foreground">
                                Status
                            </Link>
                        </li>
                        <li>
                            <Link href="/cgu" class="text-muted-foreground hover:text-foreground">
                                CGU
                            </Link>
                        </li>
                        <li>
                            <Link href="/rgpd" class="text-muted-foreground hover:text-foreground">
                                RGPD
                            </Link> 
                        </li>
                        <li>
                            <Link href="/reglement-interieur" class="text-muted-foreground hover:text-foreground">
                                Règlement Intérieur
                            </Link> 
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Copyright -->
            <div class="mt-8 border-t border-sidebar-border/50 pt-6 text-center text-sm text-muted-foreground">
                <p>&copy; {{ currentYear }} Fur N Tours. Tous droits réservés.</p>
            </div>
        </div>
    </footer>
</template>
