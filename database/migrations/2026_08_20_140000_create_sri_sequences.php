<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('electronic_invoices', 'ambiente')) {
            Schema::table('electronic_invoices', function (Blueprint $table) {
                $table->unsignedTinyInteger('ambiente')->nullable()->after('pto_emi');
            });
        }

        DB::table('electronic_invoices')
            ->where('clave_acceso', 'not like', 'ERR%')
            ->whereNull('ambiente')
            ->whereRaw("clave_acceso REGEXP '^[0-9]{49}$'")
            ->orderBy('id')
            ->chunkById(500, function ($invoices) {
                foreach ($invoices as $invoice) {
                    DB::table('electronic_invoices')
                        ->where('id', $invoice->id)
                        ->update(['ambiente' => (int) substr($invoice->clave_acceso, 23, 1)]);
                }
            });

        if (! $this->indexExists('electronic_invoices', 'electronic_invoices_store_id_index')) {
            Schema::table('electronic_invoices', function (Blueprint $table) {
                $table->index('store_id', 'electronic_invoices_store_id_index');
            });
        }

        if ($this->indexExists('electronic_invoices', 'electronic_invoices_store_tipo_secuencial_unique')) {
            Schema::table('electronic_invoices', function (Blueprint $table) {
                $table->dropUnique('electronic_invoices_store_tipo_secuencial_unique');
            });
        }

        if (! $this->indexExists('electronic_invoices', 'electronic_invoices_sri_series_sequence_unique')) {
            Schema::table('electronic_invoices', function (Blueprint $table) {
                $table->unique(
                    ['store_id', 'ambiente', 'estab', 'pto_emi', 'tipo_comprobante', 'secuencial'],
                    'electronic_invoices_sri_series_sequence_unique'
                );
            });
        }

        if (! Schema::hasTable('sri_sequences')) {
            Schema::create('sri_sequences', function (Blueprint $table) {
                $table->id();
                $table->foreignId('store_id')->constrained()->cascadeOnUpdate()->restrictOnDelete();
                $table->unsignedTinyInteger('ambiente');
                $table->string('estab', 3);
                $table->string('pto_emi', 3);
                $table->string('tipo_comprobante', 2);
                $table->unsignedInteger('ultimo_secuencial')->default(0);
                $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamps();

                $table->unique(
                    ['store_id', 'ambiente', 'estab', 'pto_emi', 'tipo_comprobante'],
                    'sri_sequences_series_type_unique'
                );
            });
        }

        if (! Schema::hasTable('sri_sequence_adjustments')) {
            Schema::create('sri_sequence_adjustments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('sri_sequence_id')->constrained('sri_sequences')->cascadeOnDelete();
                $table->foreignId('store_id')->constrained()->cascadeOnUpdate()->restrictOnDelete();
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->unsignedInteger('secuencial_anterior');
                $table->unsignedInteger('secuencial_nuevo');
                $table->string('motivo', 500);
                $table->string('ip_address', 45)->nullable();
                $table->string('user_agent', 500)->nullable();
                $table->timestamps();
            });
        }

        $series = DB::table('electronic_invoices')
            ->select([
                'store_id',
                'ambiente',
                'estab',
                'pto_emi',
                'tipo_comprobante',
            ])
            ->selectRaw('MAX(CAST(secuencial AS UNSIGNED)) AS ultimo_secuencial')
            ->whereNotNull('store_id')
            ->whereNotNull('ambiente')
            ->whereNotNull('estab')
            ->whereNotNull('pto_emi')
            ->where('clave_acceso', 'not like', 'ERR%')
            ->whereRaw("secuencial REGEXP '^[0-9]{9}$'")
            ->groupBy('store_id', 'ambiente', 'estab', 'pto_emi', 'tipo_comprobante')
            ->get();

        foreach ($series as $serie) {
            DB::table('sri_sequences')->updateOrInsert([
                'store_id' => $serie->store_id,
                'ambiente' => $serie->ambiente,
                'estab' => $serie->estab,
                'pto_emi' => $serie->pto_emi,
                'tipo_comprobante' => $serie->tipo_comprobante,
            ], [
                'ultimo_secuencial' => $serie->ultimo_secuencial,
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('sri_sequence_adjustments');
        Schema::dropIfExists('sri_sequences');

        Schema::table('electronic_invoices', function (Blueprint $table) {
            $table->dropUnique('electronic_invoices_sri_series_sequence_unique');
            $table->unique(
                ['store_id', 'tipo_comprobante', 'secuencial'],
                'electronic_invoices_store_tipo_secuencial_unique'
            );
            $table->dropColumn('ambiente');
        });
    }

    private function indexExists(string $table, string $index): bool
    {
        return count(DB::select(
            'SELECT 1 FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = ? AND index_name = ? LIMIT 1',
            [$table, $index]
        )) > 0;
    }
};
