<script setup lang="ts">
import AppHeaderLayout from '@/layouts/app/AppHeaderLayout.vue';
import { Head, usePage, router } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { Lock, CreditCard, AlertCircle, CheckCircle2, Loader2 } from 'lucide-vue-next';
import { useNotification } from '@/composables/useNotification';
import { useCart } from '@/composables/useCart';
import NotificationContainer from '@/components/NotificationContainer.vue';
import { ref, onMounted, computed, nextTick } from 'vue';
import { loadStripe, Stripe, StripeElements, StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement } from '@stripe/stripe-js';

defineOptions({
    layout: AppHeaderLayout,
});

interface PaymentPageProps {
    order_id?: number;
    client_secret?: string;
    payment_intent_id?: string;
    amount?: number;
    name: string;
    quote: { message: string; author: string };
    auth: any;
    sidebarOpen: boolean;
    [key: string]: any;
}

const { error, success } = useNotification();
const { clearCart } = useCart();
const page = usePage<PaymentPageProps>();

// Récupérer les données de la session
const orderId = computed(() => page.props.order_id);
const clientSecret = computed(() => page.props.client_secret);
const paymentIntentId = computed(() => page.props.payment_intent_id);
const amount = computed(() => {
    const val = page.props.amount;
    return typeof val === 'number' ? val : (typeof val === 'string' ? parseFloat(val) : 0);
});

// Card display state
const cardDisplay = ref({
    number: '**** **** **** ****',
    name: 'YOUR NAME',
    expiry: 'MM/YY',
    cvc: '***',
});

const cardholderName = ref('');
const cardFlipped = ref(false);

const stripe = ref<Stripe | null>(null);
const elements = ref<StripeElements | null>(null);
const cardNumberElement = ref<StripeCardNumberElement | null>(null);
const cardExpiryElement = ref<StripeCardExpiryElement | null>(null);
const cardCvcElement = ref<StripeCardCvcElement | null>(null);
const processing = ref(false);
const paymentCompleted = ref(false);
const orderNumber = ref('');
const isLoading = ref(true);
const hasError = ref(false);

// Charger Stripe
onMounted(async () => {
    console.log('Payment page mounted');
    console.log('Props:', page.props);
    console.log('Client Secret:', clientSecret.value);
    console.log('Amount:', amount.value);

    if (!clientSecret.value) {
        console.error('No client secret found');
        hasError.value = true;
        isLoading.value = false;
        error('Erreur', 'Aucune session de paiement trouvée');
        setTimeout(() => {
            router.visit('/boutique/panier');
        }, 3000);
        return;
    }

    try {
        // Remplacer par votre clé publique Stripe
        const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
        
        console.log('Stripe Public Key:', stripePublicKey);
        
        if (!stripePublicKey) {
            hasError.value = true;
            isLoading.value = false;
            error('Erreur', 'Configuration Stripe manquante. Veuillez contacter le support.');
            return;
        }

        stripe.value = await loadStripe(stripePublicKey);

        if (!stripe.value) {
            throw new Error('Impossible de charger Stripe');
        }

        // Créer les éléments Stripe
        elements.value = stripe.value.elements();
        
        // Style des éléments
        const elementStyle = {
            base: {
                color: '#fff',
                fontFamily: '"Segoe UI", Roboto, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
            },
        };

        // D'abord mettre à jour isLoading pour afficher le formulaire
        isLoading.value = false;
        
        // Attendre que le DOM soit mis à jour avant de monter les éléments
        await nextTick();
        
        // Créer et monter l'élément de numéro de carte
        cardNumberElement.value = elements.value.create('cardNumber', { style: elementStyle });
        cardNumberElement.value.mount('#card-number-element');
        cardNumberElement.value.on('change', (event: any) => {
            console.log('Card number changed:', event);
        });

        // Créer et monter l'élément d'expiration
        cardExpiryElement.value = elements.value.create('cardExpiry', { style: elementStyle });
        cardExpiryElement.value.mount('#card-expiry-element');

        // Créer et monter l'élément CVC
        cardCvcElement.value = elements.value.create('cardCvc', { style: elementStyle });
        cardCvcElement.value.mount('#card-cvc-element');
        cardCvcElement.value.on('focus', () => {
            cardFlipped.value = true;
        });
        cardCvcElement.value.on('blur', () => {
            cardFlipped.value = false;
        });

        console.log('Stripe loaded successfully');
    } catch (err: any) {
        console.error('Error loading Stripe:', err);
        hasError.value = true;
        isLoading.value = false;
        error('Erreur', err.message || 'Impossible de charger le formulaire de paiement');
    }
});

