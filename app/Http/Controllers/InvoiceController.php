<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Services\InvoiceService;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    protected $invoiceService;

    public function __construct(InvoiceService $invoiceService)
    {
        $this->invoiceService = $invoiceService;
    }

    /**
     * Afficher la facture
     */
    public function show(Invoice $invoice)
    {
        $invoice->load('order.items.product');

        return Inertia::render('Invoice', [
            'invoice' => $invoice,
            'order' => $invoice->order,
        ]);
    }

    /**
     * Télécharger la facture en PDF
     */
    public function download(Invoice $invoice)
    {
        return $this->invoiceService->downloadInvoice($invoice);
    }
}
