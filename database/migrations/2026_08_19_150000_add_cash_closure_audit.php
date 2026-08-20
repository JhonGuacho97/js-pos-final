<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pos_register', function (Blueprint $table) {
            $table->decimal('cash_difference', 15, 4)->nullable()->after('expected_cash');
            $table->foreignId('closed_by')->nullable()->after('closed_at')
                ->constrained('users')->cascadeOnUpdate()->nullOnDelete();
            $table->string('reconciliation_status', 20)->nullable()->after('discrepancy_note')->index();
            $table->foreignId('reviewed_by')->nullable()->after('reconciliation_status')
                ->constrained('users')->cascadeOnUpdate()->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
            $table->text('review_note')->nullable()->after('reviewed_at');
        });

        DB::table('pos_register')->whereNotNull('closed_at')->whereNotNull('expected_cash')->update([
            'cash_difference' => DB::raw('cash_in_hand_while_closing - expected_cash'),
            'reconciliation_status' => DB::raw("CASE WHEN ABS(cash_in_hand_while_closing - expected_cash) < 0.01 THEN 'BALANCED' ELSE 'PENDING' END"),
        ]);
    }

    public function down(): void
    {
        Schema::table('pos_register', function (Blueprint $table) {
            $table->dropForeign(['closed_by']);
            $table->dropForeign(['reviewed_by']);
            $table->dropIndex(['reconciliation_status']);
            $table->dropColumn([
                'cash_difference', 'closed_by', 'reconciliation_status',
                'reviewed_by', 'reviewed_at', 'review_note',
            ]);
        });
    }
};
