<script setup lang="ts">
import AdminLayout from '@/layouts/AdminLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { FileText, Download, ArrowLeft } from 'lucide-vue-next';

defineOptions({
  layout: AdminLayout,
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
  pdf_path: string | null;
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
  <div>
    <Head :title="`Admin - Facture ${props.invoice.invoice_number}`" />

    <section class="container mx-auto px-4">
      <div class="mx-auto max-w-7xl mb-8">
        <div class="flex items-center justify-between">
          <h1 class="font-bold text-light-blue text-3xl md:text-4xl">
            Facture <span class="text-blue">{{ props.invoice.invoice_number }}</span>
          </h1>
          <div class="flex gap-3">
            <Link href="/admin/invoices" as="button">
              <Button class="bg-blue/30 text-light-blue hover:bg-blue/50 border border-light-blue/30">
                <ArrowLeft class="h-4 w-4 mr-2" /> Retour aux factures
              </Button>
            </Link>
            <a :href="`/invoice/${props.invoice.id}/download`" class="inline-block" target="_blank">
              <Button class="bg-blue text-black hover:bg-blue/80">
                <Download class="h-4 w-4 mr-2" /> Télécharger PDF
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div class="mx-auto max-w-7xl space-y-6">
        <!-- Invoice Info -->
        <div class="grid md:grid-cols-2 gap-6">
          <div class="rounded-lg border border-light-blue/30 bg-blue/20 p-6">
            <h2 class="text-light-blue font-semibold mb-4">Informations de facture</h2>
            <div class="space-y-3 text-light-blue/80 text-sm">
              <p><span class="font-medium">Numéro :</span> {{ props.invoice.invoice_number }}</p>
              <p><span class="font-medium">Générée le :</span> {{ new Date(props.invoice.issued_at).toLocaleString('fr-FR') }}</p>
              <p v-if="props.invoice.pdf_path"><span class="font-medium">Fichier :</span> {{ props.invoice.pdf_path }}</p>
            </div>
          </div>

          <div class="rounded-lg border border-light-blue/30 bg-blue/20 p-6">
            <h2 class="text-light-blue font-semibold mb-4">Informations de commande</h2>
            <div class="space-y-3 text-light-blue/80 text-sm">
              <p><span class="font-medium">Commande :</span> {{ props.order.order_number }}</p>
              <p><span class="font-medium">Date :</span> {{ new Date(props.order.created_at).toLocaleString('fr-FR') }}</p>
              <p>
                <span class="font-medium">Statut :</span>
                <span class="inline-block ml-2 px-3 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                  {{ props.order.status }}
                </span>
              </p>
            </div>
          </div>
        </div>

        <!-- Customer Info -->
        <div class="rounded-lg border border-light-blue/30 bg-blue/20 p-6">
          <h2 class="text-light-blue font-semibold mb-4">Informations client</h2>
          <div class="grid md:grid-cols-2 gap-6 text-light-blue/80 text-sm">
            <div>
              <p class="font-medium text-light-blue mb-2">Contact</p>
              <p>{{ props.order.customer_name }}</p>
              <p>{{ props.order.customer_email }}</p>
              <p>{{ props.order.customer_phone }}</p>
            </div>
            <div>
              <p class="font-medium text-light-blue mb-2">Adresse de livraison</p>
              <p>{{ props.order.shipping_address }}</p>
            </div>
          </div>
        </div>

        <!-- Items -->
        <div class="rounded-lg border border-light-blue/30 bg-blue/20 overflow-hidden">
          <h2 class="px-6 pt-6 text-light-blue font-semibold">Articles commandés</h2>
          <table class="w-full">
            <thead class="border-b border-light-blue/30 bg-blue/30">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold text-light-blue">Produit</th>
                <th class="px-6 py-3 text-center text-sm font-semibold text-light-blue">Qté</th>
                <th class="px-6 py-3 text-right text-sm font-semibold text-light-blue">Prix unitaire</th>
                <th class="px-6 py-3 text-right text-sm font-semibold text-light-blue">Sous-total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in props.order.items" :key="item.id" class="border-b border-light-blue/20">
                <td class="px-6 py-3 text-light-blue">{{ item.name }}</td>
                <td class="px-6 py-3 text-center text-light-blue">{{ item.quantity }}</td>
                <td class="px-6 py-3 text-right text-light-blue">{{ Number(item.price).toFixed(2) }}€</td>
                <td class="px-6 py-3 text-right font-semibold text-light-blue">{{ Number(item.subtotal).toFixed(2) }}€</td>
              </tr>
            </tbody>
          </table>

          <div class="flex justify-end px-6 py-6 border-t border-light-blue/30 bg-blue/30">
            <div class="w-64">
              <div class="flex justify-between py-3 text-light-blue">
                <span class="font-semibold">Total TTC :</span>
                <span class="text-2xl font-bold text-blue">{{ Number(props.order.total).toFixed(2) }}€</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
