<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('catalog_orders', function (Blueprint $table) {
            $table->foreignId('customer_id')->nullable()->after('warehouse_id')
                ->constrained()->cascadeOnUpdate()->nullOnDelete();
            $table->index(['store_id', 'customer_id', 'created_at'], 'catalog_orders_customer_history_idx');
        });
    }

    public function down(): void
    {
        Schema::table('catalog_orders', function (Blueprint $table) {
            $table->dropIndex('catalog_orders_customer_history_idx');
            $table->dropConstrainedForeignId('customer_id');
        });
    }
};
