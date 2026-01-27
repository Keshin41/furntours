<script setup lang="ts">
import AppHeaderLayout from '@/layouts/app/AppHeaderLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { FileText, Download, ShoppingBag, ArrowLeft } from 'lucide-vue-next';

defineOptions({
    layout: AppHeaderLayout,
});

interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
}

interface InvoiceData {
    id: number;
    invoice_number: string;
    pdf_path: string;
    issued_at: string;
    order: {
        id: number;
        order_number: string;
        customer_name: string | null;
        customer_email: string | null;
        customer_phone: string | null;
        shipping_address: string | null;
        total: number;
        status: string;
        created_at: string;
        items: OrderItem[];
    };
}

interface Props {
    invoice: InvoiceData;
    order: any;
}

const props = defineProps<Props>();
</script>

<template>
    <Head title="Facture" />

    <div class="min-h-screen bg-dark py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
            <!-- Header -->
            <div class="mb-8">
                <div class="flex items-center justify-between mb-6">
                    <h1 class="text-3xl font-bold text-light-blue">Votre facture</h1>
                    <div class="flex gap-3">
                        <Link href="/boutique/panier" as="button">
                            <Button class="bg-blue/30 text-light-blue hover:bg-blue/50 border border-light-blue/30">
                                <ArrowLeft class="h-4 w-4 mr-2" /> Continuer vos achats
                            </Button>
                        </Link>
                        <a :href="`/invoice/${invoice.id}/download`" class="inline-block">
                            <Button class="bg-blue text-black hover:bg-blue/80">
                                <Download class="h-4 w-4 mr-2" /> Télécharger PDF
                            </Button>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Success Message -->
            <div class="mt-8 bg-green-500/10 border border-green-500/30 rounded-lg p-6 mb-6">
                <div class="flex items-center gap-3">
                    <FileText class="h-6 w-6 text-green-400" />
                    <div>
                        <p class="text-green-400 font-semibold">Paiement confirmé</p>
                        <p class="text-light-blue/70 text-sm">Votre commande a été traitée avec succès. Vous pouvez télécharger votre facture ou continuer vos achats.</p>
                    </div>
                </div>
            </div>

            <!-- Invoice Card -->
            <div class="bg-blue/20 rounded-lg border border-light-blue/30 p-8">
                <!-- Invoice Header -->
                <div class="flex justify-between items-start mb-8 pb-8 border-b border-light-blue/30">
                    <div>
                        <h2 class="text-4xl font-bold text-light-blue mb-2">FurTours</h2>
                        <p class="text-light-blue/70 text-sm">Votre partenaire en voyages animaliers</p>
                    </div>
                    <div class="text-right">
                        <p class="text-light-blue font-semibold">{{ invoice.invoice_number }}</p>
                        <p class="text-light-blue/70 text-sm">
                            Facturé le {{ new Date(invoice.issued_at).toLocaleDateString('fr-FR') }}
                        </p>
                    </div>
                </div>

                <!-- Customer & Order Info -->
                <div class="grid md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <p class="text-light-blue/70 text-sm mb-3 uppercase font-semibold">Facturé à</p>
                        <div class="text-light-blue">
                            <p class="font-semibold">{{ order.customer_name }}</p>
                            <p class="text-sm">{{ order.customer_email }}</p>
                            <p class="text-sm">{{ order.customer_phone }}</p>
                            <p class="text-sm mt-2">{{ order.shipping_address }}</p>
                        </div>
                    </div>
                    <div>
                        <p class="text-light-blue/70 text-sm mb-3 uppercase font-semibold">Détails de la commande</p>
                        <div class="text-light-blue text-sm space-y-2">
                            <p><span class="font-semibold">Commande :</span> {{ order.order_number }}</p>
                            <p><span class="font-semibold">Date :</span> {{ new Date(order.created_at).toLocaleDateString('fr-FR') }}</p>
                            <p><span class="font-semibold">Statut :</span> <span class="inline-block px-3 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">{{ order.status }}</span></p>
                        </div>
                    </div>
                </div>

                <!-- Items Table -->
                <div class="mb-8">
                    <p class="text-light-blue/70 text-sm mb-3 uppercase font-semibold">Articles commandés</p>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="border-b border-light-blue/30">
                                <tr>
                                    <th class="text-left py-3 px-4 text-light-blue font-semibold">Description</th>
                                    <th class="text-right py-3 px-4 text-light-blue font-semibold">Quantité</th>
                                    <th class="text-right py-3 px-4 text-light-blue font-semibold">Prix unitaire</th>
                                    <th class="text-right py-3 px-4 text-light-blue font-semibold">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in order.items" :key="item.id" class="border-b border-light-blue/20 hover:bg-blue/30">
                                    <td class="py-3 px-4 text-light-blue">{{ item.name }}</td>
                                    <td class="text-right py-3 px-4 text-light-blue">{{ item.quantity }}</td>
                                    <td class="text-right py-3 px-4 text-light-blue">{{ Number(item.price).toFixed(2) }}€</td>
                                    <td class="text-right py-3 px-4 text-light-blue font-semibold">{{ Number(item.subtotal).toFixed(2) }}€</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Summary -->
                <div class="flex justify-end mb-8">
                    <div class="w-64">
                        <div class="flex justify-between py-3 border-t-2 border-light-blue/30 text-light-blue">
                            <span class="font-semibold">Total TTC :</span>
                            <span class="text-2xl font-bold text-blue">{{ Number(order.total).toFixed(2) }}€</span>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="text-center text-light-blue/60 text-xs pt-8 border-t border-light-blue/30">
                    <p>Merci pour votre achat ! Cette facture est valable dans nos registres.</p>
                    <p>FurTours - Contact: contact@furtours.fr</p>
                </div>
            </div>

        </div>
    </div>
</template>
