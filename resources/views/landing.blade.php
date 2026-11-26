@php
    $g = $content['general'];
    $active = fn ($items) => collect($items)->where('is_active', true);
    $loginUrl = route('app').'#/login';
    $registerUrl = route('app').'#/crear-cuenta';
    $dashboardUrl = route('app').'#/app/dashboard';
    $whatsappNumber = preg_replace('/\D/', '', (string) ($g['whatsapp'] ?? ''));
    $whatsappUrl = $whatsappNumber ? 'https://wa.me/'.$whatsappNumber.'?text='.rawurlencode('Hola, quiero información sobre EcuaPOS.') : null;
    $money = fn ($value) => '$'.number_format((float) $value, 2, ',', '.');
    $intervalLabel = fn ($plan) => match ($plan->billing_interval) {
        'yearly' => 'año', 'weekly' => 'semana', default => 'mes',
    };
    $limit = function ($value, string $singular, string $plural) {
        if (! $value) return ucfirst($plural).' ilimitados';
        return $value.' '.((int) $value === 1 ? $singular : $plural);
    };
    $docsLine = function ($plan) {
        if (! $plan->max_electronic_documents) return 'Comprobantes electrónicos ilimitados';
        $per = match ($plan->billing_interval) { 'yearly' => 'al año', 'weekly' => 'a la semana', default => 'al mes' };
        return $plan->max_electronic_documents.' comprobantes electrónicos '.$per;
    };
    $services = $active($content['services']);
    $benefits = $active($content['benefits']);
    $steps = $active($content['steps']);

    // Íconos de trazo (24×24). Las claves coinciden con el campo "icon" del CMS.
    $paths = [
        'cart' => '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
        'invoice' => '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
        'boxes' => '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
        'wallet' => '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
        'chart' => '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
        'store' => '<path d="M3 9 4.5 4h15L21 9"/><path d="M3 9h18v1.5a2.5 2.5 0 0 1-4.5 1.5 2.5 2.5 0 0 1-4.5 0 2.5 2.5 0 0 1-4.5 0A2.5 2.5 0 0 1 3 10.5Z"/><path d="M5 12.5V20h14v-7.5"/><path d="M10 20v-4h4v4"/>',
        'ecuador' => '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>',
        'sync' => '<path d="M12 20h.01"/><path d="M8.5 16.43a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 4.17-2.65"/><path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76"/><path d="M16.85 11.25a10 10 0 0 1 2.22 1.68"/><path d="M5 13a10 10 0 0 1 5.24-2.76"/><path d="m2 2 20 20"/>',
        'growth' => '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
        'support' => '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
        'mail' => '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
        'check' => '<path d="M20 6 9 17l-5-5"/>',
        'badge' => '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>',
        'unlock' => '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
        'scan' => '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 7v10"/><path d="M12 7v10"/><path d="M17 7v10"/>',
        'truck' => '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
        'calculator' => '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M8 6h8"/><path d="M16 14v4"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/>',
        'arrow' => '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
        'search' => '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
        'gift' => '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
    ];
    $icon = fn (string $name, string $class = 'lp-ico') => '<svg class="'.$class.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'.($paths[$name] ?? $paths['check']).'</svg>';

    $day = [
        ['08:00', 'unlock', 'Abres caja', 'Cada cajero entra con su usuario y su base del día.'],
        ['10:12', 'scan', 'Vendes $28,58', 'Escaneas, cobras en efectivo o transferencia y entregas el ticket.'],
        ['10:12', 'badge', 'El SRI la autoriza', 'El RIDE le llega al cliente por correo. Si el SRI no responde, se reintenta solo.'],
        ['13:40', 'sync', 'Se va el internet', 'Sigues vendiendo. Las ventas se envían cuando vuelve la conexión.'],
        ['17:30', 'truck', 'Llega mercadería', 'Registras la compra y el stock de esa bodega se actualiza.'],
        ['19:00', 'calculator', 'Cierras caja', 'Ves cuánto debe haber en efectivo y transferencias, y quién hizo cada movimiento.'],
    ];
