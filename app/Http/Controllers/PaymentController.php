<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use App\Services\StripePaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    protected $stripeService;

    public function __construct(StripePaymentService $stripeService)
    {
        $this->stripeService = $stripeService;
    }

    /**
     * Créer une intention de paiement
     */
    public function createPaymentIntent(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
        ]);

        try {
            $order = Order::findOrFail($validated['order_id']);

            // Vérifier que ce n'est pas un paiement déjà effectué
            if ($order->status === 'completed') {
                return response()->json(['error' => 'Cette commande a déjà été payée'], 400);
            }

            $paymentIntent = $this->stripeService->createPaymentIntent($order);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
                'paymentIntentId' => $paymentIntent->id,
                'amount' => $order->total,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Confirmer le paiement après complétion côté client
     */
    public function confirmPayment(Request $request)
    {
        Log::info('Payment confirmation request', $request->all());

        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'payment_intent_id' => 'required|string',
        ]);

        try {
            $order = Order::findOrFail($validated['order_id']);

            Log::info('Order found', ['order_id' => $order->id, 'status' => $order->status]);

            if ($order->status === 'completed') {
                return response()->json(['success' => false, 'error' => 'Cette commande a déjà été payée'], 400);
            }

            $payment = $this->stripeService->confirmPayment($validated['payment_intent_id'], $order);

            Log::info('Payment confirmed', ['payment_id' => $payment->id]);

            // Récupérer la facture créée
            $invoice = $order->invoice;

            return response()->json([
                'success' => true,
                'message' => 'Paiement confirmé avec succès',
                'payment' => $payment,
                'order_number' => $order->order_number,
                'invoice_id' => $invoice?->id,
            ]);
        } catch (\Exception $e) {
            Log::error('Payment confirmation error', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Webhook pour les événements Stripe
     */
    public function handleWebhook(Request $request)
    {
        $payload = @file_get_contents('php://input');
        $sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';
        $endpoint_secret = config('services.stripe.webhook_secret');

        try {
            $event = \Stripe\Webhook::constructEvent($payload, $sig_header, $endpoint_secret);
        } catch (\UnexpectedValueException $e) {
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature'], 403);
        }

        // Traiter les événements
        switch ($event->type) {
            case 'payment_intent.succeeded':
                $paymentIntent = $event->data->object;
                $orderId = $paymentIntent->metadata->order_id ?? null;

                if ($orderId) {
                    $order = Order::find($orderId);
                    if ($order && $order->status !== 'completed') {
                        $order->update(['status' => 'completed']);
                        Payment::create([
                            'order_id' => $order->id,
                            'payment_method' => 'stripe',
                            'transaction_id' => $paymentIntent->id,
                            'amount' => $order->total,
                            'status' => 'completed',
                            'paid_at' => now(),
                        ]);

                        // Décrémenter le stock pour chaque article
                        foreach ($order->items as $item) {
                            if ($item->product) {
                                $item->product->decrement('stock', $item->quantity);
                            }
                        }

                        // Créer une facture
                        $invoiceService = new \App\Services\InvoiceService();
                        $invoiceService->createInvoice($order);
                    }
                }
                break;

            case 'payment_intent.payment_failed':
                $paymentIntent = $event->data->object;
                $orderId = $paymentIntent->metadata->order_id ?? null;

                if ($orderId) {
                    $order = Order::find($orderId);
                    if ($order) {
                        $order->update(['status' => 'cancelled']);
                    }
                }
                break;
        }

        return response()->json(['success' => true]);
    }
}