const handleSubmit = async () => {
    if (!stripe.value || !cardNumberElement.value) {
        error('Erreur', 'Stripe n\'est pas encore chargé');
        return;
    }

    if (!clientSecret.value) {
        error('Erreur', 'Aucune session de paiement trouvée');
        return;
    }

    processing.value = true;

    try {
        console.log('Starting payment with client secret:', clientSecret.value);
        
        // Confirmer le paiement avec Stripe
        const { paymentIntent, error: stripeError } = await stripe.value.confirmCardPayment(
            clientSecret.value,
            {
                payment_method: {
                    card: cardNumberElement.value,
                },
            }
        );

        console.log('Payment Intent:', paymentIntent);
        console.log('Stripe Error:', stripeError);

        if (stripeError) {
            throw new Error(stripeError.message);
        }

        if (paymentIntent?.status === 'succeeded') {
            console.log('Payment succeeded, confirming on server...');
            
            // Confirmer le paiement côté serveur avec fetch natif
            try {
                const response = await fetch('/api/payment/confirm-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify({
                        order_id: orderId.value,
                        payment_intent_id: paymentIntentId.value,
                    }),
                });

                console.log('Server response status:', response.status);
                const responseText = await response.text();
                console.log('Server response:', responseText);

                let data;
                try {
                    data = JSON.parse(responseText);
                } catch (e) {
                    console.error('Failed to parse JSON:', responseText);
                    throw new Error('Réponse serveur invalide');
                }

                if (response.ok && data.success) {
                    paymentCompleted.value = true;
                    orderNumber.value = data.order_number || orderId.value?.toString() || '';
                    success('Succès', 'Paiement effectué avec succès !');
                    
                    // Vider le panier (état réactif + localStorage)
                    clearCart();
                    localStorage.removeItem('furntours_cart');
                    
                    // Rediriger vers la facture après 2 secondes
                    setTimeout(() => {
                        router.visit(`/invoice/${data.invoice_id}`);
                    }, 2000);
                } else {
                    throw new Error(data.error || 'Erreur lors de la confirmation du paiement');
                }
            } catch (fetchError: any) {
                console.error('Fetch error:', fetchError);
                throw new Error(fetchError.message || 'Erreur de communication avec le serveur');
            }
        }
    } catch (err: any) {
        error('Erreur', err.message || 'Erreur lors du traitement du paiement');
    } finally {
        processing.value = false;
    }
};
</script>

