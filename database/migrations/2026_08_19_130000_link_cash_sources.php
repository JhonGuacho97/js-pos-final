<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cash_movements', function (Blueprint $table) {
            $table->unique(['source_type', 'source_id', 'type'], 'cash_movements_source_unique');
        });
        Schema::table('expenses', function (Blueprint $table) {
            $table->boolean('paid_from_cash')->default(false)->after('amount');
            $table->foreignId('cash_movement_id')->nullable()->after('paid_from_cash')
                ->constrained('cash_movements')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->dropForeign(['cash_movement_id']);
            $table->dropColumn(['paid_from_cash', 'cash_movement_id']);
        });
        Schema::table('cash_movements', function (Blueprint $table) {
            $table->dropUnique('cash_movements_source_unique');
        });
    }
};
