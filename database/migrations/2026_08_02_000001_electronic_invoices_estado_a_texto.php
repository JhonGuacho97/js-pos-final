<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * La columna `estado` era un ENUM de MySQL con una lista fija de
 * valores -- cuando agregamos ERROR_TEMPORAL_SRI en el código, MySQL
 * lo rechazó en silencio (sin error) y guardó una cadena vacía en su
 * lugar, porque ese valor no estaba en la lista del ENUM.
 *
 * En vez de solo agregar el valor que faltaba, se cambia la columna a
 * texto simple (VARCHAR) -- así, agregar un estado nuevo en el futuro
 * es un cambio de código nada más, sin volver a depender de una
 * migración de esquema ni arriesgarse a este mismo silencio otra vez.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE electronic_invoices MODIFY estado VARCHAR(50) NOT NULL DEFAULT 'PENDIENTE'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE electronic_invoices MODIFY estado ENUM('PENDIENTE','RECIBIDA','AUTORIZADA','NO_AUTORIZADA','DEVUELTA') NOT NULL DEFAULT 'PENDIENTE'");
    }
};
