<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="theme-color" content="#ffffff">
    <meta name="description" content="Catálogo de {{ $store->name }}: revisa precios y tallas disponibles y haz tu pedido por WhatsApp.">
    <title>{{ $store->name }} · Catálogo</title>
    <link rel="icon" href="/favicon.ico">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    {{-- La fuente no bloquea el primer pintado: mientras llega se usa la del sistema. --}}
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Barlow:wght@400;500;600&display=swap" media="print" onload="this.media='all'">
    <style>html,body{margin:0;background:#eff3f7;color:#111827}</style>
</head>
<body>
    <div id="catalog-root"></div>
    <script>
        window.__ECUAPOS_CATALOG__ = {{ Illuminate\Support\Js::from([
            'slug' => $store->slug,
            'apiUrl' => url('/api/catalog/'.$store->slug),
            'orderUrl' => url('/catalogo/'.$store->slug.'/pedidos'),
            'data' => $data,
        ]) }};
    </script>
    <script src="{{ mix('js/catalog.js') }}"></script>
</body>
</html>
