<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;

class InvoiceService
{
    /**
     * Générer le PDF de la facture
     */
    private function generatePdf(Order $order, string $invoiceNumber): string
    {
        // Charger les relations
        $order->load(['items.product', 'payments']);

        // Générer le PDF
        $pdf = Pdf::loadView('invoices.template', [
            'order' => $order,
            'invoiceNumber' => $invoiceNumber,
            'issuedAt' => now(),
        ]);

        // Créer le dossier s'il n'existe pas
        if (!is_dir(storage_path('app/private/invoices'))) {
            mkdir(storage_path('app/private/invoices'), 0755, true);
        }

        // Sauvegarder le PDF
        $fileName = 'invoice-' . $order->id . '-' . time() . '.pdf';
        $pdfPath = 'private/invoices/' . $fileName;
        $pdf->save(storage_path('app/' . $pdfPath));

        return $pdfPath;
    }

    /**
     * Créer une facture pour une commande
     */
    public function createInvoice(Order $order): Invoice
    {
        // Générer le numéro de facture unique
        $invoiceNumber = 'INV-' . date('Y') . '-' . str_pad($order->id, 5, '0', STR_PAD_LEFT);

        // Générer le PDF
        $pdfPath = $this->generatePdf($order, $invoiceNumber);

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
     * Récupérer une facture par Order (crée si elle n'existe pas)
     */
    public function getOrCreateInvoice(Order $order): Invoice
    {
        $invoice = Invoice::where('order_id', $order->id)->first();
        
        if (!$invoice) {
            $invoice = $this->createInvoice($order);
        }
        
        return $invoice;
    }

    /**
     * Télécharger une facture
     */
    public function downloadInvoice(Invoice $invoice): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        $filePath = storage_path('app/' . $invoice->pdf_path);

        // Si le fichier PDF n'existe pas, le régénérer sans créer de nouvel enregistrement
        if (!file_exists($filePath)) {
            $order = $invoice->order;
            $filePath = storage_path('app/' . $this->generatePdf($order, $invoice->invoice_number));

            // Mettre à jour le chemin du PDF dans la facture
            $invoice->pdf_path = str_replace(storage_path('app/'), '', $filePath);
            $invoice->save();
        }

        

        return response()->download($filePath, $invoice->invoice_number . '.pdf');
    }
}
