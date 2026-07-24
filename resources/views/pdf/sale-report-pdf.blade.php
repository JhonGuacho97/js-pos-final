<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "//www.w3.org/TR/html4/strict.dtd">
<html lang="en">

<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <title>Reporte de Ventas</title>
    <style>
        * {
            font-family: DejaVu Sans, Arial, "Helvetica", Arial, "Liberation Sans", sans-serif;
            box-sizing: border-box;
        }

        body {
            background: #ffffff;
            color: #374151;
            font-size: 13px;
            margin: 0;
            padding: 24px 32px;
        }

        /* ── Encabezado ── */
        .header-table {
            width: 100%;
            margin-bottom: 16px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 16px;
        }

        .report-title {
            font-size: 20px;
            font-weight: 700;
            color: #1f2937;
            text-align: center;
            margin: 0;
        }

        .report-subtitle {
            font-size: 11px;
            color: #6b7280;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin: 4px 0 0;
        }

        .meta-label {
            font-size: 11px;
            font-weight: 700;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            padding: 3px 6px 3px 0;
        }

        .meta-value {
            font-size: 12px;
            color: #374151;
            padding: 3px 0;
        }

        /* ── Filtros aplicados ── */
        .filters-bar {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            padding: 8px 14px;
            margin-bottom: 20px;
            font-size: 12px;
            color: #6b7280;
        }

        .filters-bar strong {
            color: #1f2937;
        }

        /* ── Badges ── */
        .badge-paid, .badge-completed {
            background: #f3f4f6;
            color: #1f2937;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 8px;
        }

        .badge-unpaid {
            background: #f3f4f6;
            color: #1f2937;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 8px;
        }

        .badge-partial, .badge-pending {
            background: #f3f4f6;
            color: #1f2937;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 8px;
        }

        /* ── Tabla de ventas ── */
        .products-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .products-table thead tr {
            background: #1f2937;
        }

        .products-table thead th {
            color: #ffffff;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 8px 8px;
            text-align: center;
        }

        .products-table thead th:first-child {
            text-align: left;
        }

        .products-table tbody tr {
            border-bottom: 1px solid #e5e7eb;
        }

        .products-table tbody tr:nth-child(even) {
            background: #f9fafb;
        }

        .products-table tbody tr:nth-child(odd) {
            background: #ffffff;
        }

        .products-table tbody td {
            padding: 7px 8px;
            font-size: 11px;
            color: #374151;
            text-align: center;
        }

        .products-table tbody td:first-child {
            text-align: left;
            font-weight: 600;
            color: #1f2937;
        }

        /* ── Tabla totales ── */
        .totals-table {
            width: 55%;
            border-collapse: collapse;
            margin-left: auto;
            border: 1px solid #e5e7eb;
        }

        .totals-table tbody tr {
            border-bottom: 1px solid #e5e7eb;
        }

        .totals-table tbody tr:last-child {
            background: #1f2937;
            border-bottom: none;
        }

        .totals-table tbody tr:last-child td {
            color: #ffffff !important;
            font-weight: 700 !important;
            font-size: 13px !important;
        }

        .totals-table tbody td {
            padding: 8px 14px;
            font-size: 12px;
            color: #374151;
        }

        .totals-table tbody td:first-child {
            font-weight: 600;
            color: #6b7280;
            background: #f9fafb;
            width: 60%;
        }

        .totals-table tbody td:last-child {
            text-align: right;
            font-weight: 600;
            color: #1f2937;
        }

        /* ── Footer ── */
        .pdf-footer {
            margin-top: 24px;
            border-top: 1px solid #e5e7eb;
            padding-top: 12px;
            text-align: center;
            font-size: 11px;
            color: #6b7280;
        }
    </style>
</head>

