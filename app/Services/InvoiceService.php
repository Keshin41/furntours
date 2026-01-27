<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;

class InvoiceService
{
    /**
     * Créer une facture pour une commande
     */
    public function createInvoice(Order $order): Invoice
    {
        // Charger les relations
        $order->load(['items.product', 'payments']);

        // Générer le numéro de facture unique
        $invoiceNumber = 'INV-' . date('Y') . '-' . str_pad($order->id, 5, '0', STR_PAD_LEFT);

        // Générer le PDF
        $pdf = Pdf::loadView('invoices.template', [
            'order' => $order,
            'invoiceNumber' => $invoiceNumber,
            'issuedAt' => now(),
        ]);

        // Créer le dossier s'il n'existe pas
        if (!is_dir(storage_path('app/invoices'))) {
            mkdir(storage_path('app/invoices'), 0755, true);
        }

        // Sauvegarder le PDF
        $fileName = 'invoice-' . $order->id . '-' . time() . '.pdf';
        $pdfPath = 'invoices/' . $fileName;
        $pdf->save(storage_path('app/' . $pdfPath));

        // Créer l'enregistrement de facture
        $invoice = Invoice::create([
            'order_id' => $order->id,
            'invoice_number' => $invoiceNumber,
            'pdf_path' => $pdfPath,
            'issued_at' => now(),
        ]);

        return $invoice;
    }

    /**
     * Récupérer une facture par ID
     */
    public function getInvoice(int $invoiceId): ?Invoice
    {
        return Invoice::find($invoiceId);
    }

    /**
     * Récupérer une facture par Order
     */
    public function getInvoiceByOrder(Order $order): ?Invoice
    {
        return Invoice::where('order_id', $order->id)->first();
    }

    /**
     * Télécharger une facture
     */
    public function downloadInvoice(Invoice $invoice): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        $filePath = storage_path('app/' . $invoice->pdf_path);

        if (!file_exists($filePath)) {
            throw new \Exception("Le fichier de facture n'existe pas");
        }

        return response()->download($filePath, $invoice->invoice_number . '.pdf');
    }
}
