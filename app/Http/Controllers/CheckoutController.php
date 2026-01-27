<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Services\StripePaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    /**
     * Affiche la page de checkout
     */
    public function show()
    {
        return Inertia::render('Checkout');
    }

    /**
     * Traite la soumission de la commande
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'postalCode' => 'required|string|max:20',
            'country' => 'required|string|max:2',
            'paymentMethod' => 'required|in:stripe,paypal',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|integer',
            'items.*.name' => 'required|string',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.quantity' => 'required|integer|min:1',
            'total' => 'required|numeric|min:0',
        ]);

        try {
            // Générer un numéro de commande unique
            $orderNumber = 'CMD-' . strtoupper(Str::random(8)) . '-' . time();

            // Créer la commande (sans user obligatoire, utiliser l'email)
            $order = Order::create([
                'user_id' => Auth::id(),
                'order_number' => $orderNumber,
                'customer_email' => $validated['email'],
                'customer_name' => trim($validated['firstName'].' '.$validated['lastName']),
                'customer_phone' => $validated['phone'],
                'shipping_address' => $validated['address'] . ', ' . $validated['postalCode'] . ' ' . $validated['city'] . ', ' . $validated['country'],
                'total' => $validated['total'],
                'status' => 'pending',
            ]);

            // Ajouter les articles de la commande
            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['id'],
                    'name' => $item['name'],
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'subtotal' => $item['price'] * $item['quantity'],
                ]);
            }

            // Créer une intention de paiement Stripe
            if ($validated['paymentMethod'] === 'stripe') {
                $stripeService = new StripePaymentService();
                $paymentIntent = $stripeService->createPaymentIntent($order, [
                    'customer_email' => $validated['email'],
                    'customer_name' => trim($validated['firstName'].' '.$validated['lastName']),
                ]);

                return Inertia::render('Payment', [
                    'order_id' => $order->id,
                    'client_secret' => $paymentIntent->client_secret,
                    'payment_intent_id' => $paymentIntent->id,
                    'amount' => $order->total,
                ]);
            }

            // PayPal ou autre méthode de paiement
            return redirect('/boutique/panier')->with('success', 'Commande créée avec succès');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Erreur lors de la création de la commande: ' . $e->getMessage()]);
        }
    }
}