@endphp
<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $g['meta_title'] }}</title>
    <meta name="description" content="{{ $g['meta_description'] }}">
    <meta name="theme-color" content="#155eef">
    <meta name="color-scheme" content="light">
    <link rel="icon" type="image/png" href="/images/pwa/ecuapos-favicon.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Schibsted+Grotesk:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/landing.css') }}?v=5">
    <script>try{if(localStorage.getItem('auth_token'))document.documentElement.classList.add('lp-has-session')}catch(e){}</script>
</head>
<body data-app-url="{{ route('app') }}" data-register-url="{{ $registerUrl }}">
    <header class="lp-header" id="inicio">
        <nav class="lp-nav lp-wrap" aria-label="Principal">
            <a class="lp-brand" href="#inicio"><img src="/images/ecua-pos-logo.png" alt="" width="32" height="32"><span>{{ $g['brand_name'] }}</span></a>
            <button class="lp-menu" type="button" aria-label="Abrir menú" aria-expanded="false"><i></i><i></i></button>
            <div class="lp-nav-links">
                <a href="#dia">Cómo funciona</a>
                <a href="#sri">Facturación SRI</a>
                <a href="#planes">Precios</a>
                <a href="#preguntas">Preguntas</a>
                <a class="lp-nav-login" href="{{ $loginUrl }}" data-auth-guest>Iniciar sesión</a>
                <a class="lp-nav-login" href="{{ $dashboardUrl }}" data-auth-user>Ir al sistema</a>
            </div>
            <div class="lp-nav-actions">
                <a class="lp-link" href="{{ $loginUrl }}" data-auth-guest>Iniciar sesión</a>
                <a class="lp-btn lp-btn--sm" href="{{ $registerUrl }}" data-auth-guest>Probar 14 días</a>
                <a class="lp-btn lp-btn--sm" href="{{ $dashboardUrl }}" data-auth-user>Ir al sistema</a>
            </div>
        </nav>
    </header>

    <main>
        {{-- Portada: mensaje concreto y, a la derecha, la pantalla de caja. --}}
        <section class="lp-hero">
            <div class="lp-wrap lp-hero-grid">
                <div class="lp-hero-copy">
                    <p class="lp-pill"><span class="lp-pill-dot"></span>{{ $g['eyebrow'] }}</p>
                    <h1>{{ $g['hero_title'] }}</h1>
                    <p class="lp-lede">{{ $g['hero_description'] }}</p>
                    <div class="lp-actions">
                        <a class="lp-btn lp-btn--lg" href="{{ $registerUrl }}" data-auth-cta data-auth-label="Ir al sistema">{{ $g['hero_primary_label'] }} {!! $icon('arrow', 'lp-ico lp-ico--sm') !!}</a>
                        @if($whatsappUrl)
                        <a class="lp-btn lp-btn--lg lp-btn--white" href="{{ $whatsappUrl }}" target="_blank" rel="noopener">{!! $icon('support', 'lp-ico lp-ico--sm lp-ico--wa') !!} {{ $g['hero_secondary_label'] }}</a>
                        @endif
                    </div>
                    <ul class="lp-hero-facts">
                        <li>{!! $icon('check', 'lp-ico lp-ico--xs') !!} {{ $g['announcement'] }}</li>
                        <li>{!! $icon('check', 'lp-ico lp-ico--xs') !!} Ficha técnica SRI 2.34</li>
                        <li>{!! $icon('check', 'lp-ico lp-ico--xs') !!} Funciona sin internet</li>
                    </ul>
                </div>

                <div class="lp-hero-visual">
                    @if($g['hero_image'])
                        <img class="lp-hero-upload" src="{{ $g['hero_image'] }}" alt="Pantalla de EcuaPOS">
                    @else
                    <div class="lp-app" role="img" aria-label="Pantalla de caja de EcuaPOS con una venta de $28,58">
                        <div class="lp-app-bar">
                            <span class="lp-app-dots"><i></i><i></i><i></i></span>
                            <span>Caja 1 · Ana</span>
                            <span class="lp-app-online">En línea</span>
                        </div>
                        <div class="lp-app-body">
                            <div class="lp-app-products">
                                <div class="lp-app-search">{!! $icon('search', 'lp-ico lp-ico--xs') !!} Buscar o escanear código</div>
                                <div class="lp-app-chips"><b>Todos</b><span>Construcción</span><span>Eléctricos</span><span>Plomería</span></div>
                                <div class="lp-app-grid">
                                    @foreach([['Cemento gris 50 kg', '8,90', 'c1'], ['Tubo PVC ½" 6 m', '4,35', 'c2'], ['Cinta aislante', '0,90', 'c3'], ['Foco LED 12 W', '2,10', 'c4'], ['Llave de paso ½"', '6,80', 'c5'], ['Silicón transparente', '3,25', 'c6']] as [$name, $price, $tone])
                                    <div class="lp-app-tile"><i class="{{ $tone }}"></i><span>{{ $name }}</span><b>${{ $price }}</b></div>
                                    @endforeach
                                </div>
                            </div>
                            <div class="lp-app-cart">
                                <strong>Venta actual</strong>
                                <ul>
                                    <li><span><em>2</em> Cemento gris 50 kg</span><b>17,80</b></li>
                                    <li><span><em>1</em> Tubo PVC ½" 6 m</span><b>4,35</b></li>
                                    <li><span><em>3</em> Cinta aislante</span><b>2,70</b></li>
                                </ul>
                                <dl>
                                    <div><dt>Subtotal 15 %</dt><dd>24,85</dd></div>
                                    <div><dt>IVA 15 %</dt><dd>3,73</dd></div>
                                    <div class="lp-app-total"><dt>Total</dt><dd>$28,58</dd></div>
                                </dl>
                                <span class="lp-app-pay">Cobrar $28,58</span>
                            </div>
                        </div>
                    </div>
                    <div class="lp-toast" aria-hidden="true">
                        {!! $icon('badge', 'lp-ico lp-toast-ico') !!}
                        <div><strong>Factura autorizada por el SRI</strong><span>001-001-000004127 · RIDE enviado al cliente</span></div>
                    </div>
                    @endif
                </div>
            </div>
        </section>

        {{-- Ventajas cortas, justo debajo de la portada. --}}
        @if($benefits->isNotEmpty())
        <section class="lp-strip" aria-label="{{ $g['benefits_title'] }}">
            <div class="lp-wrap lp-strip-grid">
                @foreach($benefits as $benefit)
                <article>
                    <span class="lp-ico-box">{!! $icon($benefit['icon'] ?? 'check') !!}</span>
                    <div><h3>{{ $benefit['title'] }}</h3><p>{{ $benefit['description'] }}</p></div>
                </article>
                @endforeach
            </div>
        </section>
        @endif

        {{-- Un día normal en caja: lo que el sistema hace, con horas. --}}
        <section class="lp-section" id="dia">
            <div class="lp-wrap">
                <div class="lp-head lp-head--center">
                    <p class="lp-kicker">Cómo funciona</p>
                    <h2>Un día en caja con EcuaPOS</h2>
                    <p>Desde que abres hasta que cierras el local.</p>
                </div>
                <ol class="lp-day">
                    @foreach($day as [$time, $ico, $title, $text])
                    <li>
                        <div class="lp-day-top"><span class="lp-ico-box">{!! $icon($ico) !!}</span><time>{{ $time }}</time></div>
                        <h3>{{ $title }}</h3>
                        <p>{{ $text }}</p>
                    </li>
                    @endforeach
                </ol>
            </div>
        </section>

        {{-- Facturación electrónica: lo que cumple, en términos del SRI. --}}
        <section class="lp-sri" id="sri">
            <div class="lp-wrap lp-sri-grid">
                <div>
                    <p class="lp-kicker lp-kicker--light">Facturación electrónica</p>
                    <h2>Al día con la ficha técnica del SRI</h2>
                    <p class="lp-sri-lede">Versión 2.34 de comprobantes electrónicos. Tú vendes; la firma, el envío y la autorización los hace EcuaPOS.</p>
                    <ul class="lp-checks">
                        <li>{!! $icon('check', 'lp-ico lp-ico--xs') !!} Facturas, notas de crédito y de débito con tu firma .p12</li>
                        <li>{!! $icon('check', 'lp-ico lp-ico--xs') !!} IVA 0 %, 5 % y 15 % y formas de pago de la Tabla 24</li>
                        <li>{!! $icon('check', 'lp-ico lp-ico--xs') !!} Leyenda RIMPE en el XML y en el RIDE</li>
                        <li>{!! $icon('check', 'lp-ico lp-ico--xs') !!} Aviso al facturar a consumidor final más de $50</li>
                        <li>{!! $icon('check', 'lp-ico lp-ico--xs') !!} Secuenciales por establecimiento y punto de emisión</li>
                        <li>{!! $icon('check', 'lp-ico lp-ico--xs') !!} Reintento automático si el SRI no responde</li>
                    </ul>
                </div>
                <div class="lp-sri-log" aria-label="Ejemplo de comprobantes del día">
                    <div class="lp-sri-log-head"><strong>Comprobantes de hoy</strong><span>5 emitidos</span></div>
                    @foreach([['FAC', '001-001-000004127', 'ok'], ['FAC', '001-001-000004126', 'ok'], ['NC', '001-001-000000213', 'ok'], ['FAC', '001-001-000004125', 'wait'], ['FAC', '001-001-000004124', 'ok']] as [$type, $number, $state])
                    <div class="lp-sri-row">
                        <span class="lp-doc-type">{{ $type }}</span>
                        <span class="lp-doc-num">{{ $number }}</span>
                        <b class="lp-status lp-status--{{ $state }}">{{ $state === 'ok' ? 'Autorizada' : 'Reintentando' }}</b>
                    </div>
                    @endforeach
                </div>
            </div>
        </section>

        {{-- Módulos (editables desde el CMS). --}}
        @if($services->isNotEmpty())
        <section class="lp-section" id="funcionalidades">
            <div class="lp-wrap">
                <div class="lp-head lp-head--center">
                    <p class="lp-kicker">Módulos</p>
                    <h2>{{ $g['services_title'] }}</h2>
                    <p>{{ $g['services_description'] }}</p>
                </div>
                <div class="lp-modules">
                    @foreach($services as $service)
                    <article>
                        <span class="lp-ico-box lp-ico-box--solid">{!! $icon($service['icon'] ?? 'check') !!}</span>
                        <h3>{{ $service['title'] }}</h3>
                        <p>{{ $service['description'] }}</p>
                    </article>
                    @endforeach
                </div>
            </div>
        </section>
        @endif

        @if($active($content['partners'])->isNotEmpty())
        <section class="lp-partners lp-wrap" aria-label="Negocios que usan EcuaPOS">
            @foreach($active($content['partners']) as $partner)
            <figure>@if($partner['image'] ?? null)<img src="{{ $partner['image'] }}" alt="{{ $partner['name'] }}">@else<strong>{{ $partner['name'] }}</strong>@endif</figure>
            @endforeach
        </section>
        @endif

        {{-- Precios: salen de los planes activos de la base. --}}
        <section class="lp-section lp-pricing" id="planes">
            <div class="lp-wrap">
                <div class="lp-head lp-head--center">
                    <p class="lp-kicker">Planes</p>
                    <h2>{{ $g['plans_title'] }}</h2>
                    <p>Todos los planes incluyen punto de venta, inventario, caja y facturación electrónica.</p>
                </div>
                <div class="lp-plans">
                    @forelse($plans as $plan)
                    @php $featured = $plan->billing_interval === 'yearly' && (float) $plan->price > 0; @endphp
                    <article class="lp-plan {{ $featured ? 'is-featured' : '' }}">
                        @if($featured)<span class="lp-plan-badge">Pago anual</span>@endif
                        <h3>{{ $plan->name }}</h3>
                        @if($plan->description)<p class="lp-plan-desc">{{ $plan->description }}</p>@endif
                        <p class="lp-price"><strong>{{ $money($plan->price) }}</strong><span>/ {{ $intervalLabel($plan) }}</span></p>
                        @if($featured)
                        <p class="lp-plan-equiv">Equivale a {{ $money($plan->price / 12) }} al mes</p>
                        @endif
                        <ul>
                            <li>{!! $icon('check', 'lp-ico lp-ico--xs') !!} {{ $limit($plan->max_users, 'usuario', 'usuarios') }}</li>
                            <li>{!! $icon('check', 'lp-ico lp-ico--xs') !!} {{ $limit($plan->max_stores, 'tienda', 'tiendas') }}</li>
                            <li>{!! $icon('check', 'lp-ico lp-ico--xs') !!} {{ $limit($plan->max_warehouses, 'bodega', 'bodegas') }}</li>
                            <li>{!! $icon('check', 'lp-ico lp-ico--xs') !!} {{ $docsLine($plan) }}</li>
                        </ul>
                        <a class="lp-btn {{ $featured ? '' : 'lp-btn--soft' }}" href="{{ $registerUrl }}">Empezar con la prueba</a>
                    </article>
                    @empty
                    <article class="lp-plan">
                        <h3>Planes a medida</h3>
                        <p class="lp-plan-desc">Escríbenos y te contamos qué plan se ajusta a tu negocio.</p>
                        <a class="lp-btn" href="mailto:{{ $g['contact_email'] }}">Pedir información</a>
                    </article>
                    @endforelse
                </div>
                @if($trial)
                <div class="lp-trial">
                    <span class="lp-ico-box">{!! $icon('gift') !!}</span>
                    <p><strong>Prueba gratis de {{ $trial->trial_days ?: 14 }} días.</strong> {{ ucfirst($limit($trial->max_users, 'usuario', 'usuarios')) }}, {{ $trial->max_electronic_documents ? $trial->max_electronic_documents.' comprobantes electrónicos' : 'comprobantes electrónicos ilimitados' }} y todos los módulos. No pide tarjeta.</p>
                </div>
                @endif
            </div>
        </section>

        @if($active($content['testimonials'])->isNotEmpty())
        <section class="lp-section">
            <div class="lp-wrap">
                <div class="lp-head lp-head--center"><h2>{{ $g['testimonials_title'] }}</h2></div>
                <div class="lp-quotes">
                    @foreach($active($content['testimonials']) as $testimonial)
                    <figure>
                        <blockquote>{{ $testimonial['quote'] }}</blockquote>
                        <figcaption>@if($testimonial['avatar'] ?? null)<img src="{{ $testimonial['avatar'] }}" alt="">@endif<span><strong>{{ $testimonial['name'] }}</strong>{{ $testimonial['role'] ?? '' }}</span></figcaption>
                    </figure>
                    @endforeach
                </div>
            </div>
        </section>
        @endif

        <section class="lp-section" id="preguntas">
            <div class="lp-wrap lp-faq">
                <div class="lp-faq-side">
                    <p class="lp-kicker">Preguntas</p>
                    <h2>{{ $g['faq_title'] }}</h2>
                    <div class="lp-help">
                        <strong>¿Tienes otra duda?</strong>
                        <p>Escríbenos y te ayudamos a dejar tu negocio listo para facturar.</p>
                        @if($whatsappUrl)
                        <a class="lp-btn lp-btn--wa" href="{{ $whatsappUrl }}" target="_blank" rel="noopener">{!! $icon('support', 'lp-ico lp-ico--sm') !!} Escribir por WhatsApp</a>
                        @endif
                        <a class="lp-btn lp-btn--soft" href="mailto:{{ $g['contact_email'] }}">{!! $icon('mail', 'lp-ico lp-ico--sm') !!} {{ $g['contact_email'] }}</a>
                    </div>
                </div>
                <div class="lp-faq-list">
                    @foreach($active($content['faqs']) as $index => $faq)
                    <details {{ $index === 0 ? 'open' : '' }}><summary>{{ $faq['question'] }}</summary><p>{{ $faq['answer'] }}</p></details>
                    @endforeach
                </div>
            </div>
        </section>

        <section class="lp-close">
            <div class="lp-wrap">
                <div class="lp-close-card">
                    <div class="lp-close-copy">
                        <h2>{{ $g['contact_title'] }}</h2>
                        <p>{{ $g['contact_description'] }}</p>
                        <div class="lp-actions">
                            <a class="lp-btn lp-btn--lg lp-btn--white" href="{{ $registerUrl }}" data-auth-cta data-auth-label="Ir al sistema">{{ $g['hero_primary_label'] }} {!! $icon('arrow', 'lp-ico lp-ico--sm') !!}</a>
                            @if($whatsappUrl)<a class="lp-btn lp-btn--lg lp-btn--wa" href="{{ $whatsappUrl }}" target="_blank" rel="noopener">{!! $icon('support', 'lp-ico lp-ico--sm') !!} WhatsApp</a>@endif
                        </div>
                    </div>
                    @if($steps->isNotEmpty())
                    <ol class="lp-close-steps" aria-label="{{ $g['steps_title'] }}">
                        @foreach($steps as $step)
                        <li><span>{{ $loop->iteration }}</span><div><strong>{{ $step['title'] }}</strong><p>{{ $step['description'] }}</p></div></li>
                        @endforeach
                    </ol>
                    @endif
                </div>
            </div>
        </section>
    </main>

    <footer class="lp-footer">
        <div class="lp-wrap lp-footer-grid">
            <div>
                <a class="lp-brand" href="#inicio"><img src="/images/ecua-pos-logo.png" alt="" width="28" height="28"><span>{{ $g['brand_name'] }}</span></a>
                <p>Punto de venta y facturación electrónica para negocios en {{ $g['location'] }}.</p>
            </div>
            <nav aria-label="Producto">
                <strong>Producto</strong>
                <a href="#dia">Cómo funciona</a><a href="#sri">Facturación SRI</a><a href="#planes">Precios</a>
                <a href="{{ $loginUrl }}" data-auth-guest>Iniciar sesión</a><a href="{{ $dashboardUrl }}" data-auth-user>Ir al sistema</a>
            </nav>
            <div>
                <strong>Contacto</strong>
                <a href="mailto:{{ $g['contact_email'] }}">{{ $g['contact_email'] }}</a>
                @if($whatsappUrl)<a href="{{ $whatsappUrl }}" target="_blank" rel="noopener">WhatsApp +{{ $whatsappNumber }}</a>@endif
            </div>
            <div>
                <strong>Legal</strong>
                <button type="button" data-legal="terms">Términos y condiciones</button>
                <button type="button" data-legal="privacy">Privacidad</button>
                <button type="button" data-legal="refunds">Reembolsos</button>
            </div>
        </div>
        <div class="lp-wrap lp-copyright">© {{ date('Y') }} {{ $g['brand_name'] }}</div>
    </footer>

    @foreach(['terms' => 'Términos y condiciones', 'privacy' => 'Política de privacidad', 'refunds' => 'Política de reembolsos'] as $key => $label)
    <dialog class="lp-legal" data-legal-dialog="{{ $key }}"><button class="lp-legal-close" type="button" aria-label="Cerrar">×</button><h2>{{ $label }}</h2><div>{!! nl2br(e($content['legal'][$key])) !!}</div></dialog>
    @endforeach
    <script src="{{ asset('js/landing.js') }}?v=5" defer></script>
</body>
</html>