<body>

    {{-- ── ENCABEZADO ── --}}
    <table class="header-table" cellpadding="0" cellspacing="0">
        <tr>
            <td width="25%">
                <p style="font-size:16px;font-weight:700;color:#1f2937;margin:0;">
                    {{ getSettingValue('company_name') }}
                </p>
            </td>
            <td width="50%" align="center">
                <p class="report-title">Reporte de Ventas</p>
                <p class="report-subtitle">
                    {{ \Carbon\Carbon::now()->format('Y-m-d H:i') }}
                </p>
            </td>
            <td width="25%" align="right">
                <table cellpadding="0" cellspacing="0" align="right">
                    <tr>
                        <td class="meta-label">{{ __('messages.pdf.date') }}:</td>
                        <td class="meta-value">{{ \Carbon\Carbon::now()->format('Y-m-d') }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    {{-- ── FILTROS APLICADOS ── --}}
    @if($filters['warehouse'] || $filters['start_date'])
        <div class="filters-bar">
            @if($filters['warehouse'])
                {{ __('messages.pdf.warehouse') }}: <strong>{{ $filters['warehouse'] }}</strong>
            @endif
            @if($filters['warehouse'] && $filters['start_date'])
                &nbsp;·&nbsp;
            @endif
            @if($filters['start_date'])
                Período:
                <strong>{{ $filters['start_date'] }} &rarr; {{ $filters['end_date'] }}</strong>
            @endif
        </div>
    @endif

    {{-- ── TABLA DE VENTAS ── --}}
    <table class="products-table" cellpadding="0" cellspacing="0">
        <thead>
            <tr>
                <th style="text-align:left;">{{ __('messages.pdf.reference') }}</th>
                <th>{{ __('messages.pdf.client') }}</th>
                <th>{{ __('messages.pdf.warehouse') }}</th>
                <th>{{ __('messages.pdf.status') }}</th>
                <th>{{ __('messages.pdf.total') }}</th>
                <th>{{ __('messages.pdf.paid') }}</th>
                <th>{{ __('messages.pdf.payment_status') }}</th>
            </tr>
        </thead>
        <tbody>
            @foreach($sales as $sale)
                <tr>
                    <td>{{ $sale->reference_code }}</td>
                    <td>{{ $sale->customer->name ?? 'N/A' }}</td>
                    <td>{{ $sale->warehouse->name ?? 'N/A' }}</td>
                    <td>
                        @if($sale->status == \App\Models\Sale::COMPLETED)
                            <span class="badge-completed">Completado</span>
                        @elseif($sale->status == \App\Models\Sale::PENDING)
                            <span class="badge-pending">Pendiente</span>
                        @else
                            <span class="badge-pending">Ordenado</span>
                        @endif
                    </td>
                    <td>{{ currencyAlignment(number_format((float) $sale->grand_total, 2)) }}</td>
                    <td>{{ currencyAlignment(number_format((float) $sale->payments->sum('amount'), 2)) }}</td>
                    <td>
                        @if($sale->payment_status == \App\Models\Sale::PAID)
                            <span class="badge-paid">Pagado</span>
                        @elseif($sale->payment_status == \App\Models\Sale::UNPAID)
                            <span class="badge-unpaid">No pagado</span>
                        @else
                            <span class="badge-partial">Parcial</span>
                        @endif
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    {{-- ── TOTALES ── --}}
    <table class="totals-table" cellpadding="0" cellspacing="0">
        <tbody>
            <tr>
                <td>Cantidad de ventas</td>
                <td>{{ $totals['count'] }}</td>
            </tr>
            <tr>
                <td>{{ __('messages.pdf.paid') }}</td>
                <td>{{ currencyAlignment(number_format($totals['paid_amount'], 2)) }}</td>
            </tr>
            <tr>
                <td>{{ __('messages.pdf.total') }}</td>
                <td>{{ currencyAlignment(number_format($totals['grand_total'], 2)) }}</td>
            </tr>
        </tbody>
    </table>

    {{-- ── FOOTER ── --}}
    <div class="pdf-footer">
        {{ getSettingValue('company_name') }} &nbsp;·&nbsp;
        Reporte de Ventas &nbsp;·&nbsp;
        {{ \Carbon\Carbon::now()->format('Y-m-d H:i') }}
    </div>

</body>
</html>
