<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('catalog_orders', function (Blueprint $table) {
            $table->foreignId('sale_id')->nullable()->unique()->after('warehouse_id')
                ->constrained()->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId('assigned_to')->nullable()->after('status')
                ->constrained('users')->cascadeOnUpdate()->nullOnDelete();
            $table->text('internal_notes')->nullable()->after('notes');
            $table->timestamp('confirmed_at')->nullable()->after('whatsapp_opened_at');
            $table->timestamp('preparing_at')->nullable()->after('confirmed_at');
            $table->timestamp('completed_at')->nullable()->after('preparing_at');
            $table->timestamp('cancelled_at')->nullable()->after('completed_at');
        });

        Schema::create('catalog_order_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('catalog_order_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->cascadeOnUpdate()->nullOnDelete();
            $table->string('from_status', 30)->nullable();
            $table->string('to_status', 30);
            $table->text('note')->nullable();
            $table->timestamps();
            $table->index(['catalog_order_id', 'created_at'], 'catalog_order_history_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('catalog_order_status_histories');
        Schema::table('catalog_orders', function (Blueprint $table) {
            $table->dropConstrainedForeignId('assigned_to');
            $table->dropConstrainedForeignId('sale_id');
            $table->dropColumn([
                'internal_notes', 'confirmed_at', 'preparing_at', 'completed_at', 'cancelled_at',
            ]);
        });
    }
};
