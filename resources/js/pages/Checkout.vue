<script setup lang="ts">
import AppHeaderLayout from '@/layouts/app/AppHeaderLayout.vue';
import { Head, Link, usePage, router } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Truck, Lock, AlertCircle } from 'lucide-vue-next';
import { useCart } from '@/composables/useCart';
import { useNotification } from '@/composables/useNotification';
import NotificationContainer from '@/components/NotificationContainer.vue';
import { ref,watch } from 'vue';

defineOptions({
    layout: AppHeaderLayout,
});

const { cartItems, total } = useCart();
const { error, success } = useNotification();

const loading = ref(false);

const formData = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'stripe',
});

const errors = ref<Record<string, string>>({});

const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
        merch: '🛍️ Merch',
        membership: '👥 Adhésion',
        ticket: '🎫 Ticket',
    };
    return labels[category] || category;
};

const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.value.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!formData.value.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!formData.value.email.trim()) newErrors.email = 'L\'email est requis';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
        newErrors.email = 'Format email invalide';
    }
    if (!formData.value.phone.trim()) newErrors.phone = 'Le téléphone est requis';
    if (!/^\+?[0-9\s\-]{7,15}$/.test(formData.value.phone)) {
        newErrors.phone = 'Format téléphone invalide';
    }

    if (!formData.value.address.trim()) newErrors.address = 'L\'adresse est requise';
    if (!formData.value.city.trim()) newErrors.city = 'La ville est requise';
    if (!formData.value.postalCode.trim()) newErrors.postalCode = 'Le code postal est requis';
    if (!/^[0-9]{5}$/.test(formData.value.postalCode)) {
        newErrors.postalCode = 'Format code postal invalide';
    }

    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
};

const submitOrder = async () => {
    if (!validateForm()) {
        error('Erreur', 'Veuillez remplir tous les champs');
        return;
    }

    if (cartItems.value.length === 0) {
        error('Erreur', 'Votre panier est vide');
        return;
    }

    loading.value = true;

    try {
        // Préparer les données de la commande
        const orderData = {
            firstName: formData.value.firstName,
            lastName: formData.value.lastName,
            email: formData.value.email,
            phone: formData.value.phone,
            address: formData.value.address,
            city: formData.value.city,
            postalCode: formData.value.postalCode,
            country: formData.value.country,
            paymentMethod: formData.value.paymentMethod,
            items: cartItems.value,
            total: total.value,
        };

        // Envoyer la commande au serveur
        router.post('/boutique/checkout', orderData, {
            onError: (pageProps: any) => {
                loading.value = false;
                const errorMsg = pageProps?.error || 'Impossible de traiter la commande';
                error('Erreur', errorMsg);
            },
            onSuccess: () => {
                loading.value = false;
                success('Succès', 'Commande créée avec succès');
            },
        });
    } catch (err: any) {
        error('Erreur', err.message);
        loading.value = false;
    }
};

const backToCart = () => {
    router.visit('/boutique/panier');
};

// Recupère les messages d'erreur flash
const page = usePage();
watch(
  () => page.props.flash,
  (flash: any) => {
    if (flash?.success) {
      success('Succès', flash.success);
    }
    if (flash?.error) {
      error('Erreur', flash.error);
    }
  },
  { immediate: true, deep: true }
);

</script>

