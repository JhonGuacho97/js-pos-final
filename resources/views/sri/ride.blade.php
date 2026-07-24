<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        @page {
            margin: 18px;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Helvetica', sans-serif;
            font-size: 9px;
            color: #222222;
            line-height: 1.35;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        .header-table td {
            vertical-align: top;
            padding: 4px 6px;
        }

        .box {
            border: 1px solid #d0d0d0;
            border-radius: 3px;
            padding: 8px;
        }

        .box-title {
            font-weight: bold;
            font-size: 9px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: #555;
            margin-bottom: 5px;
            border-bottom: 1px solid #e2e2e2;
            padding-bottom: 3px;
        }

        .logo-wrap {
            margin-bottom: 6px;
        }

        .logo-wrap img {
            max-width: 190px;
            max-height: 80px;
            object-fit: contain;
        }

        .emisor-name {
            font-size: 14px;
            font-weight: bold;
            color: #1a1a1a;
        }

        .emisor-razon {
            font-size: 8.5px;
            color: #666;
            margin-bottom: 3px;
        }

        .small {
            font-size: 8px;
            color: #555;
        }

        .ruc-badge {
            display: inline-block;
            font-size: 8.5px;
            font-weight: bold;
            color: #1a1a1a;
            margin-top: 3px;
        }

        .doc-box {
            border: 1.5px solid #333;
            border-radius: 3px;
            padding: 8px;
        }

        .doc-box .box-title {
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            color: #1a1a1a;
            text-align: center;
            border-bottom: 1px solid #ccc;
            margin-bottom: 6px;
        }

        .doc-box .label-line {
            font-size: 8px;
            color: #666;
            margin-top: 4px;
        }

        .doc-box .value-line {
            font-size: 9px;
            font-weight: bold;
            margin-bottom: 2px;
        }

        .clave-acceso {
            font-size: 7.5px;
            font-family: monospace;
            word-break: break-all;
            text-align: center;
            margin-top: 5px;
            background: #f7f7f7;
            padding: 4px;
            border-radius: 2px;
        }

        .detalle-table {
            margin-top: 4px;
        }

        .detalle-table th {
            background: #2c2c2c;
            color: #ffffff;
            border: 1px solid #2c2c2c;
            padding: 5px 4px;
            font-size: 8px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            text-align: left;
        }

        .detalle-table td {
            border: 1px solid #e0e0e0;
            padding: 4px;
            font-size: 8px;
        }

        .detalle-table tbody tr:nth-child(even) {
            background: #f9f9f9;
        }

        .totales-table td {
            padding: 3px 6px;
            font-size: 9px;
        }

        .totales-table .label {
            text-align: right;
            color: #555;
        }

        .totales-table .value {
            text-align: right;
            width: 80px;
            font-weight: bold;
        }

        .totales-table .total-row td {
            border-top: 1.5px solid #333;
            padding-top: 5px;
        }

        .totales-table .total-row .label {
            font-size: 11px;
            font-weight: bold;
            color: #1a1a1a;
        }

        .totales-table .total-row .value {
            font-size: 12px;
            color: #1a1a1a;
        }

        .footer-info {
            font-size: 7px;
            color: #888;
            margin-top: 12px;
            border-top: 1px solid #e2e2e2;
            padding-top: 5px;
            text-align: center;
        }

        .qr-cell {
            text-align: center;
            width: 110px;
        }

        .qr-cell img {
            border: 1px solid #e2e2e2;
            padding: 3px;
            border-radius: 3px;
        }
    </style>
</head>

<body>

    <table class="header-table">
        <tr>
            <td style="width: 50%;">
                @if (!empty($logoBase64))
                    <div class="logo-wrap">
                        <img src="{{ $logoBase64 }}" alt="Logo">
                    </div>
                @endif

                <div class="emisor-name">{{ $sri['nombre_comercial'] }}</div>

                @if (!empty($sri['nombre_comercial']) && $sri['nombre_comercial'] !== $sri['razon_social'])
                    <div class="emisor-razon">{{ $sri['razon_social'] }}</div>
                @endif

                <div class="ruc-badge">RUC: {{ $sri['ruc'] }}</div>

                <div class="small" style="margin-top:3px;">
                    {{ $sri['dir_matriz'] }}
                </div>

                <div class="small">
                    Obligado a llevar contabilidad: {{ $sri['obligado_contabilidad'] }}
                </div>
            </td>
            <td class="qr-cell" style="width: 26%;">
                <img src="{{ $qrBase64 }}" style="width: 90px; height: 90px;" />
            </td>
            <td style="width: 40%;">
                <div class="doc-box">
                    <div class="box-title">Factura</div>
                    <div class="label-line">N° de comprobante</div>
                    <div class="value-line">{{ $factura->numeroComprobante() }}</div>

                    <div class="label-line">Número de autorización</div>
                    <div class="small">{{ $factura->numeroAutorizacionRide() }}</div>

                    <div class="label-line">Fecha y hora de autorización</div>
                    <div class="small">{{ $factura->fecha_autorizacion?->format('d/m/Y H:i:s') ?? 'Pendiente' }}</div>

                    <table style="width:100%; margin-top:4px;">
                        <tr>
                            <td class="small" style="padding:0;">Ambiente: <strong>{{ ($sri['ambiente'] ?? config('sri.ambiente')) == 1 ? 'PRUEBAS' : 'PRODUCCIÓN' }}</strong></td>
                            <td class="small" style="padding:0; text-align:right;">Emisión: <strong>NORMAL</strong></td>
                        </tr>
                    </table>

                    <div class="label-line">Clave de acceso</div>
                    <div class="clave-acceso">{{ $factura->clave_acceso }}</div>
                </div>
            </td>
        </tr>
    </table>

    <br>

    <table>
        <tr>
            <td style="width: 100%;">
                <div class="box">
                    <div class="box-title">Datos del comprador</div>
                    <table style="width:100%;">
                        <tr>
                            <td style="width: 50%;">Razón Social / Nombres:
                                <strong>{{ $venta->customer->razonSocialSri() }}</strong></td>
                            <td>Identificación: <strong>{{ $venta->customer->identificacionSri() }}</strong></td>
                        </tr>
                        <tr>
                            <td>Fecha Emisión: {{ $factura->created_at->format('d/m/Y') }}</td>
                            <td>Dirección: {{ $venta->customer->address }}</td>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>
    </table>

    <br>

    <table class="detalle-table">
        <thead>
            <tr>
                <th style="width: 8%;">Cód.</th>
                <th style="width: 32%;">Descripción</th>
                <th style="width: 8%; text-align:right;">Cant.</th>
                <th style="width: 12%; text-align:right;">Precio Unit.</th>
                <th style="width: 10%; text-align:right;">Descuento</th>
                <th style="width: 12%; text-align:right;">% IVA</th>
                <th style="width: 18%; text-align:right;">Precio Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($venta->saleItems as $item)
                <tr>
                    <td>{{ $item->codigoPrincipalSri() }}</td>
                    <td>{{ $item->descripcionSri() }}</td>
                    <td style="text-align:right;">{{ number_format($item->quantity, 2) }}</td>
                    <td style="text-align:right;">${{ number_format($item->precioUnitarioSri(), 2) }}</td>
                    <td style="text-align:right;">${{ number_format($item->descuentoSri(), 2) }}</td>
                    <td style="text-align:right;">{{ number_format($item->tax_value ?: $venta->tax_rate, 0) }}%</td>
                    <td style="text-align:right;">${{ number_format($item->precioTotalSinImpuestoSri(), 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <br>

    <table>
        <tr>
            <td style="width: 55%; vertical-align: top;">
                <div class="box">
                    <div class="box-title">Información adicional</div>
                    <div>Email: {{ $venta->customer->email }}</div>
                    <div>Teléfono: {{ $venta->customer->phone }}</div>
                    <div>Forma de pago: {{ $formaPagoTexto }}</div>
                </div>
            </td>
            <td style="width: 45%; vertical-align: top;">
                <table class="totales-table" style="width:100%;">
                    <tr>
                        <td class="label">Subtotal sin impuestos</td>
                        <td class="value">${{ number_format($venta->subtotalSinIvaSri(), 2) }}</td>
                    </tr>
                    <tr>
                        <td class="label">Descuento</td>
                        <td class="value">${{ number_format($venta->discount ?? 0, 2) }}</td>
                    </tr>
                    <tr>
                        <td class="label">IVA {{ number_format($venta->tax_rate ?? 0, 0) }}%</td>
                        <td class="value">${{ number_format($venta->tax_amount ?? 0, 2) }}</td>
                    </tr>
                    <tr class="total-row">
                        <td class="label">Valor total</td>
                        <td class="value">${{ number_format($venta->grand_total ?? 0, 2) }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <div class="footer-info">
        Este documento es una representación impresa de un comprobante electrónico generado por el sistema.
        Documento autorizado mediante Resolución del SRI conforme a la ficha técnica de comprobantes electrónicos vigente.
    </div>

</body>

</html>