<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('permissions')
            ->where('name', 'view_cash_supervision')
            ->update(['display_name' => 'Supervisar turnos y movimientos de cajas abiertas']);
    }

    public function down(): void
    {
        DB::table('permissions')
            ->where('name', 'view_cash_supervision')
            ->update(['display_name' => 'Ver supervisión de cajas']);
    }
};