<template>
    <Head title="Checkout" />

    <NotificationContainer />

    <div class="min-h-screen bg-dark py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
            <!-- Header -->
            <div class="flex items-center gap-4 mb-8">
                    <Button 
                        @click="backToCart"
                        class="bg-blue/30 text-light-blue hover:bg-blue/50 border border-light-blue/30">
                        <ArrowLeft class="h-5 w-5 mr-2" />
                        Retour à la boutique
                    </Button>
                <h1 class="text-3xl font-bold text-light-blue">Finaliser votre commande</h1>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Formulaire -->
                <div class="lg:col-span-2">
                    <div class="bg-blue/20 rounded-lg shadow-md p-8">
                        <!-- Informations personnelles -->
                        <div class="mb-8">
                            <h2 class="text-xl font-semibold text-blue mb-4">
                                Informations personnelles
                            </h2>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-light-blue mb-1">
                                        Prénom
                                    </label>
                                    <input
                                        v-model="formData.firstName"
                                        type="text"
                                        class="w-full bg-[#2c3e50] text-white px-4 py-2 border border-light-blue/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        :class="errors.firstName ? 'border-red-500' : ''"
                                    />
                                    <p v-if="errors.firstName" class="text-red-500 text-sm mt-1">
                                        {{ errors.firstName }}
                                    </p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-light-blue mb-1">
                                        Nom
                                    </label>
                                    <input
                                        v-model="formData.lastName"
                                        type="text"
                                        class="w-full bg-[#2c3e50] text-white px-4 py-2 border border-light-blue/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        :class="errors.lastName ? 'border-red-500' : ''"
                                    />
                                    <p v-if="errors.lastName" class="text-red-500 text-sm mt-1">
                                        {{ errors.lastName }}
                                    </p>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label class="block text-sm font-medium text-light-blue mb-1">
                                        Email
                                    </label>
                                    <input
                                        v-model="formData.email"
                                        type="email"
                                        class="w-full bg-[#2c3e50] text-white px-4 py-2 border border-light-blue/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        :class="errors.email ? 'border-red-500' : ''"
                                    />
                                    <p v-if="errors.email" class="text-red-500 text-sm mt-1">
                                        {{ errors.email }}
                                    </p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-light-blue mb-1">
                                        Téléphone
                                    </label>
                                    <input
                                        v-model="formData.phone"
                                        type="tel"
                                        class="w-full bg-[#2c3e50] text-white px-4 py-2 border border-light-blue/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        :class="errors.phone ? 'border-red-500' : ''"
                                    />
                                    <p v-if="errors.phone" class="text-red-500 text-sm mt-1">
                                        {{ errors.phone }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Adresse de livraison -->
                        <div class="mb-8 pb-8 border-b">
                            <h2 class="text-xl font-semibold text-blue mb-4 flex items-center gap-2">
                                <Truck class="w-5 h-5" />
                                Adresse de livraison
                            </h2>
                            <div>
                                <label class="block text-sm font-medium text-light-blue mb-1">
                                    Adresse
                                </label>
                                <input
                                    v-model="formData.address"
                                    type="text"
                                    class="w-full bg-[#2c3e50] text-white px-4 py-2 border border-light-blue/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    :class="errors.address ? 'border-red-500' : ''"
                                />
                                <p v-if="errors.address" class="text-red-500 text-sm mt-1">
                                    {{ errors.address }}
                                </p>
                            </div>

                            <div class="grid grid-cols-3 gap-4 mt-4">
                                <div>
                                    <label class="block text-sm font-medium text-light-blue mb-1">
                                        Code postal
                                    </label>
                                    <input
                                        v-model="formData.postalCode"
                                        type="text"
                                        class="w-full bg-[#2c3e50] text-white px-4 py-2 border border-light-blue/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        :class="errors.postalCode ? 'border-red-500' : ''"
                                    />
                                    <p v-if="errors.postalCode" class="text-red-500 text-sm mt-1">
                                        {{ errors.postalCode }}
                                    </p>
                                </div>
                                <div class="col-span-2">
                                    <label class="block text-sm font-medium text-light-blue mb-1">
                                        Ville
                                    </label>
                                    <input
                                        v-model="formData.city"
                                        type="text"
                                        class="w-full bg-[#2c3e50] text-white px-4 py-2 border border-light-blue/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        :class="errors.city ? 'border-red-500' : ''"
                                    />
                                    <p v-if="errors.city" class="text-red-500 text-sm mt-1">
                                        {{ errors.city }}
                                    </p>
                                </div>
                            </div>

                            <div class="mt-4">
                                <label class="block text-sm font-medium text-light-blue mb-1">
                                    Pays
                                </label>
                                <select
                                    v-model="formData.country"
                                    class="w-full bg-[#2c3e50] text-white px-4 py-2 border border-light-blue/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="FR">France</option>
                                </select>
                            </div>
                        </div>

                        <!-- Méthode de paiement -->
                        <div class="mb-8">
                            <h2 class="text-xl font-semibold text-blue mb-4 flex items-center gap-2">
                                <Lock class="w-5 h-5" />
                                Méthode de paiement
                            </h2>
                            <div class="space-y-3 ">
                                <label class="flex items-center p-4 border border-light-blue/20 rounded-lg cursor-pointer" :class="formData.paymentMethod === 'stripe' ? 'border-blue-500 bg-blue text-gray-500' : 'hover:bg-blue/20'">
                                    <input
                                        v-model="formData.paymentMethod"
                                        type="radio"
                                        value="stripe"
                                        class="w-4 h-4 text-blue-500"
                                    />
                                    <span class="ml-3">
                                        <span class="font-medium text-black">Carte bancaire (Stripe)</span>
                                        <p class="text-sm">Paiement sécurisé</p>
                                    </span>
                                </label>
                                <!-- <label class="flex items-center p-4 border border-light-blue/20 rounded-lg cursor-pointer" :class="formData.paymentMethod === 'paypal' ? 'border-blue-500 bg-blue text-gray-500' : 'hover:bg-blue/20'">
                                    <input
                                        v-model="formData.paymentMethod"
                                        type="radio"
                                        value="paypal"
                                        class="w-4 h-4 text-blue-500"
                                    />
                                    <span class="ml-3">
                                        <span class="font-medium text-black">PayPal</span>
                                        <p class="text-sm">Paiement rapide avec PayPal</p>
                                    </span>
                                </label> -->
                            </div>
                        </div>

                        <!-- Conditions -->
                        <div class="bg-yellow/10 border-2 border-yellow/40 rounded-lg p-4 flex items-start gap-3 shadow-lg shadow-yellow/5">
                            <AlertCircle class="w-5 h-5 text-yellow flex-shrink-0 mt-0.5" />
                            <div class="text-sm">
                                <p class="font-semibold mb-1 text-yellow">Avant de finaliser</p>
                                <p class="text-xs text-light-blue/90">En cliquant sur "Finaliser la commande", vous acceptez nos conditions générales d'utilisation et la politique de confidentialité.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Résumé commande -->
                <div class="lg:col-span-1">
                    <div class="bg-blue/20 rounded-lg shadow-md p-6 sticky top-30">
                        <h2 class="text-lg font-semibold text-blue mb-4">Résumé de commande</h2>

                        <div v-if="cartItems.length === 0" class="text-center py-8">
                            <p class="text-gray-500">Votre panier est vide</p>
                            <Link href="/boutique/panier" class="text-blue hover:text-blue text-sm mt-2 block">
                                Retour au panier
                            </Link>
                        </div>

                        <div v-else>
                            <div class="space-y-3 mb-6">
                                <div
                                    v-for="item in cartItems"
                                    :key="item.id"
                                    class="flex justify-between text-sm border-b pb-3"
                                >
                                    <div class="">
                                        <p class="font-medium text-white">{{ item.name }}</p>
                                        <p class="text-xs text-light-blue ml-0.5">{{ getCategoryLabel(item.category) }}</p>
                                        <p class="text-xs text-light-blue ml-0.5">Qté: {{ item.quantity }}</p>
                                    </div>
                                    <p class="font-medium text-blue">
                                        {{ (item.price * item.quantity).toFixed(2) }}€
                                    </p>
                                </div>
                            </div>

                            <div class="border-t pt-4">
                                <div class="flex justify-between mb-2">
                                    <span class="text-light-blue">Sous-total</span>
                                    <span class="font-medium text-blue">{{ total.toFixed(2) }}€</span>
                                </div>
                                <div class="flex justify-between mb-2">
                                    <span class="text-light-blue">Livraison</span>
                                    <span class=" text-blue font-medium">À définir</span>
                                </div>
                                <div class="border-t mt-4 pt-4">
                                    <div class="flex justify-between">
                                        <span class="text-lg font-semibold text-light-blue">Total</span>
                                        <span class="text-lg font-semibold text-blue">
                                            {{ total.toFixed(2) }}€
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                @click="submitOrder"
                                :disabled="loading || cartItems.length === 0"
                                class="bg-blue text-black hover:bg-blue/50 border border-light-blue/30 w-full mt-6 py-3 font-bold"
                            >
                                {{ loading ? 'Traitement en cours...' : 'Finaliser la commande' }}
                            </Button>

                            <Link href="/boutique/panier" class="block text-center text-light-blue hover:text-blue text-sm mt-3">
                                Modifier le panier
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
input:focus,
select:focus {
    outline: none;
}
</style>
