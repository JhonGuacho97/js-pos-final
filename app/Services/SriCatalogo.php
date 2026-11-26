<?php

namespace App\Services;

/**
 * Catálogos de la ficha técnica del SRI (esquema offline, versión 2.34)
 * que el sistema necesita en el XML y en el RIDE. Viven en un solo lugar
 * para que factura, notas de crédito/débito y el RIDE usen exactamente
 * los mismos códigos.
 */
class SriCatalogo
{
    /**
     * Tabla 17 -- tarifa de IVA (en %) => <codigoPorcentaje>.
     * No objeto (6) y exento (7) no tienen un porcentaje numérico que los
     * distinga del 0%, así que no se pueden derivar de la tarifa.
     */
    public const CODIGOS_IVA = [
        0 => '0',
        5 => '5',
        8 => '8',   // IVA diferenciado (turismo)
        12 => '2',
        13 => '10',
        14 => '3',
        15 => '4',
    ];

    public const ETIQUETAS_IVA = [
        '0' => '0%',
        '2' => '12%',
        '3' => '14%',
        '4' => '15%',
        '5' => '5%',
        '6' => 'no objeto de IVA',
        '7' => 'exento de IVA',
        '8' => 'IVA diferenciado',
        '10' => '13%',
    ];

    /**
     * Tabla 24 -- formas de pago.
     */
    public const FORMAS_PAGO = [
        '01' => 'SIN UTILIZACIÓN DEL SISTEMA FINANCIERO',
        '15' => 'COMPENSACIÓN DE DEUDAS',
        '16' => 'TARJETA DE DÉBITO',
        '17' => 'DINERO ELECTRÓNICO',
        '18' => 'TARJETA PREPAGO',
        '19' => 'TARJETA DE CRÉDITO',
        '20' => 'OTROS CON UTILIZACIÓN DEL SISTEMA FINANCIERO',
        '21' => 'ENDOSO DE TÍTULOS',
    ];

    /**
     * Numeral 9.10 -- por encima de este valor la factura debe llevar los
     * datos del comprador; no se puede emitir a "Consumidor final".
     */
    public const MAXIMO_CONSUMIDOR_FINAL = 50.00;

    /**
     * Código de porcentaje para una tarifa. Una tarifa que no está en la
     * Tabla 17 detiene la emisión: antes se enviaba en silencio como 15%.
     */
    public static function codigoPorcentajeIva(float $tarifa): string
    {
        $clave = (int) round($tarifa);

        if (abs($tarifa - $clave) > 0.001 || !isset(self::CODIGOS_IVA[$clave])) {
            throw new \RuntimeException(
                "La tarifa de IVA {$tarifa}% no existe en la tabla del SRI (0%, 5%, 8%, 12%, 13%, 14% o 15%). ".
                'Corrige el impuesto del producto antes de facturar.'
            );
        }

        return self::CODIGOS_IVA[$clave];
    }

    public static function etiquetaIva(string $codigoPorcentaje): string
    {
        return self::ETIQUETAS_IVA[$codigoPorcentaje] ?? $codigoPorcentaje;
    }

    public static function textoFormaPago(string $codigo): string
    {
        return self::FORMAS_PAGO[$codigo] ?? 'OTROS';
    }
}
