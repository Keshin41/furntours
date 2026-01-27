<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture {{ $invoiceNumber }}</title>
    <style>
        body {
            font-family: 'Helvetica', Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            border-bottom: 2px solid #1e40af;
            padding-bottom: 20px;
        }

        .company-info h1 {
            margin: 0;
            color: #1e40af;
            font-size: 32px;
        }

        .invoice-info {
            text-align: right;
        }

        .invoice-info p {
            margin: 5px 0;
            font-size: 13px;
        }

        .invoice-number {
            font-size: 14px;
            font-weight: bold;
            color: #1e40af;
        }

        section {
            margin-bottom: 30px;
        }

        .section-title {
            font-weight: bold;
            font-size: 13px;
            color: #1e40af;
            text-transform: uppercase;
            margin-bottom: 10px;
        }

        .billing-info, .customer-info {
            font-size: 12px;
            line-height: 1.6;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            margin-bottom: 20px;
        }

        th {
            background-color: #f0f0f0;
            padding: 10px;
            text-align: left;
            font-weight: bold;
            border-bottom: 1px solid #ddd;
            color: #1e40af;
        }

        td {
            padding: 10px;
            border-bottom: 1px solid #eee;
        }

        td.right {
            text-align: right;
        }

        .total-row {
            font-weight: bold;
        }

        .amount-total {
            font-size: 16px;
            color: #1e40af;
        }

        .summary {
            display: flex;
            justify-content: flex-end;
            margin-top: 30px;
        }

        .summary-box {
            width: 250px;
        }

        .summary-line {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 13px;
        }

        .summary-total {
            border-top: 2px solid #1e40af;
            padding-top: 10px;
            margin-top: 10px;
            font-weight: bold;
            font-size: 16px;
            color: #1e40af;
        }

        .footer {
            border-top: 1px solid #ddd;
            padding-top: 20px;
            margin-top: 40px;
            text-align: center;
            font-size: 11px;
            color: #666;
        }

        .break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="company-info">
                <h1>FurTours</h1>
                <p style="margin-top: 10px; font-size: 12px; color: #666;">
                    Votre partenaire en voyages animaliers
                </p>
            </div>
            <div class="invoice-info">
                <p class="invoice-number">{{ $invoiceNumber }}</p>
                <p><strong>Date :</strong> {{ $issuedAt->format('d/m/Y') }}</p>
                <p><strong>Échéance :</strong> {{ $issuedAt->addDays(30)->format('d/m/Y') }}</p>
            </div>
        </header>

        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
            <div style="flex: 1;">
                <div class="section-title">Facturé à</div>
                <div class="customer-info">
                    <p><strong>{{ $order->customer_name }}</strong></p>
                    <p>{{ $order->customer_email }}</p>
                    <p>{{ $order->customer_phone }}</p>
                    <p style="margin-top: 10px;">{{ $order->shipping_address }}</p>
                </div>
            </div>

            <div style="flex: 1;">
                <div class="section-title">Détails de la commande</div>
                <div class="billing-info">
                    <p><strong>Commande :</strong> {{ $order->order_number }}</p>
                    <p><strong>Date :</strong> {{ $order->created_at->format('d/m/Y') }}</p>
                    <p><strong>Statut :</strong> {{ ucfirst($order->status) }}</p>
                </div>
            </div>
        </div>

        <section>
            <div class="section-title">Articles</div>
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th class="right">Quantité</th>
                        <th class="right">Prix unitaire</th>
                        <th class="right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($order->items as $item)
                        <tr>
                            <td>{{ $item->name ?? $item->product?->name ?? 'Article #' . $item->product_id }}</td>
                            <td class="right">{{ $item->quantity }}</td>
                            <td class="right">{{ number_format($item->price, 2, ',', ' ') }}€</td>
                            <td class="right">{{ number_format($item->subtotal, 2, ',', ' ') }}€</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </section>

        <div class="summary">
            <div class="summary-box">
                <div class="summary-line">
                    <span>Sous-total :</span>
                    <span>{{ number_format($order->total, 2, ',', ' ') }}€</span>
                </div>
                <div class="summary-line">
                    <span>Frais de port :</span>
                    <span>0,00€</span>
                </div>
                <div class="summary-line summary-total">
                    <span>Total TTC :</span>
                    <span>{{ number_format($order->total, 2, ',', ' ') }}€</span>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>Merci pour votre achat ! Cette facture est valable dans nos registres.</p>
            <p>FurTours - Contact: contact@furtours.fr | Téléphone: +33 X XX XX XX XX</p>
        </div>
    </div>
</body>
</html>
