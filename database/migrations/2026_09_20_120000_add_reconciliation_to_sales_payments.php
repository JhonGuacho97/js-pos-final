<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sales_payments', function (Blueprint $table) {
            $table->string('reconciliation_status', 20)->default('PENDING')->after('reference');
            $table->text('reconciliation_note')->nullable()->after('reconciliation_status');
            $table->timestamp('reconciled_at')->nullable()->after('reconciliation_note');
            $table->foreignId('reconciled_by')->nullable()->after('reconciled_at')->constrained('users')->nullOnDelete();
            $table->index(['payment_type', 'reference'], 'sales_payments_type_reference_index');
            $table->index(['payment_type', 'reconciliation_status'], 'sales_payments_type_reconciliation_index');
        });
    }

    public function down(): void
    {
        Schema::table('sales_payments', function (Blueprint $table) {
            $table->dropIndex('sales_payments_type_reference_index');
            $table->dropIndex('sales_payments_type_reconciliation_index');
            $table->dropConstrainedForeignId('reconciled_by');
            $table->dropColumn(['reconciliation_status', 'reconciliation_note', 'reconciled_at']);
        });
    }
};
