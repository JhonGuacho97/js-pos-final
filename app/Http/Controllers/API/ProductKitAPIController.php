<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Models\MainProduct;
use App\Models\ManageStock;
use App\Models\Product;
use App\Models\ProductKitItem;
use App\Models\ProductPresentation;
use App\Models\Unit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * CRUD de productos "kit" (combos/packs con receta de componentes reales,
 * ej. "Pack Cerveza + Michelada" = 1 caja de cerveza + 1 michelada). Se
 * maneja aparte del formulario general de producto por el mismo motivo
 * que ProductPresentationAPIController: es un dato de ciclo de vida
 * propio, no básico del producto.
 *
 * Un kit ES un Product normal (mismo precio/impuesto/código que
 * cualquier otro, se vende igual desde el POS) marcado con is_kit=true
 * -- lo único distinto es que no tiene stock propio: se calcula en vivo
 * desde sus componentes (ver Product::buildableQuantity()) y venderlo
 * descuenta stock de los componentes reales, no de sí mismo (ver
 * Product::resolverMovimientoStock(), usado en Sale/SaleReturn/CreditNote).
 *
 * Importante: un Product real SIEMPRE viene acompañado de un MainProduct
 * (dueño de la imagen) y de tax_type/sale_unit/purchase_unit resueltos --
 * el catálogo y el POS (resources/pos/src/frontend/components/product/
 * Product.js) asumen que todo producto los tiene. La primera versión de
 * este controlador no los seteaba, y el POS (a diferencia del formulario
 * de admin, que es más tolerante) reventaba con "Cannot read properties
 * of null" al listar un kit sin esos campos.
 */
class ProductKitAPIController extends AppBaseController
{
    private const RULES = [
        'name' => 'required|string|max:255',
        'product_price' => 'required|numeric|min:0',
        'product_category_id' => 'required|exists:product_categories,id',
        'brand_id' => 'required|exists:brands,id',
        'product_unit' => 'required|exists:base_units,id',
        'tax_type' => 'required|in:1,2',
        'order_tax' => 'nullable|numeric|min:0',
        'image' => 'nullable|image|mimes:jpg,jpeg,png|max:4096',
        'components' => 'required|array|min:1',
        'components.*.component_product_id' => 'required|exists:products,id',
        'components.*.component_product_presentation_id' => 'nullable|exists:product_presentations,id',
        'components.*.quantity' => 'required|numeric|min:0.0001',
    ];

