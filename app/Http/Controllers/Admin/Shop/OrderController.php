<?php

namespace App\Http\Controllers\Admin\Shop;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the orders.
     */
    public function index()
    {
        $orders = Order::withCount(['items', 'payments'])
            ->orderByDesc('created_at')
            ->limit(200)
            ->get();

        return Inertia::render('Admin/Shop/OrdersList', [
            'orders' => $orders,
        ]);
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order)
    {
        $order->load(['items.product', 'payments']);

        return Inertia::render('Admin/Shop/OrderShow', [
            'order' => $order,
        ]);
    }

    /**
     * Update the order status.
     */
    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,completed,cancelled',
        ]);

        $order->update($validated);

        return redirect()->back()->with('success', 'Statut de la commande mis à jour');
    }
}
