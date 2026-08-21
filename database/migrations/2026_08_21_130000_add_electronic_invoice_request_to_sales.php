<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->string('electronic_invoice_requested_type', 2)->nullable()->after('created_offline');
            $table->timestamp('electronic_invoice_requested_at')->nullable()->after('electronic_invoice_requested_type');
        });
    }

    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropColumn(['electronic_invoice_requested_type', 'electronic_invoice_requested_at']);
        });
    }
};
