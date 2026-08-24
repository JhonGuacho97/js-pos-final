<?php

use App\Models\SaleItem;
use App\Models\SaleReturnItem;
use App\Services\InventoryCostSnapshotService;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sale_items', function (Blueprint $table) {
            $table->decimal('unit_cost', 15, 6)->nullable()->after('product_price');
            $table->decimal('total_cost', 15, 4)->nullable()->after('unit_cost');
            $table->boolean('cost_is_estimated')->default(false)->after('total_cost');
            $table->index(['sale_id', 'cost_is_estimated'], 'sale_items_cost_quality_index');
        });
        Schema::table('sale_return_items', function (Blueprint $table) {
            $table->decimal('unit_cost', 15, 6)->nullable()->after('product_price');
            $table->decimal('total_cost', 15, 4)->nullable()->after('unit_cost');
            $table->boolean('cost_is_estimated')->default(false)->after('total_cost');
        });

        $service = app(InventoryCostSnapshotService::class);
        SaleItem::with(['product.kitItems.component', 'product.kitItems.presentation.product', 'productPresentation.product'])
            ->orderBy('id')->chunkById(200, function ($items) use ($service) {
                foreach ($items as $item) {
                    if (! $item->product) {
                        continue;
                    }
                    $snapshot = $service->forSale(
                        $item->product,
                        (float) $item->quantity,
                        $item->productPresentation,
                        (float) ($item->presentation_quantity ?: $item->quantity),
                        true
                    );
                    $item->forceFill($snapshot)->saveQuietly();
                }
            });

        SaleReturnItem::with('saleReturn')->orderBy('id')->chunkById(200, function ($items) use ($service) {
            foreach ($items as $item) {
                if (! $item->saleReturn?->sale_id) {
                    continue;
                }
                $snapshot = $service->forReturn($item->saleReturn->sale_id, $item->toArray());
                $item->forceFill($snapshot)->saveQuietly();
            }
        });
    }

    public function down(): void
    {
        Schema::table('sale_return_items', function (Blueprint $table) {
            $table->dropColumn(['unit_cost', 'total_cost', 'cost_is_estimated']);
        });
        Schema::table('sale_items', function (Blueprint $table) {
            $table->dropIndex('sale_items_cost_quality_index');
            $table->dropColumn(['unit_cost', 'total_cost', 'cost_is_estimated']);
        });
    }
};
