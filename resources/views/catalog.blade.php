<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="theme-color" content="#155eef">
    <meta name="description" content="Catálogo virtual de {{ $store->name }}">
    <title>{{ $store->name }} · Catálogo</title>
    <link rel="icon" href="/favicon.ico">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
</head>
<body>
    <div id="catalog-root"></div>
    <script>
        window.__ECUAPOS_CATALOG__ = {{ Illuminate\Support\Js::from([
            'slug' => $store->slug,
            'apiUrl' => url('/api/catalog/'.$store->slug),
            'accountUrl' => url('/catalogo/'.$store->slug.'/cuenta'),
            'orderUrl' => url('/catalogo/'.$store->slug.'/pedidos'),
        ]) }};
    </script>
    <script src="{{ mix('js/catalog.js') }}"></script>
</body>
</html>
