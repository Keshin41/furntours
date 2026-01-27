<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use Stripe\Exception\ApiErrorException;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class StripePaymentService
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Créer une intention de paiement Stripe
     */
    public function createPaymentIntent(Order $order, array $metadata = []): PaymentIntent
    {
        $metadata['order_id'] = $order->id;
        $metadata['order_number'] = $order->order_number;

        return PaymentIntent::create([
            'amount' => (int) ($order->total * 100), // Montant en centimes
            'currency' => strtolower(config('app.currency', 'eur')),
            'metadata' => $metadata,
            'description' => "Commande {$order->order_number}",
            'receipt_email' => $order->customer_email,
        ]);
    }

    /**
     * Confirmer le paiement côté serveur
     */
    public function confirmPayment(string $paymentIntentId, Order $order): Payment
    {
        try {
            $paymentIntent = PaymentIntent::retrieve($paymentIntentId);

            if ($paymentIntent->status !== 'succeeded') {
                throw new \Exception("Le paiement n'a pas été complété. Statut: {$paymentIntent->status}");
            }

            // Créer ou mettre à jour le paiement
            $payment = Payment::create([
                'order_id' => $order->id,
                'payment_method' => 'stripe',
                'transaction_id' => $paymentIntent->id,
                'amount' => $order->total,
                'status' => 'completed',
                'paid_at' => now(),
                'metadata' => [
                    'stripe_charge_id' => $paymentIntent->charges->data[0]->id ?? null,
                    'payment_method_id' => $paymentIntent->payment_method,
                ],
            ]);

            // Mettre à jour le statut de la commande
            $order->update(['status' => 'completed']);

            // Décrémenter le stock pour chaque article
            foreach ($order->items as $item) {
                if ($item->product) {
                    $item->product->decrement('stock', $item->quantity);
                }
            }

            // Créer une facture
            $invoiceService = new InvoiceService();
            $invoiceService->createInvoice($order);

            return $payment;
        } catch (ApiErrorException $e) {
            throw new \Exception("Erreur Stripe: " . $e->getMessage());
        }
    }

    /**
     * Récupérer les détails d'un PaymentIntent
     */
    public function getPaymentIntent(string $paymentIntentId): PaymentIntent
    {
        return PaymentIntent::retrieve($paymentIntentId);
    }

    /**
     * Annuler une intention de paiement
     */
    public function cancelPaymentIntent(string $paymentIntentId): PaymentIntent
    {
        return PaymentIntent::retrieve($paymentIntentId)->cancel();
    }
}
