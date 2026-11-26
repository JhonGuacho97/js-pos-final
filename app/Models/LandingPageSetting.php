<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LandingPageSetting extends BaseModel
{
    protected $fillable = ['content', 'is_published', 'updated_by'];

    protected $casts = [
        'content' => 'array',
        'is_published' => 'boolean',
    ];

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Textos por defecto de la landing. Son concretos a propósito (SRI, RIDE,
     * firma .p12, RIMPE, caja): la versión anterior usaba frases genéricas
     * ("Todo lo que necesitas...") y cifras inventadas que restaban
     * credibilidad. El superadministrador puede reemplazarlos desde el CMS.
     */
    public static function defaults(): array
    {
        return [
            'general' => [
                'brand_name' => 'EcuaPOS',
                'announcement' => '14 días gratis · sin tarjeta',
                'eyebrow' => 'Punto de venta y facturación electrónica · Ecuador',
                'hero_title' => 'Vende en mostrador y factura al SRI en el mismo cobro.',
                'hero_description' => 'El punto de venta para tiendas, ferreterías, boutiques y minimarkets. Cobras, la factura sale autorizada por el SRI y al cerrar el día sabes cuánto debe haber en caja.',
                'hero_primary_label' => 'Crear mi cuenta gratis',
                'hero_secondary_label' => 'Escribir por WhatsApp',
                'hero_image' => '',
                'services_title' => 'Qué incluye',
                'services_description' => 'Todos los planes traen los mismos módulos. Lo que cambia es cuántos usuarios, bodegas y comprobantes electrónicos usas.',
                'benefits_title' => 'Pensado para cómo se trabaja aquí',
                'steps_title' => 'Cómo empiezas',
                'testimonials_title' => 'Negocios que ya trabajan con EcuaPOS',
                'faq_title' => 'Preguntas frecuentes',
                'plans_title' => 'Precios claros, en dólares',
                'contact_title' => 'Pruébalo con tus productos y tu caja de verdad.',
                'contact_description' => 'Catorce días gratis, sin tarjeta. Si algo no queda claro, escríbenos por WhatsApp y lo configuramos contigo.',
                'contact_email' => 'ventas@ecuapos.tech',
                'whatsapp' => '593987497541',
                'location' => 'Ecuador',
                'meta_title' => 'EcuaPOS | Punto de venta y facturación electrónica SRI',
                'meta_description' => 'Punto de venta con facturación electrónica autorizada por el SRI, inventario por bodega, control de caja y ventas sin internet para negocios en Ecuador.',
            ],
            'services' => [
                ['id' => 'pos', 'title' => 'Punto de venta', 'description' => 'Cobro con lector de código de barras, presentaciones (unidad, caja, docena), pagos mixtos en efectivo y transferencia, y ticket al terminar.', 'icon' => 'cart', 'is_active' => true],
                ['id' => 'invoice', 'title' => 'Facturación electrónica', 'description' => 'Facturas, notas de crédito y notas de débito firmadas y autorizadas por el SRI, con el RIDE en PDF enviado al cliente.', 'icon' => 'invoice', 'is_active' => true],
                ['id' => 'inventory', 'title' => 'Inventario por bodega', 'description' => 'Stock por bodega, traslados, ajustes, conteos físicos y alerta cuando un producto se está acabando.', 'icon' => 'boxes', 'is_active' => true],
                ['id' => 'cash', 'title' => 'Caja por cajero', 'description' => 'Apertura con base, ingresos, retiros y cierre con lo que debe haber. Cada movimiento queda con el nombre de quien lo hizo.', 'icon' => 'wallet', 'is_active' => true],
                ['id' => 'reports', 'title' => 'Reportes', 'description' => 'Ventas del día, rentabilidad por producto, cuentas por cobrar y compras, para decidir con números y no a ojo.', 'icon' => 'chart', 'is_active' => true],
                ['id' => 'catalog', 'title' => 'Catálogo en línea', 'description' => 'Una página con tus productos y precios; el cliente arma su pedido y te llega por WhatsApp.', 'icon' => 'store', 'is_active' => true],
            ],
            'benefits' => [
                ['id' => 'one', 'title' => 'Funciona en el navegador', 'description' => 'Computadora, tablet o celular. Se instala como aplicación y no necesitas un servidor en tu local.', 'icon' => 'ecuador', 'is_active' => true],
                ['id' => 'two', 'title' => 'Sigue vendiendo sin internet', 'description' => 'Las ventas se guardan en el equipo y se envían solas cuando vuelve la conexión.', 'icon' => 'sync', 'is_active' => true],
                ['id' => 'three', 'title' => 'Tus datos, solo tuyos', 'description' => 'Cada empresa tiene su información separada. Tu RUC y tu firma solo los usa tu negocio.', 'icon' => 'growth', 'is_active' => true],
                ['id' => 'four', 'title' => 'Soporte por WhatsApp', 'description' => 'Te ayudamos a subir la firma electrónica y a dejar listos tus datos del SRI.', 'icon' => 'support', 'is_active' => true],
            ],
            'steps' => [
                ['id' => 'step-1', 'number' => '01', 'title' => 'Crea tu cuenta', 'description' => 'Con tu correo. Te llega un código para verificarlo.', 'is_active' => true],
                ['id' => 'step-2', 'number' => '02', 'title' => 'Sube tu firma y tus productos', 'description' => 'RUC, establecimiento, punto de emisión, certificado .p12 y tu catálogo.', 'is_active' => true],
                ['id' => 'step-3', 'number' => '03', 'title' => 'Abre caja y vende', 'description' => 'Desde el primer día. La prueba dura 14 días.', 'is_active' => true],
            ],
            'testimonials' => [],
            'faqs' => [
                ['id' => 'faq-1', 'question' => '¿Necesito instalar algún programa?', 'answer' => 'No. EcuaPOS funciona desde el navegador y también puede instalarse como aplicación web en computadoras, tablets y celulares.', 'is_active' => true],
                ['id' => 'faq-5', 'question' => '¿Qué necesito para facturar electrónicamente?', 'answer' => 'Tu firma electrónica (archivo .p12) vigente y estar habilitado en el SRI para emitir comprobantes electrónicos. Subes la firma una vez y EcuaPOS firma cada factura por ti.', 'is_active' => true],
                ['id' => 'faq-6', 'question' => '¿Qué pasa si se va el internet?', 'answer' => 'Puedes seguir vendiendo. Las ventas quedan guardadas en el equipo y se envían cuando vuelve la conexión; en ese momento se emite la factura electrónica.', 'is_active' => true],
                ['id' => 'faq-2', 'question' => '¿Puedo probarlo antes de pagar?', 'answer' => 'Sí. La prueba dura 14 días, no pide tarjeta e incluye todos los módulos con límites de uso.', 'is_active' => true],
                ['id' => 'faq-3', 'question' => '¿Se borran mis datos si no renuevo?', 'answer' => 'No. La información se conserva; el acceso se restablece al renovar el plan.', 'is_active' => true],
                ['id' => 'faq-4', 'question' => '¿Puedo usar más de una bodega o cajero?', 'answer' => 'Sí. Cuántos usuarios y bodegas puedes tener depende del plan, y puedes cambiar de plan cuando lo necesites.', 'is_active' => true],
            ],
            'partners' => [],
            'legal' => [
                'terms' => "Términos y condiciones\n\nEl uso de EcuaPOS está sujeto al plan contratado, sus límites y las condiciones comerciales aceptadas por la organización.",
                'privacy' => "Política de privacidad\n\nEcuaPOS utiliza la información necesaria para prestar el servicio y mantiene controles para proteger los datos de cada organización.",
                'refunds' => "Política de reembolsos\n\nLas solicitudes de revisión de pagos deberán enviarse a soporte con el comprobante y los datos de la organización.",
            ],
        ];
    }

    public static function mergeWithDefaults(?array $saved): array
    {
        $content = self::defaults();
        foreach ($saved ?? [] as $section => $value) {
            if (in_array($section, ['general', 'legal'], true) && is_array($value)) {
                $content[$section] = array_replace($content[$section], $value);
            } elseif (array_key_exists($section, $content)) {
                // Las colecciones se sustituyen completas para que eliminar
                // un elemento desde el CMS no lo reviva desde los defaults.
                $content[$section] = $value;
            }
        }

        return $content;
    }
}
