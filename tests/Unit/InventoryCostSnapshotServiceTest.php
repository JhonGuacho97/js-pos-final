<?php

namespace Tests\Unit;

use App\Models\Product;
use App\Models\ProductKitItem;
use App\Models\ProductPresentation;
use App\Services\InventoryCostSnapshotService;
use Illuminate\Database\Eloquent\Collection;
use Tests\TestCase;

class InventoryCostSnapshotServiceTest extends TestCase
{
    public function test_it_snapshots_the_base_product_cost(): void
    {
        $product = new Product(['product_cost' => 2.50, 'is_kit' => false]);

        $snapshot = (new InventoryCostSnapshotService())->forSale($product, 4);

        $this->assertSame(2.5, $snapshot['unit_cost']);
        $this->assertSame(10.0, $snapshot['total_cost']);
        $this->assertFalse($snapshot['cost_is_estimated']);
    }

    public function test_it_uses_the_presentation_cost_override(): void
    {
        $product = new Product(['product_cost' => 1, 'is_kit' => false]);
        $presentation = new ProductPresentation(['equivalence' => 6, 'cost' => 5]);
        $presentation->setRelation('product', $product);

        $snapshot = (new InventoryCostSnapshotService())->forSale($product, 12, $presentation, 2);

        $this->assertSame(0.833333, $snapshot['unit_cost']);
        $this->assertSame(10.0, $snapshot['total_cost']);
    }

    public function test_it_snapshots_the_complete_recipe_cost_for_a_kit(): void
    {
        $component = new Product(['product_cost' => 3]);
        $item = new ProductKitItem(['quantity' => 2]);
        $item->setRelation('component', $component);
        $item->setRelation('presentation', null);
        $kit = new Product(['is_kit' => true]);
        $kit->setRelation('kitItems', new Collection([$item]));

        $snapshot = (new InventoryCostSnapshotService())->forSale($kit, 3);

        $this->assertSame(6.0, $snapshot['unit_cost']);
        $this->assertSame(18.0, $snapshot['total_cost']);
    }
}
