<script setup lang="ts">
import AdminLayout from '@/layouts/AdminLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { FileText, Eye } from 'lucide-vue-next';

defineOptions({
  layout: AdminLayout,
});

interface InvoiceSummary {
  id: number;
  invoice_number: string;
  pdf_path: string | null;
  issued_at: string;
  order: {
    id: number;
    order_number: string;
    customer_name: string | null;
    total: number;
    status: string;
    created_at: string;
  };
}

interface Props {
  invoices: InvoiceSummary[];
}

const props = defineProps<Props>();

const statusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500/20 text-green-400 border border-green-500/30';
    case 'processing':
      return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    case 'cancelled':
      return 'bg-red-500/20 text-red-400 border border-red-500/30';
    default:
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
  }
};
</script>

<template>
  <div>
    <Head title="Admin - Factures" />

    <section class="container mx-auto px-4">
      <div class="mx-auto max-w-7xl mb-8">
        <h1 class="font-bold text-light-blue text-4xl md:text-5xl">
          Gestion des <span class="text-blue">Factures</span>
        </h1>
      </div>

      <div class="mx-auto max-w-7xl">
        <div class="grid gap-4 md:grid-cols-3 mb-8">
          <div class="rounded-lg border border-light-blue/30 bg-blue/20 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-light-blue/70">Total factures</p>
                <p class="text-3xl font-bold text-light-blue">{{ props.invoices.length }}</p>
              </div>
              <FileText class="h-10 w-10 text-light-blue/50" />
            </div>
          </div>
          <div class="rounded-lg border border-light-blue/30 bg-blue/20 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-light-blue/70">Montant total</p>
                <p class="text-3xl font-bold text-light-blue">
                  {{ Number(props.invoices.reduce((sum, i) => sum + (i.order?.total || 0), 0)).toFixed(2) }}€
                </p>
              </div>
              <FileText class="h-10 w-10 text-light-blue/50" />
            </div>
          </div>
          <div class="rounded-lg border border-light-blue/30 bg-blue/20 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-light-blue/70">Ce mois</p>
                <p class="text-3xl font-bold text-light-blue">
                  {{ props.invoices.filter(i => new Date(i.issued_at).getMonth() === new Date().getMonth()).length }}
                </p>
              </div>
              <FileText class="h-10 w-10 text-light-blue/50" />
            </div>
          </div>
        </div>

        <div v-if="props.invoices.length" class="rounded-lg border border-light-blue/30 bg-blue/20 overflow-hidden">
          <table class="w-full">
            <thead class="border-b border-light-blue/30 bg-blue/30">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-semibold text-light-blue">Numéro</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-light-blue">Commande</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-light-blue">Client</th>
                <th class="px-6 py-4 text-right text-sm font-semibold text-light-blue">Montant</th>
                <th class="px-6 py-4 text-center text-sm font-semibold text-light-blue">Statut</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-light-blue">Date</th>
                <th class="px-6 py-4 text-right text-sm font-semibold text-light-blue">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="invoice in props.invoices" :key="invoice.id" class="border-b border-light-blue/20 hover:bg-blue/30 transition-colors">
                <td class="px-6 py-4">
                  <div>
                    <p class="font-medium text-white">{{ invoice.invoice_number }}</p>
                    <p class="text-xs text-light-blue/60">ID: {{ invoice.id }}</p>
                  </div>
                </td>
                <td class="px-6 py-4">{{ invoice.order?.order_number || '—' }}</td>
                <td class="px-6 py-4">{{ invoice.order?.customer_name || '—' }}</td>
                <td class="px-6 py-4 text-right font-semibold text-light-blue">{{ Number(invoice.order?.total || 0).toFixed(2) }}€</td>
                <td class="px-6 py-4 text-center">
                  <span :class="['inline-block px-3 py-1 rounded text-xs font-medium', statusBadge(invoice.order?.status || 'pending')]">
                    {{ invoice.order?.status || 'pending' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-light-blue/70">{{ new Date(invoice.issued_at).toLocaleDateString('fr-FR') }}</td>
                <td class="px-6 py-4 text-right">
                  <Link :href="`/admin/invoices/${invoice.id}`" as="button">
                    <Button size="sm" class="bg-blue/30 text-light-blue hover:bg-blue/50 border border-light-blue/30">
                      <Eye class="h-4 w-4 mr-1" /> Voir
                    </Button>
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="rounded-lg border-2 border-dashed border-muted p-12 text-center">
          <p class="mb-4 text-lg text-muted-foreground">Aucune facture pour le moment.</p>
        </div>
      </div>
    </section>
  </div>
</template>
