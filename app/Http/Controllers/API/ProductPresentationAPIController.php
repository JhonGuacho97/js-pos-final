<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Models\Product;
use App\Models\ProductPresentation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * CRUD dedicado para product_presentations.
 *
 * Se maneja aparte del formulario general de producto (ProductForm) a
 * propósito: igual que el costo/precio/stock, las presentaciones son un
 * dato "vivo" que cambia con más frecuencia que los datos básicos del
 * producto (nombre, categoría, marca), así que tener su propio endpoint
 * evita mezclar su ciclo de vida con el de editar el producto.
 */
class ProductPresentationAPIController extends AppBaseController
{
    /**
     * Lista las presentaciones de un producto.
     * GET /api/product-presentations?product_id=123
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $product = Product::findOrFail($request->integer('product_id'));
        $this->authorizeStoreOwnership($product);

        $presentations = ProductPresentation::where('product_id', $product->id)
            ->orderBy('sort')
            ->get()
            ->map(fn (ProductPresentation $p) => $p->prepareAttributes());

        return $this->sendResponse($presentations, 'Product presentations retrieved successfully');
    }

    /**
     * Crea una presentación nueva para un producto que ya maneja presentaciones,
     * o activa manage_presentations si es la primera que se crea.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), ProductPresentation::$rules);
        if ($validator->fails()) {
            throw new UnprocessableEntityHttpException($validator->errors()->first());
        }

        try {
            DB::beginTransaction();

            $input = $request->all();
            $product = Product::findOrFail($input['product_id']);
            $this->authorizeStoreOwnership($product);
            $this->validatePresentationTypeStore($input['presentation_type_id'] ?? null, $product->store_id);

            if (!empty($input['is_base_unit'])) {
                ProductPresentation::where('product_id', $input['product_id'])->update(['is_base_unit' => false]);
            }
            if (!empty($input['is_default'])) {
                ProductPresentation::where('product_id', $input['product_id'])->update(['is_default' => false]);
            }

            $presentation = ProductPresentation::create($input);

            Product::whereId($input['product_id'])->update(['manage_presentations' => true]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }

        return $this->sendResponse($presentation->prepareAttributes(), 'Product presentation created successfully');
    }

    public function update(Request $request, $id): JsonResponse
    {
        $presentation = ProductPresentation::findOrFail($id);
        $this->authorizeStoreOwnership($presentation->product);

        $validator = Validator::make($request->all(), [
            'presentation_type_id' => 'required_without:variation_type_id|nullable|exists:presentation_types,id',
            'variation_type_id' => 'required_without:presentation_type_id|nullable|exists:variation_types,id',
            'equivalence' => 'required|numeric|min:0.0001',
            'price' => 'required|numeric|min:0',
            'is_base_unit' => 'boolean',
            'is_default' => 'boolean',
        ]);
        if ($validator->fails()) {
            throw new UnprocessableEntityHttpException($validator->errors()->first());
        }

        try {
            DB::beginTransaction();

            $input = $request->all();
            $this->validatePresentationTypeStore($input['presentation_type_id'] ?? null, $presentation->product->store_id);

            if (!empty($input['is_base_unit'])) {
                ProductPresentation::where('product_id', $presentation->product_id)
                    ->where('id', '!=', $id)
                    ->update(['is_base_unit' => false]);
            }
            if (!empty($input['is_default'])) {
                ProductPresentation::where('product_id', $presentation->product_id)
                    ->where('id', '!=', $id)
                    ->update(['is_default' => false]);
            }

            $presentation->update($input);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }

        return $this->sendResponse($presentation->fresh()->prepareAttributes(), 'Product presentation updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $presentation = ProductPresentation::findOrFail($id);
        $this->authorizeStoreOwnership($presentation->product);
        $productId = $presentation->product_id;

        // No permitir borrar la última presentación de un producto que
        // tiene manage_presentations activo: dejaría el producto sin forma
        // de venta configurada mientras el flag siga en true.
        $remaining = ProductPresentation::where('product_id', $productId)
            ->where('id', '!=', $id)
            ->count();

        if ($remaining === 0) {
            Product::whereId($productId)->update(['manage_presentations' => false]);
        }

        $presentation->delete();

        return $this->sendSuccess('Product presentation deleted successfully');
    }

    private function validatePresentationTypeStore(?int $presentationTypeId, int $storeId): void
    {
        if ($presentationTypeId && !\App\Models\PresentationType::whereKey($presentationTypeId)->where('store_id', $storeId)->exists()) {
            throw new UnprocessableEntityHttpException('La presentación no pertenece a la tienda activa.');
        }
    }
}
