<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('catalog_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->unique()->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('warehouse_id')->nullable()->constrained()->cascadeOnUpdate()->nullOnDelete();
            $table->boolean('is_enabled')->default(false);
            $table->string('whatsapp_number', 30)->nullable();
            $table->string('headline')->nullable();
            $table->text('description')->nullable();
            $table->boolean('show_stock')->default(false);
            $table->boolean('allow_pickup')->default(true);
            $table->boolean('allow_delivery')->default(false);
            $table->decimal('delivery_fee', 15, 4)->default(0);
            $table->decimal('minimum_order', 15, 4)->default(0);
            $table->timestamps();
        });

        Schema::table('products', function (Blueprint $table) {
            $table->boolean('catalog_visible')->default(true)->after('is_kit');
            $table->boolean('catalog_featured')->default(false)->after('catalog_visible');
            $table->text('catalog_description')->nullable()->after('catalog_featured');
            $table->index(['store_id', 'catalog_visible', 'product_category_id'], 'products_catalog_listing_idx');
        });

        Schema::create('catalog_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignId('warehouse_id')->constrained()->cascadeOnUpdate()->restrictOnDelete();
            $table->string('reference', 40)->nullable()->unique();
            $table->string('status', 30)->default('pending');
            $table->string('customer_name');
            $table->string('customer_phone', 30);
            $table->string('fulfillment_type', 20);
            $table->text('delivery_address')->nullable();
            $table->string('payment_method', 50)->nullable();
            $table->text('notes')->nullable();
            $table->decimal('subtotal', 15, 4);
            $table->decimal('delivery_fee', 15, 4)->default(0);
            $table->decimal('grand_total', 15, 4);
            $table->timestamp('whatsapp_opened_at')->nullable();
            $table->timestamps();
            $table->index(['store_id', 'status', 'created_at']);
        });

        Schema::create('catalog_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('catalog_order_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignId('product_presentation_id')->nullable()->constrained()->cascadeOnUpdate()->restrictOnDelete();
            $table->string('product_name');
            $table->string('variant_name')->nullable();
            $table->string('presentation_name')->nullable();
            $table->decimal('presentation_equivalence', 15, 4)->default(1);
            $table->decimal('quantity', 15, 4);
            $table->decimal('unit_price', 15, 4);
            $table->decimal('line_total', 15, 4);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('catalog_order_items');
        Schema::dropIfExists('catalog_orders');
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('products_catalog_listing_idx');
            $table->dropColumn(['catalog_visible', 'catalog_featured', 'catalog_description']);
        });
        Schema::dropIfExists('catalog_settings');
    }
};