<template>
    <Head title="Paiement sécurisé" />

    <NotificationContainer />

    <div class="min-h-screen bg-dark py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-5xl mx-auto">
            <!-- Header -->
            <div class="text-center mb-12">
                <h1 class="text-4xl font-bold text-light-blue mb-2">Paiement sécurisé</h1>
                <p class="text-light-blue/70">Finalisez votre commande en toute sécurité</p>
            </div>

            <!-- Loading -->
            <div v-if="isLoading" class="bg-blue/20 rounded-lg shadow-md p-12 text-center">
                <Loader2 class="h-12 w-12 text-blue mx-auto mb-4 animate-spin" />
                <p class="text-light-blue text-lg">Chargement du formulaire de paiement...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="hasError" class="bg-red-500/10 border-2 border-red-500/40 rounded-lg p-8 text-center">
                <AlertCircle class="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 class="text-2xl font-bold text-red-400 mb-2">Erreur</h2>
                <p class="text-light-blue mb-4">Une erreur est survenue lors du chargement du paiement.</p>
                <Button @click="router.visit('/boutique/panier')" class="bg-blue text-black hover:bg-blue/80">
                    Retour au panier
                </Button>
            </div>

            <!-- Paiement complété -->
            <div v-else-if="paymentCompleted" class="bg-green-500/10 border-2 border-green-500/40 rounded-lg p-8 text-center">
                <CheckCircle2 class="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 class="text-2xl font-bold text-green-400 mb-2">Paiement réussi !</h2>
                <p class="text-light-blue mb-1">Merci pour votre commande</p>
                <p class="text-light-blue/70 text-sm">Numéro de commande: {{ orderNumber }}</p>
                <p class="text-light-blue/50 text-xs mt-4">Redirection vers votre facture...</p>
            </div>

            <!-- Formulaire de paiement -->
            <div v-else class="grid lg:grid-cols-2 gap-12">
                <!-- Carte animée - Gauche -->
                <div class="flex flex-col justify-center">
                    <!-- Perspective container pour l'animation flip -->
                    <div class="perspective h-80 mb-8">
                        <div
                            class="relative w-full h-full transition-transform duration-500 transform-gpu"
                            :style="{
                                transformStyle: 'preserve-3d',
                                transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                            }"
                        >
                            <!-- FACE AVANT de la carte -->
                            <div
                                class="absolute w-full h-full bg-gradient-to-br from-blue via-cyan-500 to-light-blue rounded-2xl shadow-2xl p-8 text-white"
                                :style="{ backfaceVisibility: 'hidden' }"
                            >
                                <!-- Effets de fond -->
                                <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                                <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16 blur-2xl"></div>

                                <!-- Contenu front -->
                                <div class="relative h-full flex flex-col justify-between">
                                    <!-- Chip et logo -->
                                    <div class="flex justify-between items-start">
                                        <div class="w-12 h-10 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-lg shadow-lg"></div>
                                        <span class="text-lg font-bold tracking-widest">VISA</span>
                                    </div>

                                    <!-- Numéro de carte -->
                                    <div class="space-y-4">
                                        <div class="text-2xl font-mono tracking-widest font-bold">
                                            {{ cardDisplay.number }}
                                        </div>
                                        <div class="grid grid-cols-2 gap-8">
                                            <div>
                                                <p class="text-xs opacity-75 uppercase tracking-wide">Titulaire</p>
                                                <p class="font-semibold text-lg">{{ cardDisplay.name }}</p>
                                            </div>
                                            <div>
                                                <p class="text-xs opacity-75 uppercase tracking-wide">Expire</p>
                                                <p class="font-mono text-lg tracking-widest">{{ cardDisplay.expiry }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- FACE ARRIÈRE de la carte (CVC) -->
                            <div
                                class="absolute w-full h-full bg-gradient-to-br from-blue via-cyan-500 to-light-blue rounded-2xl shadow-2xl p-8 text-white flex flex-col justify-center"
                                :style="{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }"
                            >
                                <div class="bg-black/30 h-14 w-full mb-6"></div>
                                <div class="flex justify-end pr-4">
                                    <div class="bg-white/20 h-10 w-16 rounded flex items-center justify-center">
                                        <span class="font-mono text-lg font-bold">{{ cardDisplay.cvc }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Info securité -->
                    <div class="bg-blue/10 border border-light-blue/20 rounded-xl p-4">
                        <div class="flex items-center gap-3">
                            <Lock class="w-5 h-5 text-blue flex-shrink-0" />
                            <div class="text-sm">
                                <p class="font-semibold text-light-blue">Paiement 100% sécurisé</p>
                                <p class="text-xs text-light-blue/70">Vos données sont cryptées par Stripe</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Formulaire - Droite -->
                <div class="flex flex-col justify-center">
                    <div class="bg-blue/20 border border-light-blue/30 rounded-2xl shadow-2xl p-8">
                        <h2 class="text-2xl font-bold text-light-blue mb-8">Informations de paiement</h2>

                        <form @submit.prevent="handleSubmit" class="space-y-6">
                            <!-- Nom du titulaire -->
                            <div>
                                <label class="block text-sm font-semibold text-light-blue mb-3">Nom du titulaire</label>
                                <input
                                    v-model="cardholderName"
                                    @input="cardDisplay.name = cardholderName.toUpperCase() || 'YOUR NAME'"
                                    type="text"
                                    placeholder="JOHN DOE"
                                    class="w-full bg-dark/50 px-4 py-3 border border-light-blue/30 rounded-xl focus:ring-2 focus:ring-blue focus:border-transparent transition-all text-light-blue placeholder-light-blue/40 uppercase"
                                />
                            </div>

                            <!-- Numéro de carte -->
                            <div>
                                <label class="text-sm font-semibold text-light-blue mb-3 flex items-center gap-2">
                                    <CreditCard class="w-4 h-4" />
                                    Numéro de carte
                                </label>
                                <div id="card-number-element" class="bg-dark/50 px-4 py-4 border border-light-blue/30 rounded-xl focus-within:ring-2 focus-within:ring-blue focus-within:border-transparent transition-all"></div>
                            </div>

                            <!-- Expiry et CVC -->
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-semibold text-light-blue mb-3">Date d'expiration</label>
                                    <div id="card-expiry-element" class="bg-dark/50 px-4 py-4 border border-light-blue/30 rounded-xl focus-within:ring-2 focus-within:ring-blue focus-within:border-transparent transition-all"></div>
                                </div>
                                <div>
                                    <label class="block text-sm font-semibold text-light-blue mb-3">CVC</label>
                                    <div id="card-cvc-element" class="bg-dark/50 px-4 py-4 border border-light-blue/30 rounded-xl focus-within:ring-2 focus-within:ring-blue focus-within:border-transparent transition-all"></div>
                                </div>
                            </div>

                            <!-- Résumé montant -->
                            <div class="bg-gradient-to-r from-blue/10 to-cyan-500/10 border border-light-blue/20 rounded-xl p-6">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-light-blue/80">Montant total</span>
                                    <span class="text-3xl font-bold text-blue">{{ (amount).toFixed(2) }}€</span>
                                </div>
                                <p class="text-xs text-light-blue/60">TTC - Paiement unique</p>
                            </div>

                            <!-- Bouton de paiement -->
                            <Button
                                type="submit"
                                :disabled="processing || !stripe"
                                class="w-full bg-gradient-to-r from-blue to-cyan-500 text-black hover:from-cyan-500 hover:to-blue py-4 text-lg font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-blue/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Loader2 v-if="processing" class="h-5 w-5 animate-spin" />
                                <Lock v-else class="h-5 w-5" />
                                {{ processing ? 'Traitement en cours...' : `Payer ${(amount).toFixed(2)}€` }}
                            </Button>

                            <p class="text-center text-light-blue/50 text-xs">
                                En validant, vous acceptez nos <a href="#" class="text-blue hover:text-cyan-500 font-semibold">conditions générales</a>
                            </p>
                        </form>

                        <!-- Mode test info -->
                        <div class="mt-8 bg-yellow/10 border border-yellow/40 rounded-xl p-4">
                            <div class="flex items-start gap-3">
                                <AlertCircle class="w-5 h-5 text-yellow flex-shrink-0 mt-0.5" />
                                <div class="text-sm">
                                    <p class="font-semibold mb-2 text-yellow">Mode test Stripe</p>
                                    <p class="text-xs text-light-blue/70 mb-3">Testez avec ces données :</p>
                                    <div class="space-y-1 text-xs text-light-blue/70 font-mono">
                                        <p>✓ Carte valide: <span class="text-green-400">4242 4242 4242 4242</span></p>
                                        <p>✗ Paiement échoué: <span class="text-red-400">4000 0000 0000 0002</span></p>
                                        <p>Date: 12/25 | CVC: 123</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#card-number-element,
#card-expiry-element,
#card-cvc-element {
    min-height: 48px;
}

.StripeElement {
    padding: 12px;
}

/* Perspective pour l'animation 3D */
.perspective {
    perspective: 1000px;
}

/* Désactiver les flèches des inputs number pour les champs Stripe */
:deep(.StripeElement--webkit-autofill) {
    background-color: transparent !important;
}

/* Animation de la carte */
@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-in {
    animation: slideInUp 0.5s ease-out;
}
</style>
