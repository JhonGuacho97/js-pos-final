<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sales_payments', function (Blueprint $table) {
            $table->foreignId('pos_register_id')->nullable()->after('sale_id')
                ->constrained('pos_register')->cascadeOnUpdate()->nullOnDelete();
            $table->index(['pos_register_id', 'payment_type'], 'sales_payments_register_type_index');
        });

        Schema::table('sales_return', function (Blueprint $table) {
            $table->foreignId('pos_register_id')->nullable()->after('sale_id')
                ->constrained('pos_register')->cascadeOnUpdate()->nullOnDelete();
            $table->index(['pos_register_id', 'payment_type'], 'sales_return_register_type_index');
        });

        // Una misma fuente puede tener varias versiones auditables: movimiento
        // original, reverso y reemplazo. La unicidad anterior impedía conservar
        // ese historial cuando un pago se corregía.
        Schema::table('cash_movements', function (Blueprint $table) {
            $table->dropUnique('cash_movements_source_unique');
            $table->index(['source_type', 'source_id', 'type'], 'cash_movements_source_index');
        });

        // Compatibilidad con instalaciones existentes: atribuimos cada pago y
        // devolución al turno que estaba abierto cuando ocurrió el movimiento.
        DB::table('sales_payments')->orderBy('id')->chunkById(250, function ($payments) {
            foreach ($payments as $payment) {
                $sale = DB::table('sales')->where('id', $payment->sale_id)->first(['user_id', 'warehouse_id']);
                if (! $sale) {
                    continue;
                }

                $registerId = DB::table('pos_register')
                    ->where('user_id', $sale->user_id)
                    ->where('warehouse_id', $sale->warehouse_id)
                    ->where('created_at', '<=', $payment->created_at)
                    ->where(function ($query) use ($payment) {
                        $query->whereNull('closed_at')->orWhere('closed_at', '>=', $payment->created_at);
                    })
                    ->orderByDesc('created_at')
                    ->value('id');

                if ($registerId) {
                    DB::table('sales_payments')->where('id', $payment->id)->update(['pos_register_id' => $registerId]);
                }
            }
        });

        DB::table('sales_return')->orderBy('id')->chunkById(250, function ($returns) {
            foreach ($returns as $return) {
                $sale = DB::table('sales')->where('id', $return->sale_id)->first(['user_id']);
                if (! $sale) {
                    continue;
                }

                $registerId = DB::table('pos_register')
                    ->where('user_id', $sale->user_id)
                    ->where('warehouse_id', $return->warehouse_id)
                    ->where('created_at', '<=', $return->created_at)
                    ->where(function ($query) use ($return) {
                        $query->whereNull('closed_at')->orWhere('closed_at', '>=', $return->created_at);
                    })
                    ->orderByDesc('created_at')
                    ->value('id');

                if ($registerId) {
                    DB::table('sales_return')->where('id', $return->id)->update(['pos_register_id' => $registerId]);
                }
            }
        });
    }

    public function down(): void
    {
        $hasDuplicateSources = DB::table('cash_movements')
            ->whereNotNull('source_type')
            ->whereNotNull('source_id')
            ->select('source_type', 'source_id', 'type')
            ->groupBy('source_type', 'source_id', 'type')
            ->havingRaw('COUNT(*) > 1')
            ->exists();

        Schema::table('cash_movements', function (Blueprint $table) {
            $table->dropIndex('cash_movements_source_index');
        });
        if (! $hasDuplicateSources) {
            Schema::table('cash_movements', function (Blueprint $table) {
                $table->unique(['source_type', 'source_id', 'type'], 'cash_movements_source_unique');
            });
        }

        Schema::table('sales_return', function (Blueprint $table) {
            $table->dropForeign(['pos_register_id']);
            $table->dropIndex('sales_return_register_type_index');
            $table->dropColumn('pos_register_id');
        });

        Schema::table('sales_payments', function (Blueprint $table) {
            $table->dropForeign(['pos_register_id']);
            $table->dropIndex('sales_payments_register_type_index');
            $table->dropColumn('pos_register_id');
        });
    }
};