    public function index(): JsonResponse
    {
        $kits = Product::where('is_kit', true)
            ->with('kitItems.component', 'kitItems.presentation.variationType')
            ->get()
            ->map(fn (Product $p) => $p->prepareAttributes() + ['id' => $p->id]);

        return $this->sendResponse($kits, 'Product kits retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $input = $request->all();
        $components = $this->decodeComponents($input);
        // No usar $input + [...] -- la unión de arrays de PHP conserva el
        // valor del lado IZQUIERDO en claves duplicadas, así que 'components'
        // (el JSON string original de FormData) ganaba y el array decodificado
        // se descartaba, haciendo fallar siempre "must be an array".
        $input['components'] = $components;
        $validator = Validator::make($input, self::RULES);
        if ($validator->fails()) {
            throw new UnprocessableEntityHttpException($validator->errors()->first());
        }

        $this->validarComponentes($components);

        try {
            DB::beginTransaction();

            $code = 'KIT-' . strtoupper(Str::random(8));

            // Un kit necesita su propio MainProduct -- es quien realmente
            // guarda la imagen (Product::prepareAttributes() lee
            // mainProduct->image_url, nunca la media del Product en sí).
            // product_type SINGLE_PRODUCT porque un kit no maneja variantes.
            $mainProduct = MainProduct::create([
                'name' => $input['name'],
                'code' => $code,
                'product_unit' => $input['product_unit'],
                'product_type' => MainProduct::SINGLE_PRODUCT,
                'store_id' => $this->requireCurrentStoreId(),
            ]);

            if ($request->hasFile('image')) {
                $mainProduct->addMedia($request->file('image'))
                    ->toMediaCollection(MainProduct::PATH, config('app.media_disc'));
            }

            $defaultUnitId = Unit::value('id');

            $kit = Product::create([
                'name' => $input['name'],
                'code' => $code,
                'product_code' => $code,
                'main_product_id' => $mainProduct->id,
                'product_category_id' => $input['product_category_id'],
                'brand_id' => $input['brand_id'],
                'product_cost' => $input['product_cost'] ?? 0,
                'product_price' => $input['product_price'],
                'product_unit' => $input['product_unit'],
                // No hay UI para elegir estos -- un kit no se "compra"
                // como tal, así que se les da el mismo valor por defecto
                // que ya usa el catálogo para no dejarlos null (eso era
                // justo lo que rompía el POS).
                'sale_unit' => $defaultUnitId,
                'purchase_unit' => $defaultUnitId,
                'order_tax' => $input['order_tax'] ?? 0,
                'tax_type' => $input['tax_type'],
                'barcode_symbol' => Product::CODE128,
                'is_kit' => true,
                'store_id' => $this->requireCurrentStoreId(),
            ]);

            foreach ($components as $component) {
                ProductKitItem::create([
                    'kit_product_id' => $kit->id,
                    'component_product_id' => $component['component_product_id'],
                    'component_product_presentation_id' => $component['component_product_presentation_id'] ?? null,
                    'quantity' => $component['quantity'],
                ]);
            }

            $kit->load('kitItems.component', 'kitItems.presentation.variationType');
            $kit->syncKitStock();

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }

        return $this->sendResponse($kit->fresh(['kitItems.component', 'kitItems.presentation.variationType'])->prepareAttributes() + ['id' => $kit->id], 'Kit created successfully');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $kit = Product::where('is_kit', true)->findOrFail($id);

        $input = $request->all();
        $components = $this->decodeComponents($input);
        $input['components'] = $components;
        $validator = Validator::make($input, self::RULES);
        if ($validator->fails()) {
            throw new UnprocessableEntityHttpException($validator->errors()->first());
        }

        $this->validarComponentes($components);

        try {
            DB::beginTransaction();

            $kit->update([
                'name' => $input['name'],
                'product_category_id' => $input['product_category_id'],
                'brand_id' => $input['brand_id'],
                'product_cost' => $input['product_cost'] ?? $kit->product_cost,
                'product_price' => $input['product_price'],
                'product_unit' => $input['product_unit'],
                'order_tax' => $input['order_tax'] ?? 0,
                'tax_type' => $input['tax_type'],
            ]);

            if ($request->hasFile('image')) {
                $mainProduct = MainProduct::find($kit->main_product_id);
                if (!$mainProduct) {
                    // Kits creados antes de este fix no tenían MainProduct
                    // -- se crea recién ahora, al primer intento de subirle
                    // una imagen.
                    $mainProduct = MainProduct::create([
                        'name' => $kit->name,
                        'code' => $kit->code,
                        'product_unit' => $kit->product_unit,
                        'product_type' => MainProduct::SINGLE_PRODUCT,
                        'store_id' => $kit->store_id,
                    ]);
                    $kit->update(['main_product_id' => $mainProduct->id]);
                }
                $mainProduct->clearMediaCollection(MainProduct::PATH);
                $mainProduct->addMedia($request->file('image'))
                    ->toMediaCollection(MainProduct::PATH, config('app.media_disc'));
            }

            // Reemplaza la receta completa -- más simple y menos propenso a
            // error que tratar de diffear altas/bajas/cambios de cantidad.
            ProductKitItem::where('kit_product_id', $kit->id)->delete();
            foreach ($components as $component) {
                ProductKitItem::create([
                    'kit_product_id' => $kit->id,
                    'component_product_id' => $component['component_product_id'],
                    'component_product_presentation_id' => $component['component_product_presentation_id'] ?? null,
                    'quantity' => $component['quantity'],
                ]);
            }

            $kit->load('kitItems.component', 'kitItems.presentation.variationType');
            $kit->syncKitStock();

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }

        return $this->sendResponse($kit->fresh(['kitItems.component', 'kitItems.presentation.variationType'])->prepareAttributes() + ['id' => $kit->id], 'Kit updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $kit = Product::where('is_kit', true)->findOrFail($id);

        try {
            DB::beginTransaction();
            ProductKitItem::where('kit_product_id', $kit->id)->delete();
            ManageStock::where('product_id', $kit->id)->delete();
            $kit->delete();
            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException(
                'No se pudo eliminar el kit -- probablemente ya tiene ventas registradas: ' . $e->getMessage()
            );
        }

        return $this->sendSuccess('Kit deleted successfully');
    }

    /**
     * El formulario manda 'components' como JSON string cuando el
     * request es multipart/form-data (necesario para poder mandar el
     * archivo de imagen en el mismo submit) -- un array anidado no
     * sobrevive ese formato tal cual.
     */
    private function decodeComponents(array $input): array
    {
        if (isset($input['components']) && is_string($input['components'])) {
            return json_decode($input['components'], true) ?? [];
        }

        return $input['components'] ?? [];
    }

    /**
     * Un componente no puede ser otro kit (evita recetas circulares/
     * anidadas, que Product::resolverMovimientoStock() no contempla) ni
     * repetirse dos veces en la misma receta.
     */
    private function validarComponentes(array $components): void
    {
        $ids = array_column($components, 'component_product_id');

        if (count($ids) !== count(array_unique($ids))) {
            throw new UnprocessableEntityHttpException('No se puede repetir el mismo componente dos veces en la receta.');
        }

        $kitsEntreComponentes = Product::whereIn('id', $ids)->where('is_kit', true)->pluck('name');
        if ($kitsEntreComponentes->isNotEmpty()) {
            throw new UnprocessableEntityHttpException(
                'Un kit no puede tener como componente a otro kit: ' . $kitsEntreComponentes->implode(', ')
            );
        }

        // La presentación elegida tiene que ser realmente de ESE producto
        // -- si no, la equivalencia usada para descontar stock sería la de
        // otro producto.
        foreach ($components as $component) {
            if (empty($component['component_product_presentation_id'])) {
                continue;
            }
            $pertenece = ProductPresentation::where('id', $component['component_product_presentation_id'])
                ->where('product_id', $component['component_product_id'])
                ->exists();
            if (!$pertenece) {
                throw new UnprocessableEntityHttpException('La presentación elegida no corresponde al producto seleccionado.');
            }
        }
    }
}
