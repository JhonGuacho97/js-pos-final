<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cash_movements', function (Blueprint $table) {
            $table->foreignId('approved_by')->nullable()->after('user_id')
                ->constrained('users')->cascadeOnUpdate()->nullOnDelete();
            $table->uuid('transfer_uuid')->nullable()->after('reversed_movement_id')->index();
            $table->text('reversal_reason')->nullable()->after('transfer_uuid');
        });

        Schema::table('sales_return', function (Blueprint $table) {
            $table->foreignId('cash_movement_id')->nullable()->after('payment_type')
                ->constrained('cash_movements')->cascadeOnUpdate()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('sales_return', function (Blueprint $table) {
            $table->dropForeign(['cash_movement_id']);
            $table->dropColumn('cash_movement_id');
        });

        Schema::table('cash_movements', function (Blueprint $table) {
            $table->dropForeign(['approved_by']);
            $table->dropIndex(['transfer_uuid']);
            $table->dropColumn(['approved_by', 'transfer_uuid', 'reversal_reason']);
        });
    }
};
