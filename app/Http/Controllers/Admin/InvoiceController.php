<?php

namespace App\Http\Controllers\Admin;

use App\Models\Invoice;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    /**
     * Afficher la liste des factures
     */
    public function index()
    {
        $invoices = Invoice::with(['order' => function ($query) {
            $query->select('id', 'order_number', 'customer_name', 'total', 'status', 'created_at');
        }])
            ->orderByDesc('issued_at')
            ->limit(200)
            ->get();

        return Inertia::render('Admin/Invoices/InvoicesList', [
            'invoices' => $invoices,
        ]);
    }

    /**
     * Afficher une facture
     */
    public function show(Invoice $invoice)
    {
        $invoice->load('order.items.product');

        return Inertia::render('Admin/Invoices/InvoiceShow', [
            'invoice' => $invoice,
            'order' => $invoice->order,
        ]);
    }
}
