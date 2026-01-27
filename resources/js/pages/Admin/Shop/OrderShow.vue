<script setup lang="ts">
import AdminLayout from '@/layouts/AdminLayout.vue';
import { Head, router } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { CreditCard, ClipboardList, ArrowLeft } from 'lucide-vue-next';
import { ref } from 'vue';

defineOptions({
  layout: AdminLayout,
});

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
  product?: { id: number; name: string } | null;
}

interface PaymentEntry {
  id: number;
  payment_method: string;
  transaction_id: string | null;
  amount: number;
  status: string;
  paid_at?: string | null;
}

interface OrderDetail {
  id: number;
  order_number: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  shipping_address: string | null;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
  items: OrderItem[];
  payments: PaymentEntry[];
}

interface Props { order: OrderDetail }
const props = defineProps<Props>();

const newStatus = ref<OrderDetail['status']>(props.order.status);

const updateStatus = () => {
  router.put(`/admin/orders/${props.order.id}`, { status: newStatus.value });
};
</script>

<template>
  <div>
    <Head :title="`Admin - Commande ${props.order.order_number}`" />

    <section class="container mx-auto px-4">
      <div class="mx-auto max-w-7xl mb-8">
        <div class="flex items-center justify-between">
          <h1 class="font-bold text-light-blue text-3xl md:text-4xl">
            Commande <span class="text-blue">{{ props.order.order_number }}</span>
          </h1>
          <Button class="bg-blue/30 text-light-blue hover:bg-blue/50 border border-light-blue/30" @click="router.visit('/admin/orders')">
            <ArrowLeft class="h-4 w-4 mr-2" /> Retour
          </Button>
        </div>
      </div>

      <div class="mx-auto max-w-7xl grid md:grid-cols-3 gap-6">
        <!-- Order Summary -->
        <div class="md:col-span-2 rounded-lg border border-light-blue/30 bg-blue/20 p-6">
          <h2 class="text-light-blue font-semibold mb-4">Résumé</h2>
          <div class="grid md:grid-cols-2 gap-4 text-light-blue/80 text-sm">
            <p><span class="font-medium">Client:</span> {{ props.order.customer_name || '—' }}</p>
            <p><span class="font-medium">Email:</span> {{ props.order.customer_email || '—' }}</p>
            <p><span class="font-medium">Téléphone:</span> {{ props.order.customer_phone || '—' }}</p>
            <p><span class="font-medium">Adresse:</span> {{ props.order.shipping_address || '—' }}</p>
            <p><span class="font-medium">Montant:</span> {{ Number(props.order.total).toFixed(2) }}€</p>
            <p><span class="font-medium">Statut:</span> {{ props.order.status }}</p>
            <p><span class="font-medium">Créée le:</span> {{ new Date(props.order.created_at).toLocaleString() }}</p>
          </div>
        </div>

        <!-- Status Update -->
        <div class="rounded-lg border border-light-blue/30 bg-blue/20 p-6">
          <h2 class="text-light-blue font-semibold mb-4">Mettre à jour le statut</h2>
          <select v-model="newStatus" class="w-full bg-[#2c3e50] border border-light-blue/30 rounded p-2 text-light-blue">
            <option value="pending">pending</option>
            <option value="processing">processing</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
          </select>
          <Button class="mt-3 w-full bg-blue text-black hover:bg-blue/80" @click="updateStatus">Mettre à jour</Button>
        </div>
      </div>

      <!-- Items -->
      <div class="mx-auto max-w-7xl mt-6 rounded-lg border border-light-blue/30 bg-blue/20 overflow-hidden">
        <h2 class="px-6 pt-6 text-light-blue font-semibold">Articles</h2>
        <table class="w-full">
          <thead class="border-b border-light-blue/30 bg-blue/30">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-semibold text-light-blue">Produit</th>
              <th class="px-6 py-3 text-center text-sm font-semibold text-light-blue">Qté</th>
              <th class="px-6 py-3 text-right text-sm font-semibold text-light-blue">Prix</th>
              <th class="px-6 py-3 text-right text-sm font-semibold text-light-blue">Sous-total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in props.order.items" :key="item.id" class="border-b border-light-blue/20">
              <td class="px-6 py-3">{{ item.name || item.product?.name || `#${item.product?.id}` }}</td>
              <td class="px-6 py-3 text-center">{{ item.quantity }}</td>
              <td class="px-6 py-3 text-right">{{ Number(item.price).toFixed(2) }}€</td>
              <td class="px-6 py-3 text-right font-semibold">{{ Number(item.subtotal).toFixed(2) }}€</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Payments -->
      <div class="mx-auto max-w-7xl mt-6 rounded-lg border border-light-blue/30 bg-blue/20 p-6">
        <h2 class="text-light-blue font-semibold mb-4">Paiements</h2>
        <div v-if="props.order.payments.length" class="space-y-3">
          <div v-for="payment in props.order.payments" :key="payment.id" class="rounded border border-light-blue/30 bg-blue/30 p-4">
            <div class="flex items-center justify-between">
              <div class="text-sm text-light-blue/80">
                <p><span class="font-medium">Méthode:</span> {{ payment.payment_method }}</p>
                <p><span class="font-medium">Statut:</span> {{ payment.status }}</p>
                <p><span class="font-medium">Montant:</span> {{ Number(payment.amount).toFixed(2) }}€</p>
                <p v-if="payment.paid_at"><span class="font-medium">Payé le:</span> {{ new Date(payment.paid_at as string).toLocaleString() }}</p>
              </div>
              <CreditCard class="h-8 w-8 text-light-blue/50" />
            </div>
          </div>
        </div>
        <div v-else class="text-light-blue/60 text-sm">Aucun paiement enregistré pour cette commande.</div>
      </div>
    </section>
  </div>
</template>
