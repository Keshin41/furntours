<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture {{ $invoiceNumber }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #2c3e50;
            background: white;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 900px;
            margin: 0;
            background: white;
            padding: 40px 40px 180px 40px;
        }

        .page-break-margin {
            margin-top: 60px;
        }

        header {
            width: 100%;
            margin-bottom: 40px;
            border-bottom: 3px solid #27CFEA;
            padding-bottom: 30px;
        }

        .company-info {
            width: 60%;
            float: left;
        }

        .logo {
            width: 80px;
            height: 80px;
            float: left;
            margin-right: 15px;
            border-radius: 50%;
            overflow: hidden;
            background: white;
            border: 3px solid #FFE97D;
            box-shadow: 0 0 0 2px #27CFEA;
        }

        .logo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .company-details {
            padding-top: 15px;
            margin-left: 100px;
        }

        .company-details h1 {
            margin: 0;
            color: #27CFEA;
            font-size: 28px;
            font-weight: 700;
        }

        .company-details p {
            margin: 5px 0 0 0;
            font-size: 12px;
            color: #666;
            font-style: italic;
        }

        .invoice-info {
            width: 38%;
            float: right;
            text-align: right;
        }

        .clearfix::after {
            content: "";
            display: table;
            clear: both;
        }

        .invoice-info p {
            margin: 8px 0;
            font-size: 13px;
            line-height: 1.5;
        }

        .invoice-number {
            font-size: 16px;
            font-weight: bold;
            color: #282a36;
            background: #FFE97D;
            padding: 8px 12px;
            border-radius: 4px;
            display: inline-block;
            margin-bottom: 10px;
            border-left: 4px solid #27CFEA;
        }

        section {
            margin-bottom: 30px;
        }

        .section-title {
            font-weight: 700;
            font-size: 12px;
            color: #27CFEA;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 3px solid #FFE97D;
            padding-left: 8px;
            border-left: 3px solid #27CFEA;
        }

        .info-row {
            width: 100%;
            margin-bottom: 30px;
        }

        .info-block {
            width: 48%;
            float: left;
            margin-right: 4%;
        }

        .info-block:last-child {
            margin-right: 0;
        }

        .billing-info, .customer-info {
            font-size: 13px;
            line-height: 1.8;
        }

        .billing-info p, .customer-info p {
            margin: 5px 0;
        }

        .billing-info strong, .customer-info strong {
            color: #27CFEA;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            margin-bottom: 20px;
            margin-top: 40px;
        }

        thead {
            display: table-header-group;
        }

        tbody tr {
            page-break-inside: avoid;
        }

        th {
            background: #27CFEA;
            border-right: 1px solid #80DCFA;
            color: #282a36;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }

        td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
        }

        tbody tr:nth-child(even) {
            background: #f9fafb;
        }

        tbody tr:hover {
            background: #f3f4f6;
        }

        td.right {
            text-align: right;
        }

        .summary {
            width: 100%;
            text-align: right;
            margin-top: 40px;
        }

        .summary-box {
            width: 280px;
            display: inline-block;
            text-align: left;
            background: #f9fafb;
            border: 2px solid #80DCFA;
            border-top: 3px solid #FFE97D;
            border-radius: 8px;
            padding: 20px;
        }

        .summary-line {
            width: 100%;
            margin-bottom: 12px;
            font-size: 13px;
        }

        .summary-line span:first-child {
            float: left;
        }

        .summary-line span:last-child {
            float: right;
            text-align: right;
            min-width: 80px;
        }

        .summary-total {
            border-top: 2px solid #27CFEA;
            padding-top: 12px;
            margin-top: 12px;
            font-weight: 700;
            font-size: 16px;
            color: #27CFEA;
        }

        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            border-top: 2px solid #e5e7eb;
            padding: 20px 40px;
            text-align: center;
            font-size: 11px;
            color: #6b7280;
            line-height: 1.8;
        }

        .footer p {
            margin: 8px 0;
        }

        .break {
            page-break-after: always;
        }

        .paw-print {
            color: #27CFEA;
            opacity: 0.1;
            font-size: 80px;
            position: absolute;
            top: 10px;
            right: 20px;
            z-index: -1;
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="clearfix">
            <div class="company-info">
                <div class="logo">
                    <img src="/public/img/furntours-logo.png" alt="Fur'N'Tours">
                </div>
                <div class="company-details">
                    <h1>Fur'N'Tours</h1>
                    <p>Association Furry</p>
                </div>
            </div>
            <div class="invoice-info">
                <p class="invoice-number">{{ $invoiceNumber }}</p>
                <p><strong>Date d'émission :</strong><br>{{ $issuedAt->format('d/m/Y') }}</p>
            </div>
        </header>

        <div class="info-row clearfix">
            <div class="info-block">
                <div class="section-title">Facturé à</div>
                <div class="customer-info">
                    <p><strong>Nom:</strong> {{ $order->customer_name }}</p>
                    <p><strong>Email:</strong> {{ $order->customer_email }}</p>
                    <p><strong>Tel:</strong> {{ $order->customer_phone }}</p>
                    <p><strong>Adresse:</strong> {{ $order->shipping_address }}</p>
                </div>
            </div>

            <div class="info-block">
                <div class="section-title">Détails de la commande</div>
                <div class="billing-info">
                    <p><strong>Numéro :</strong> {{ $order->order_number }}</p>
                    <p><strong>Date :</strong> {{ $order->created_at->format('d/m/Y') }}</p>
                <p><strong>Statut :</strong> <span style="background: #80DCFA; color: #282a36; padding: 2px 8px; border-radius: 4px;">{{ ucfirst($order->status) }}</span></p>
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
                <div class="summary-line clearfix">
                    <span>Sous-total :</span>
                    <span>{{ number_format($order->total, 2, ',', ' ') }}€</span>
                </div>
                <div class="summary-line clearfix">
                    <span>Frais de port :</span>
                    <span>0,00€</span>
                </div>
                <div class="summary-line summary-total clearfix">
                    <span>Total TTC :</span>
                    <span>{{ number_format($order->total, 2, ',', ' ') }}€</span>
                </div>
            </div>
        </div>

        <div class="footer">
            <p><strong>Fur'N'Tours</strong></p>
            <p>Merci de votre soutien envers notre association !</p>
            <p style="margin-top: 15px; font-size: 10px;">
                <strong>Contact :</strong> contact@furbar.fr | 
                <strong>Telegram :</strong> https://telegram.furbar.fr | 
                <strong>Site :</strong> https://furbar.fr
            </p>
            <p style="margin-top: 10px; color: #9ca3af; font-size: 10px;">
                © 2026 Fur'N'Tours - Créée avec amour par la communauté furry de Tours
            </p>
        </div>
    </div>
</body>
</html>
