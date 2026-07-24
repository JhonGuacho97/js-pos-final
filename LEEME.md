# Fase 1 — Backend de Facturación Electrónica (SRI)

Estos archivos van sobre tu proyecto `pos-sinfacturacion`, respetando exactamente
la misma ruta relativa. Son 100% aditivos excepto dos archivos que ya existían
y se **actualizaron** (marcados abajo) — revísalos antes de sobrescribir por si
tienes cambios locales más recientes.

## Archivos NUEVOS (no existen en tu proyecto, solo cópialos)
- `app/Services/SriConfigService.php`
- `app/Services/SriFirmaService.php`
- `app/Services/SriSoapService.php`
- `app/Services/SriRideService.php`
- `app/Jobs/EmitirFacturaJob.php`
- `app/Jobs/AutorizarFacturaJob.php`
- `app/Http/Controllers/API/ElectronicInvoiceController.php`
- `app/Http/Controllers/API/SriConfigController.php`
- `resources/views/sri/ride.blade.php`
- `database/migrations/2026_06_29_012711_create_jobs_table.php`

## Archivos MODIFICADOS (ya existían, revisa el diff antes de reemplazar)
- `composer.json` — se agregaron `robrichards/xmlseclibs` y `simplesoftwareio/simple-qrcode`
- `config/sri.php` — ahora lee la config desde la tabla `settings` (con fallback a `.env`), en vez de solo `.env`
- `app/Services/SriXmlService.php` — reemplazado por la versión que usa `SriConfigService::get()` en vez de `config('sri')`
- `app/Models/ElectronicInvoice.php` — `numeroComprobante()` ahora usa `SriConfigService::get()`
- `app/Models/Sale.php` — se agregó el bloque `electronic_invoice` dentro de `prepareAttributes()`. **No se tocó nada más** (pagos, usuario, presentaciones siguen igual).
- `routes/api.php` — se agregaron las rutas de `electronic-invoices`, `sri-config` y `sales/{sale}/electronic-invoice`

## Pasos para aplicar

1. Copia los archivos nuevos tal cual, en las mismas rutas.
2. Para `composer.json`, `config/sri.php`, `SriXmlService.php`, `ElectronicInvoice.php`, `Sale.php` y `routes/api.php`: aplica los cambios sobre tu versión actual (no sobrescribas de golpe si tienes ediciones locales — usa un diff).
3. Corre:
   ```bash
   composer require robrichards/xmlseclibs:^3.1 simplesoftwareio/simple-qrcode:^4.2
   php artisan migrate
   php artisan config:clear
   ```
4. Sube el certificado `.p12`/`.pfx` una vez tengas el endpoint `sri-config` conectado desde el frontend (Fase 3).

## Bug corregido durante la integración

En el proyecto original de facturación electrónica, `SriFirmaService` leía el
certificado desde `public_path('uploads/...')`, pero `SriConfigController` lo
guardaba con `Storage::disk('local')->put(...)` (es decir, en `storage/app/...`).
Son rutas distintas — el certificado nunca se habría encontrado en producción.
Se corrigió para que ambos usen la misma ruta (`Storage::disk('local')`).

## Nota sobre `config/sri.php`

Con `SriConfigService` centralizando todo, `config('sri')` queda como
mecanismo de respaldo/compatibilidad. Todo el flujo real de emisión
(`SriXmlService`, `SriFirmaService`, `SriSoapService`, `SriRideService`,
`ElectronicInvoice`) usa `SriConfigService::get()` directamente.

## Qué falta (próximas fases)

- **Fase 2**: revisar `Customer.php` (ya estaba igual en ambos proyectos, sin cambios pendientes)
- **Fase 3**: frontend nuevo sin conflicto — `SriConfigPage`, `ElectronicInvoiceStatus`, hook `useElectronicInvoice`, ruta `sri-config`
- **Fase 4**: frontend con conflicto real — `CashPaymentModel`, `PosMainPage`, `PaymentSlipModal`, `TicketSlipModal`, `Sales.js` (fusionar con cuidado tus features existentes de pagos divididos y presentaciones)
